"use client"

import { useContent, type SyncStatus } from "@/lib/content-context"
import { cn } from "@/lib/utils"
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react"

export function SyncStatusIndicator() {
  const { syncStatus, lastSyncTime, clientId } = useContent()

  const statusConfig: Record<SyncStatus, { icon: typeof Wifi; label: string; color: string; bgColor: string }> = {
    connected: {
      icon: Wifi,
      label: "Live",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    connecting: {
      icon: RefreshCw,
      label: "Connecting...",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    syncing: {
      icon: RefreshCw,
      label: "Syncing...",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    disconnected: {
      icon: WifiOff,
      label: "Offline",
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    },
    error: {
      icon: AlertCircle,
      label: "Error",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  }

  const config = statusConfig[syncStatus]
  const Icon = config.icon

  const formatLastSync = () => {
    if (!lastSyncTime) return null
    const now = Date.now()
    const diff = now - lastSyncTime

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return `${Math.floor(diff / 3600000)}h ago`
  }

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-sm", config.bgColor, config.color)}>
      <Icon className={cn("h-4 w-4", syncStatus === "connecting" || syncStatus === "syncing" ? "animate-spin" : "")} />
      <span className="font-medium">{config.label}</span>
      {syncStatus === "connected" && lastSyncTime && <span className="text-xs opacity-75">• {formatLastSync()}</span>}
    </div>
  )
}

export function SyncStatusBadge() {
  const { syncStatus } = useContent()

  const colors: Record<SyncStatus, string> = {
    connected: "bg-green-500",
    connecting: "bg-amber-500 animate-pulse",
    syncing: "bg-blue-500 animate-pulse",
    disconnected: "bg-gray-400",
    error: "bg-red-500",
  }

  return (
    <span
      className={cn("inline-block h-2 w-2 rounded-full", colors[syncStatus])}
      title={`Sync status: ${syncStatus}`}
    />
  )
}
