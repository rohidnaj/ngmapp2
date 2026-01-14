/**
 * Individual File API Route
 *
 * Handles operations on specific files: retrieval, metadata, and deletion.
 */

import { NextRequest } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { FileSyncManager } from "@/lib/realtime-sync/file-sync-manager"

// Global file sync manager instance
let fileManager: FileSyncManager | null = null

function getFileManager(): FileSyncManager {
  if (!fileManager) {
    fileManager = new FileSyncManager()
  }
  return fileManager
}

// GET /api/files/[fileId] - Get file metadata
export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params
    const fileManager = getFileManager()

    const metadata = await fileManager.getFileMetadata(fileId)

    if (!metadata) {
      return Response.json({
        success: false,
        error: 'File not found'
      }, { status: 404 })
    }

    return Response.json({
      success: true,
      metadata,
    })
  } catch (error) {
    console.error(`[Files API] Error getting file ${params.fileId}:`, error)
    return Response.json({
      success: false,
      error: 'Failed to get file metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/files/[fileId] - Delete file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params
    const fileManager = getFileManager()

    // Get client ID from request body
    const body = await request.json().catch(() => ({}))
    const clientId = body.clientId || 'unknown-client'

    await fileManager.deleteFile(fileId, clientId)

    return Response.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    console.error(`[Files API] Error deleting file ${params.fileId}:`, error)

    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500

    return Response.json({
      success: false,
      error: 'Failed to delete file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: statusCode })
  }
}
