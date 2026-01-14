/**
 * File Chunk Upload API Route
 *
 * Handles resumable file uploads in chunks for large files.
 */

import { NextRequest } from "next/server"
import { FileSyncManager } from "@/lib/realtime-sync/file-sync-manager"

// Global file sync manager instance
let fileManager: FileSyncManager | null = null

function getFileManager(): FileSyncManager {
  if (!fileManager) {
    fileManager = new FileSyncManager()
  }
  return fileManager
}

// POST /api/files/upload/[fileId] - Upload file chunk
export async function POST(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params

    // Parse multipart form data
    const formData = await request.formData()
    const chunk = formData.get('chunk') as File
    const offset = parseInt(formData.get('offset') as string)
    const totalSize = parseInt(formData.get('totalSize') as string)

    if (!chunk || isNaN(offset) || isNaN(totalSize)) {
      return Response.json({
        success: false,
        error: 'Missing or invalid required fields: chunk, offset, totalSize'
      }, { status: 400 })
    }

    // Convert File to Buffer
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer())

    const fileManager = getFileManager()

    // Extract client ID from headers or use default
    const clientId = request.headers.get('x-client-id') || 'unknown-client'

    const result = await fileManager.uploadChunk(
      fileId,
      chunkBuffer,
      offset,
      totalSize,
      clientId
    )

    return Response.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error(`[Upload API] Error uploading chunk for ${params.fileId}:`, error)

    const statusCode = error instanceof Error && error.message.includes('Invalid chunk offset') ? 409 : 500

    return Response.json({
      success: false,
      error: 'Failed to upload chunk',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: statusCode })
  }
}

// DELETE /api/files/upload/[fileId]/cancel - Cancel upload
export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params
    const fileManager = getFileManager()

    await fileManager.cancelUpload(fileId)

    return Response.json({
      success: true,
      message: 'Upload cancelled successfully',
    })
  } catch (error) {
    console.error(`[Upload API] Error cancelling upload ${params.fileId}:`, error)
    return Response.json({
      success: false,
      error: 'Failed to cancel upload',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
