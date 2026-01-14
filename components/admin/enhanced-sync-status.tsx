"use client"

import { useContent } from "@/lib/content-context"
import { useRealtimeSync } from "@/hooks/use-realtime-sync"
import { cn } from "@/lib/utils"
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Server,
  Zap,
  Activity
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

type SyncStatus = "connecting" | "connected" | "disconnected" | "error" | "syncing"

interface SyncMetrics {
  latency: number
  messagesPerSecond: number
  connectedClients: number
  serverInstances: number
  uptime: number
}

export function EnhancedSyncStatus() {
  const { syncStatus, lastSyncTime, clientId } = useContent()
  const { status: wsStatus, connectedClients, lastSyncTime: wsLastSyncTime } = useRealtimeSync({
    enabled: true,
  })

  const [metrics, setMetrics] = useState<SyncMetrics>({
    latency: 0,
    messagesPerSecond: 0,
    connectedClients: 0,
    serverInstances: 1,
    uptime: 0,
  })

  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: number
  }>>([])

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        connectedClients: connectedClients.length,
        uptime: prev.uptime + 1,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [connectedClients.length])

  const getStatusConfig = (status: SyncStatus) => {
    const configs = {
      connected: {
        icon: Wifi,
        label: "Live Sync",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Real-time synchronization active",
      },
      connecting: {
        icon: RefreshCw,
        label: "Connecting...",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        description: "Establishing connection",
      },
      syncing: {
        icon: Activity,
        label: "Syncing...",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Synchronizing changes",
      },
      disconnected: {
        icon: WifiOff,
        label: "Offline",
        color: "text-gray-500",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-200",
        description: "Synchronization paused",
      },
      error: {
        icon: AlertCircle,
        label: "Error",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "Connection failed",
      },
    }
    return configs[status]
  }

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return "Never"
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return `${Math.floor(diff / 3600000)}h ago`
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  const addNotification = (
    type: 'info' | 'success' | 'warning' | 'error',
    title: string,
    message: string
  ) => {
    const notification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: Date.now(),
    }

    setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep last 10

    // Auto-remove after 5 seconds for non-error notifications
    if (type !== 'error') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    }
  }

  // Monitor status changes and add notifications
  useEffect(() => {
    if (syncStatus === 'connected' && wsStatus === 'connected') {
      addNotification('success', 'Connected', 'Real-time synchronization is now active')
    } else if (syncStatus === 'error' || wsStatus === 'error') {
      addNotification('error', 'Connection Error', 'Real-time synchronization failed')
    }
  }, [syncStatus, wsStatus])

  const statusConfig = getStatusConfig(syncStatus === 'connected' && wsStatus === 'connected' ? 'connected' : syncStatus)

  return (
    <TooltipProvider>
      <Card className={cn("border-2 transition-colors", statusConfig.borderColor)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <statusConfig.icon className={cn("h-4 w-4", statusConfig.color, syncStatus === 'connecting' && "animate-spin")} />
              {statusConfig.label}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {connectedClients.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Connected clients: {connectedClients.join(', ')}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs">
                    <Server className="h-3 w-3 mr-1" />
                    {metrics.serverInstances}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Server instances: {metrics.serverInstances}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status Description */}
          <p className="text-xs text-muted-foreground">{statusConfig.description}</p>

          {/* Connection Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Last Sync:</span>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {formatLastSync(lastSyncTime || wsLastSyncTime)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Uptime:</span>
              <div className="flex items-center gap-1 mt-1">
                <Zap className="h-3 w-3" />
                {formatUptime(metrics.uptime)}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {(syncStatus === 'connected' || wsStatus === 'connected') && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Latency</span>
                <span>{metrics.latency}ms</span>
              </div>
              <Progress value={Math.max(0, 100 - metrics.latency / 10)} className="h-1" />
            </div>
          )}

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Recent Activity</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-2 p-2 rounded text-xs",
                      {
                        'bg-blue-50 text-blue-700': notification.type === 'info',
                        'bg-green-50 text-green-700': notification.type === 'success',
                        'bg-amber-50 text-amber-700': notification.type === 'warning',
                        'bg-red-50 text-red-700': notification.type === 'error',
                      }
                    )}
                  >
                    {notification.type === 'success' && <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    {notification.type === 'error' && <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    {notification.type === 'warning' && <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    {notification.type === 'info' && <Activity className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-muted-foreground truncate">{notification.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client ID (truncated for display) */}
          {clientId && (
            <div className="text-xs text-muted-foreground">
              Client: {clientId.slice(0, 8)}...
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

// =============================================================================
// SYNC DASHBOARD COMPONENT
// =============================================================================

export function SyncDashboard() {
  const { syncStatus, clientId } = useContent()
  const { status: wsStatus, connectedClients, broadcastEvent } = useRealtimeSync({
    enabled: true,
  })

  const [syncStats, setSyncStats] = useState({
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    averageLatency: 0,
  })

  const handleManualSync = async () => {
    try {
      await broadcastEvent({
        type: 'system-event',
        data: { action: 'manual-sync', clientId },
      })
    } catch (error) {
      console.error('Manual sync failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EnhancedSyncStatus />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sync Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total Operations</span>
              <span className="font-medium">{syncStats.totalOperations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Success Rate</span>
              <span className="font-medium text-green-600">
                {syncStats.totalOperations > 0
                  ? Math.round((syncStats.successfulOperations / syncStats.totalOperations) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average Latency</span>
              <span className="font-medium">{syncStats.averageLatency}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Connected Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {connectedClients.length === 0 ? (
                <p className="text-sm text-muted-foreground">No other clients connected</p>
              ) : (
                connectedClients.map(clientId => (
                  <div key={clientId} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="font-mono text-xs">{clientId.slice(0, 8)}...</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Sync Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleManualSync}
              disabled={syncStatus !== 'connected' || wsStatus !== 'connected'}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Manual Sync
            </Button>
            <Button size="sm" variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Required imports
import { useState, useEffect } from "react"
