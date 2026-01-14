/**
 * Files API Route
 *
 * Handles file operations including listing, metadata retrieval, and deletion.
 */

import { NextRequest } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { FileSyncManager, FileMetadata } from "@/lib/realtime-sync/file-sync-manager"

// Global file sync manager instance
let fileManager: FileSyncManager | null = null

function getFileManager(): FileSyncManager {
  if (!fileManager) {
    fileManager = new FileSyncManager()
  }
  return fileManager
}

// GET /api/files - List all files
export async function GET(request: NextRequest) {
  try {
    const fileManager = getFileManager()
    const files = await fileManager.listFiles()

    return Response.json({
      success: true,
      files,
      count: files.length,
    })
  } catch (error) {
    console.error('[Files API] Error listing files:', error)
    return Response.json({
      success: false,
      error: 'Failed to list files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
