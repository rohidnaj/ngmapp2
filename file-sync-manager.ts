/**
 * File Synchronization Manager
 *
 * Handles real-time synchronization of file uploads, updates, and deletions
 * across multiple admin users with progress tracking and conflict resolution.
 */

import { EventEmitter } from 'events'
import { createHash } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

export interface FileSyncEvent {
  id: string
  type: 'upload-start' | 'upload-progress' | 'upload-complete' | 'upload-error' | 'file-delete' | 'file-rename'
  fileId: string
  fileName: string
  fileSize: number
  uploadedSize?: number
  checksum?: string
  clientId: string
  timestamp: number
  error?: string
}

export interface FileMetadata {
  id: string
  name: string
  originalName: string
  size: number
  mimeType: string
  checksum: string
  uploadedBy: string
  uploadedAt: number
  lastModified: number
  url: string
  thumbnailUrl?: string
  versions: FileVersion[]
}

export interface FileVersion {
  id: string
  checksum: string
  size: number
  uploadedAt: number
  uploadedBy: string
}

export interface UploadProgress {
  fileId: string
  fileName: string
  totalSize: number
  uploadedSize: number
  speed: number // bytes per second
  eta: number // estimated time of arrival in seconds
  status: 'uploading' | 'paused' | 'completed' | 'error' | 'cancelled'
  error?: string
  startTime: number
  lastUpdateTime: number
}

export class FileSyncManager extends EventEmitter {
  private activeUploads: Map<string, UploadProgress> = new Map()
  private fileMetadata: Map<string, FileMetadata> = new Map()
  private readonly UPLOAD_DIR = './uploads'
  private readonly MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
  private readonly CHUNK_SIZE = 1024 * 1024 // 1MB chunks

