/**
 * File Upload API Route
 *
 * Handles file upload initiation and provides upload information.
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

// POST /api/files/upload/initiate - Initiate file upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, fileSize, mimeType, clientId } = body

    if (!fileName || !fileSize || !mimeType) {
      return Response.json({
        success: false,
        error: 'Missing required fields: fileName, fileSize, mimeType'
      }, { status: 400 })
    }

    const fileManager = getFileManager()

    // Generate checksum from client if provided, or create placeholder
    const checksum = body.checksum || undefined

    const result = await fileManager.initiateUpload(
      fileName,
      fileSize,
      mimeType,
      clientId || 'unknown-client',
      checksum
    )

    return Response.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('[Upload API] Error initiating upload:', error)

    const statusCode = error instanceof Error && error.message.includes('exceeds maximum') ? 413 : 500

    return Response.json({
      success: false,
      error: 'Failed to initiate upload',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: statusCode })
  }
}
