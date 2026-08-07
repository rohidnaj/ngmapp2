"use client"

import { useState, useCallback } from "react"
import type { FileMetadata, UploadProgress } from "@/lib/realtime-sync/file-sync-manager"

export interface FileUploadHookOptions {
  onProgress?: (progress: UploadProgress) => void
  onComplete?: (fileId: string, metadata: FileMetadata) => void
  onError?: (error: string) => void
  chunkSize?: number
}

export function useFileUpload(options: FileUploadHookOptions = {}) {
  const {
    onProgress,
    onComplete,
    onError,
    chunkSize = 1024 * 1024, // 1MB
  } = options

  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map())

  const initiateUpload = useCallback(async (
    file: File,
    clientId: string
  ): Promise<string> => {
    try {
      const response = await fetch('/api/files/upload/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          clientId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to initiate upload: ${response.statusText}`)
      }

      const { fileId, canResume, uploadedSize } = await response.json()

      // Start the upload process
      uploadFile(fileId, file, uploadedSize)

      return fileId
    } catch (error) {
      onError?.((error as Error).message)
      throw error
    }
  }, [onError])

  const uploadFile = useCallback(async (
    fileId: string,
    file: File,
    startOffset: number = 0
  ): Promise<void> => {
    const totalSize = file.size
    let offset = startOffset

    const uploadChunk = async (chunk: Blob, chunkOffset: number): Promise<boolean> => {
      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('offset', chunkOffset.toString())
      formData.append('totalSize', totalSize.toString())

      const response = await fetch(`/api/files/upload/${fileId}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const { uploadedSize, complete } = await response.json()

      // Update progress
      const progress: UploadProgress = {
        fileId,
        fileName: file.name,
        totalSize,
        uploadedSize,
        speed: 0, // Would calculate actual speed
        eta: 0, // Would calculate ETA
        status: complete ? 'completed' : 'uploading',
        startTime: Date.now(),
        lastUpdateTime: Date.now(),
      }

      setUploads(prev => new Map(prev).set(fileId, progress))
      onProgress?.(progress)

      if (complete) {
        // Get final metadata
        const metadataResponse = await fetch(`/api/files/${fileId}/metadata`)
        if (metadataResponse.ok) {
          const metadata = await metadataResponse.json()
          onComplete?.(fileId, metadata)
        }
      }

      return complete
    }

    try {
      while (offset < totalSize) {
        const end = Math.min(offset + chunkSize, totalSize)
        const chunk = file.slice(offset, end)

        const complete = await uploadChunk(chunk, offset)
        if (complete) break

        offset = end
      }
    } catch (error) {
      onError?.((error as Error).message)
      setUploads(prev => {
        const newUploads = new Map(prev)
        const upload = newUploads.get(fileId)
        if (upload) {
          upload.status = 'error'
          upload.error = (error as Error).message
        }
        return newUploads
      })
    }
  }, [chunkSize, onProgress, onComplete, onError])

  const cancelUpload = useCallback(async (fileId: string): Promise<void> => {
    try {
      await fetch(`/api/files/upload/${fileId}/cancel`, { method: 'POST' })
      setUploads(prev => {
        const newUploads = new Map(prev)
        newUploads.delete(fileId)
        return newUploads
      })
    } catch (error) {
      onError?.((error as Error).message)
    }
  }, [onError])

  const deleteFile = useCallback(async (fileId: string, clientId: string): Promise<void> => {
    try {
      await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      })
    } catch (error) {
      onError?.((error as Error).message)
    }
  }, [onError])

  return {
    uploads,
    initiateUpload,
    cancelUpload,
    deleteFile,
  }
}