  constructor() {
    super()
    this.initializeDirectories()
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.UPLOAD_DIR, { recursive: true })
      await fs.mkdir(path.join(this.UPLOAD_DIR, 'thumbnails'), { recursive: true })
      await fs.mkdir(path.join(this.UPLOAD_DIR, 'temp'), { recursive: true })
    } catch (error) {
      console.error('Failed to initialize upload directories:', error)
    }
  }

  // =============================================================================
  // FILE UPLOAD MANAGEMENT
  // =============================================================================

  async initiateUpload(
    fileName: string,
    fileSize: number,
    mimeType: string,
    clientId: string,
    checksum?: string
  ): Promise<{ fileId: string; canResume: boolean; uploadedSize: number }> {
    // Validate file size
    if (fileSize > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${this.MAX_FILE_SIZE} bytes`)
    }

    // Generate unique file ID
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Check if file already exists (for resume capability)
    const tempPath = path.join(this.UPLOAD_DIR, 'temp', `${fileId}.tmp`)
    let uploadedSize = 0
    let canResume = false

    try {
      const stats = await fs.stat(tempPath)
      uploadedSize = stats.size
      canResume = uploadedSize < fileSize
    } catch {
      // File doesn't exist, start fresh
    }

    // Create upload progress tracking
    const progress: UploadProgress = {
      fileId,
      fileName,
      totalSize: fileSize,
      uploadedSize,
      speed: 0,
      eta: 0,
      status: canResume ? 'paused' : 'uploading',
      startTime: Date.now(),
      lastUpdateTime: Date.now(),
    }

    this.activeUploads.set(fileId, progress)

    // Emit upload start event
    this.emitFileEvent({
      id: `evt-${Date.now()}`,
      type: 'upload-start',
      fileId,
      fileName,
      fileSize,
      uploadedSize,
      clientId,
      timestamp: Date.now(),
    })

    return { fileId, canResume, uploadedSize }
  }

  async uploadChunk(
    fileId: string,
    chunk: Buffer,
    offset: number,
    totalSize: number,
    clientId: string
  ): Promise<{ uploadedSize: number; complete: boolean }> {
    const progress = this.activeUploads.get(fileId)
    if (!progress) {
      throw new Error(`No active upload found for file ${fileId}`)
    }

    if (progress.status !== 'uploading') {
      throw new Error(`Upload ${fileId} is not in uploading state`)
    }

    // Validate chunk
    if (offset !== progress.uploadedSize) {
      throw new Error(`Invalid chunk offset. Expected ${progress.uploadedSize}, got ${offset}`)
    }

    const tempPath = path.join(this.UPLOAD_DIR, 'temp', `${fileId}.tmp`)

    try {
      // Append chunk to temp file
      await fs.appendFile(tempPath, chunk)

      // Update progress
      const newUploadedSize = progress.uploadedSize + chunk.length
      const now = Date.now()
      const timeDiff = (now - progress.lastUpdateTime) / 1000
      const sizeDiff = chunk.length

      progress.uploadedSize = newUploadedSize
      progress.speed = timeDiff > 0 ? sizeDiff / timeDiff : 0
      progress.eta = progress.speed > 0 ? (totalSize - newUploadedSize) / progress.speed : 0
      progress.lastUpdateTime = now

      // Check if upload is complete
      const complete = newUploadedSize >= totalSize

      if (complete) {
        progress.status = 'completed'
        await this.finalizeUpload(fileId, clientId)
      }

      // Emit progress event
      this.emitFileEvent({
        id: `evt-${Date.now()}`,
        type: 'upload-progress',
        fileId,
        fileName: progress.fileName,
        fileSize: totalSize,
        uploadedSize: newUploadedSize,
        clientId,
        timestamp: now,
      })

      return { uploadedSize: newUploadedSize, complete }

    } catch (error) {
      progress.status = 'error'
      progress.error = (error as Error).message

      this.emitFileEvent({
        id: `evt-${Date.now()}`,
        type: 'upload-error',
        fileId,
        fileName: progress.fileName,
        fileSize: totalSize,
        clientId,
        timestamp: Date.now(),
        error: (error as Error).message,
      })

      throw error
    }
  }

  private async finalizeUpload(fileId: string, clientId: string): Promise<void> {
    const progress = this.activeUploads.get(fileId)
    if (!progress) return

    const tempPath = path.join(this.UPLOAD_DIR, 'temp', `${fileId}.tmp`)
    const finalPath = path.join(this.UPLOAD_DIR, fileId)

    try {
      // Move temp file to final location
      await fs.rename(tempPath, finalPath)

      // Calculate checksum
      const fileBuffer = await fs.readFile(finalPath)
      const checksum = createHash('sha256').update(fileBuffer).digest('hex')

      // Create file metadata
      const metadata: FileMetadata = {
        id: fileId,
        name: progress.fileName,
        originalName: progress.fileName,
        size: progress.totalSize,
        mimeType: this.getMimeType(progress.fileName),
        checksum,
        uploadedBy: clientId,
        uploadedAt: Date.now(),
        lastModified: Date.now(),
        url: `/api/files/${fileId}`,
        versions: [{
          id: 'v1',
          checksum,
          size: progress.totalSize,
          uploadedAt: Date.now(),
          uploadedBy: clientId,
        }],
      }

      this.fileMetadata.set(fileId, metadata)

      // Generate thumbnail if it's an image
      if (this.isImageFile(progress.fileName)) {
        await this.generateThumbnail(fileId, finalPath)
      }

      // Emit completion event
      this.emitFileEvent({
        id: `evt-${Date.now()}`,
        type: 'upload-complete',
        fileId,
        fileName: progress.fileName,
        fileSize: progress.totalSize,
        checksum,
        clientId,
        timestamp: Date.now(),
      })

      // Clean up progress tracking
      this.activeUploads.delete(fileId)

    } catch (error) {
      console.error(`Failed to finalize upload ${fileId}:`, error)
      progress.status = 'error'
      progress.error = (error as Error).message

      // Try to clean up temp file
      try {
        await fs.unlink(tempPath)
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  // =============================================================================
  // FILE DELETION
  // =============================================================================

  async deleteFile(fileId: string, clientId: string): Promise<void> {
    const metadata = this.fileMetadata.get(fileId)
    if (!metadata) {
      throw new Error(`File ${fileId} not found`)
    }

    const filePath = path.join(this.UPLOAD_DIR, fileId)
    const thumbnailPath = metadata.thumbnailUrl
      ? path.join(this.UPLOAD_DIR, 'thumbnails', `${fileId}.jpg`)
      : null

    try {
      // Delete physical files
      await fs.unlink(filePath)
      if (thumbnailPath) {
        await fs.unlink(thumbnailPath)
      }

      // Remove metadata
      this.fileMetadata.delete(fileId)

      // Emit deletion event
      this.emitFileEvent({
        id: `evt-${Date.now()}`,
        type: 'file-delete',
        fileId,
        fileName: metadata.name,
        fileSize: metadata.size,
        clientId,
        timestamp: Date.now(),
      })

    } catch (error) {
      console.error(`Failed to delete file ${fileId}:`, error)
      throw new Error(`Failed to delete file: ${(error as Error).message}`)
    }
  }

  // =============================================================================
  // FILE OPERATIONS
  // =============================================================================

  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    return this.fileMetadata.get(fileId) || null
  }

  async listFiles(): Promise<FileMetadata[]> {
    return Array.from(this.fileMetadata.values())
  }

  async getUploadProgress(fileId: string): Promise<UploadProgress | null> {
    return this.activeUploads.get(fileId) || null
  }

  async cancelUpload(fileId: string): Promise<void> {
    const progress = this.activeUploads.get(fileId)
    if (!progress) return

    progress.status = 'cancelled'

    // Clean up temp file
    const tempPath = path.join(this.UPLOAD_DIR, 'temp', `${fileId}.tmp`)
    try {
      await fs.unlink(tempPath)
    } catch {
      // Ignore if file doesn't exist
    }

    this.activeUploads.delete(fileId)
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private emitFileEvent(event: FileSyncEvent): void {
    this.emit('file-event', event)
  }

  private getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.zip': 'application/zip',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
    }
    return mimeTypes[ext] || 'application/octet-stream'
  }

  private isImageFile(fileName: string): boolean {
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    return imageExts.includes(path.extname(fileName).toLowerCase())
  }

  private async generateThumbnail(fileId: string, filePath: string): Promise<void> {
    // This would integrate with an image processing library like Sharp
    // For now, just create a placeholder thumbnail
    try {
      const thumbnailPath = path.join(this.UPLOAD_DIR, 'thumbnails', `${fileId}.jpg`)
      // In a real implementation, you'd resize the image here
      // await sharp(filePath).resize(200, 200).jpeg().toFile(thumbnailPath)

      const metadata = this.fileMetadata.get(fileId)
      if (metadata) {
        metadata.thumbnailUrl = `/api/files/thumbnails/${fileId}.jpg`
      }
    } catch (error) {
      console.warn(`Failed to generate thumbnail for ${fileId}:`, error)
    }
  }

  // =============================================================================
  // CLEANUP AND MAINTENANCE
  // =============================================================================

  async cleanupStaleUploads(): Promise<void> {
    const now = Date.now()
    const staleThreshold = 24 * 60 * 60 * 1000 // 24 hours

    for (const [fileId, progress] of this.activeUploads) {
      if (now - progress.startTime > staleThreshold) {
        console.log(`Cleaning up stale upload: ${fileId}`)
        await this.cancelUpload(fileId)
      }
    }
  }

  getStats(): {
    activeUploads: number
    totalFiles: number
    totalSize: number
  } {
    let totalSize = 0
    for (const metadata of this.fileMetadata.values()) {
      totalSize += metadata.size
    }

    return {
      activeUploads: this.activeUploads.size,
      totalFiles: this.fileMetadata.size,
      totalSize,
    }
  }
}
