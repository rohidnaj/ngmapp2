/**
 * Redis Pub/Sub for Multi-Instance Real-Time Synchronization
 *
 * Enables real-time communication across multiple server instances using Redis pub/sub.
 * This allows the real-time sync system to scale horizontally.
 */

import { createClient as createRedisClient, RedisClientType } from 'redis'
import { EventEmitter } from 'events'
import { SyncEvent, SyncClient } from './advanced-realtime-architecture'

export interface RedisPubSubConfig {
  url: string
  retryAttempts: number
  retryDelay: number
  heartbeatInterval: number
}

export interface InstanceInfo {
  id: string
  connectedAt: number
  lastHeartbeat: number
  clientCount: number
  channels: string[]
}

export class RedisPubSubManager extends EventEmitter {
  private publisher: RedisClientType
  private subscriber: RedisClientType
  private instanceId: string
  private config: RedisPubSubConfig
  private connected: boolean = false
  private instances: Map<string, InstanceInfo> = new Map()
  private heartbeatInterval?: NodeJS.Timeout
  private reconnectTimeout?: NodeJS.Timeout

  // Channels for different types of communication
  private readonly CHANNELS = {
    CONTENT_SYNC: 'sync:content',
    FILE_SYNC: 'sync:files',
    OPERATIONS: 'sync:operations',
    CLIENTS: 'sync:clients',
    HEARTBEAT: 'sync:heartbeat',
    INSTANCE_DISCOVERY: 'sync:instances',
  }

  constructor(config: RedisPubSubConfig) {
    super()
    this.config = config
    this.instanceId = `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    this.publisher = createRedisClient({ url: config.url })
    this.subscriber = createRedisClient({ url: config.url })

    this.setupEventHandlers()
  }

  // =============================================================================
  // CONNECTION MANAGEMENT
  // =============================================================================

  async connect(): Promise<void> {
    try {
      console.log(`[Redis] Connecting instance ${this.instanceId}`)

      await Promise.all([
        this.publisher.connect(),
        this.subscriber.connect(),
      ])

      this.connected = true
      console.log(`[Redis] Connected instance ${this.instanceId}`)

      // Subscribe to all channels
      await this.subscribeToChannels()

      // Start heartbeat
      this.startHeartbeat()

      // Announce instance presence
      await this.announceInstance()

      this.emit('connected', this.instanceId)

    } catch (error) {
      console.error(`[Redis] Connection failed for instance ${this.instanceId}:`, error)
      this.handleConnectionError(error as Error)
    }
  }

  private async subscribeToChannels(): Promise<void> {
    // Subscribe to all sync channels
    for (const channel of Object.values(this.CHANNELS)) {
      await this.subscriber.subscribe(channel, (message: string, channelName: string) => {
        this.handleMessage(channelName, message)
      })
    }

    console.log(`[Redis] Subscribed to channels:`, Object.values(this.CHANNELS))
  }

  private setupEventHandlers(): void {
    this.publisher.on('error', (error) => {
      console.error('[Redis Publisher] Error:', error)
      this.emit('publisher-error', error)
    })

    this.subscriber.on('error', (error) => {
      console.error('[Redis Subscriber] Error:', error)
      this.emit('subscriber-error', error)
    })

    this.on('disconnected', () => {
      this.connected = false
      this.stopHeartbeat()
      this.attemptReconnect()
    })
  }

  private handleConnectionError(error: Error): void {
    this.connected = false
    this.emit('connection-error', error)
    this.attemptReconnect()
  }

  private attemptReconnect(): void {
    if (this.reconnectTimeout) return

    this.reconnectTimeout = setTimeout(async () => {
      console.log(`[Redis] Attempting to reconnect instance ${this.instanceId}`)
      this.reconnectTimeout = undefined
      await this.connect()
    }, this.config.retryDelay)
  }

  async disconnect(): Promise<void> {
    console.log(`[Redis] Disconnecting instance ${this.instanceId}`)

    this.connected = false
    this.stopHeartbeat()

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = undefined
    }

    try {
      // Announce departure
      await this.publish(this.CHANNELS.INSTANCE_DISCOVERY, {
        type: 'instance-left',
        instanceId: this.instanceId,
        timestamp: Date.now(),
      })

      // Close connections
      await Promise.all([
        this.publisher.quit(),
        this.subscriber.quit(),
      ])

      console.log(`[Redis] Disconnected instance ${this.instanceId}`)
      this.emit('disconnected', this.instanceId)

    } catch (error) {
      console.error(`[Redis] Error during disconnect:`, error)
    }
  }

  // =============================================================================
  // HEARTBEAT AND INSTANCE DISCOVERY
  // =============================================================================

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      if (!this.connected) return

      try {
        await this.publish(this.CHANNELS.HEARTBEAT, {
          instanceId: this.instanceId,
          timestamp: Date.now(),
          clientCount: 0, // Would be populated with actual client count
        })
      } catch (error) {
        console.error('[Redis] Heartbeat failed:', error)
      }
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
    }
  }

  private async announceInstance(): Promise<void> {
    await this.publish(this.CHANNELS.INSTANCE_DISCOVERY, {
      type: 'instance-joined',
      instanceId: this.instanceId,
      connectedAt: Date.now(),
      channels: Object.values(this.CHANNELS),
    })
  }

  // =============================================================================
  // MESSAGE PUBLISHING AND HANDLING
  // =============================================================================

  async publish(channel: string, message: any): Promise<void> {
    if (!this.connected) {
      throw new Error('Redis not connected')
    }

    try {
      const messageStr = JSON.stringify({
        ...message,
        sourceInstance: this.instanceId,
        publishedAt: Date.now(),
      })

      await this.publisher.publish(channel, messageStr)
    } catch (error) {
      console.error(`[Redis] Failed to publish to ${channel}:`, error)
      throw error
    }
  }

  private handleMessage(channel: string, message: string): void {
    try {
      const parsedMessage = JSON.parse(message)

      // Ignore messages from self
      if (parsedMessage.sourceInstance === this.instanceId) {
        return
      }

      switch (channel) {
        case this.CHANNELS.CONTENT_SYNC:
          this.handleContentSync(parsedMessage)
          break
        case this.CHANNELS.FILE_SYNC:
          this.handleFileSync(parsedMessage)
          break
        case this.CHANNELS.OPERATIONS:
          this.handleOperationSync(parsedMessage)
          break
        case this.CHANNELS.CLIENTS:
          this.handleClientSync(parsedMessage)
          break
        case this.CHANNELS.HEARTBEAT:
          this.handleHeartbeat(parsedMessage)
          break
        case this.CHANNELS.INSTANCE_DISCOVERY:
          this.handleInstanceDiscovery(parsedMessage)
          break
        default:
          console.warn(`[Redis] Unknown channel: ${channel}`)
      }
    } catch (error) {
      console.error(`[Redis] Error handling message on channel ${channel}:`, error)
    }
  }

  private handleContentSync(message: any): void {
    this.emit('content-sync', message)
  }

  private handleFileSync(message: any): void {
    this.emit('file-sync', message)
  }

  private handleOperationSync(message: any): void {
    this.emit('operation-sync', message)
  }

  private handleClientSync(message: any): void {
    this.emit('client-sync', message)
  }

  private handleHeartbeat(message: any): void {
    const { instanceId, timestamp, clientCount } = message

    // Update instance info
    const instance = this.instances.get(instanceId)
    if (instance) {
      instance.lastHeartbeat = timestamp
      instance.clientCount = clientCount
    }

    this.emit('heartbeat', message)
  }

  private handleInstanceDiscovery(message: any): void {
    const { type, instanceId, connectedAt, channels, timestamp } = message

    if (type === 'instance-joined' && instanceId !== this.instanceId) {
      // New instance joined
      this.instances.set(instanceId, {
        id: instanceId,
        connectedAt,
        lastHeartbeat: timestamp,
        clientCount: 0,
        channels: channels || [],
      })

      console.log(`[Redis] Instance joined: ${instanceId}`)
      this.emit('instance-joined', instanceId)

    } else if (type === 'instance-left') {
      // Instance left
      this.instances.delete(instanceId)
      console.log(`[Redis] Instance left: ${instanceId}`)
      this.emit('instance-left', instanceId)
    }
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  async broadcastContentUpdate(event: SyncEvent): Promise<void> {
    await this.publish(this.CHANNELS.CONTENT_SYNC, event)
  }

  async broadcastFileEvent(event: SyncEvent): Promise<void> {
    await this.publish(this.CHANNELS.FILE_SYNC, event)
  }

  async broadcastOperation(operation: any): Promise<void> {
    await this.publish(this.CHANNELS.OPERATIONS, operation)
  }

  async broadcastClientUpdate(clients: SyncClient[]): Promise<void> {
    await this.publish(this.CHANNELS.CLIENTS, { clients })
  }

  getInstanceId(): string {
    return this.instanceId
  }

  getConnectedInstances(): InstanceInfo[] {
    return Array.from(this.instances.values())
  }

  isConnected(): boolean {
    return this.connected
  }

  getInstanceCount(): number {
    return this.instances.size + 1 // +1 for self
  }

  // =============================================================================
  // CLEANUP
  // =============================================================================

  async cleanup(): Promise<void> {
    await this.disconnect()
    this.instances.clear()
    this.removeAllListeners()
  }
}

// =============================================================================
// REACT HOOK FOR REDIS SYNC STATUS
// =============================================================================

export interface RedisSyncHookOptions {
  config: RedisPubSubConfig
  onInstanceConnected?: (instanceId: string) => void
  onInstanceDisconnected?: (instanceId: string) => void
  onSyncEvent?: (event: SyncEvent) => void
  enabled?: boolean
}

export function useRedisSync(options: RedisSyncHookOptions) {
  const {
    config,
    onInstanceConnected,
    onInstanceDisconnected,
    onSyncEvent,
    enabled = true,
  } = options

  const [manager, setManager] = useState<RedisPubSubManager | null>(null)
  const [connected, setConnected] = useState(false)
  const [instances, setInstances] = useState<InstanceInfo[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const redisManager = new RedisPubSubManager(config)

    // Set up event handlers
    redisManager.on('connected', () => {
      setConnected(true)
      setError(null)
    })

    redisManager.on('disconnected', () => {
      setConnected(false)
    })

    redisManager.on('connection-error', (err: Error) => {
      setError(err.message)
    })

    redisManager.on('instance-joined', (instanceId: string) => {
      onInstanceConnected?.(instanceId)
      setInstances(prev => [...prev, { id: instanceId, connectedAt: Date.now(), lastHeartbeat: Date.now(), clientCount: 0, channels: [] }])
    })

    redisManager.on('instance-left', (instanceId: string) => {
      onInstanceDisconnected?.(instanceId)
      setInstances(prev => prev.filter(inst => inst.id !== instanceId))
    })

    redisManager.on('content-sync', onSyncEvent)
    redisManager.on('file-sync', onSyncEvent)
    redisManager.on('operation-sync', onSyncEvent)

    // Connect
    redisManager.connect()
    setManager(redisManager)

    // Cleanup
    return () => {
      redisManager.cleanup()
    }
  }, [enabled, config, onInstanceConnected, onInstanceDisconnected, onSyncEvent])

  const broadcastContentUpdate = useCallback(async (event: SyncEvent) => {
    if (manager && connected) {
      await manager.broadcastContentUpdate(event)
    }
  }, [manager, connected])

  const broadcastFileEvent = useCallback(async (event: SyncEvent) => {
    if (manager && connected) {
      await manager.broadcastFileEvent(event)
    }
  }, [manager, connected])

  const broadcastOperation = useCallback(async (operation: any) => {
    if (manager && connected) {
      await manager.broadcastOperation(operation)
    }
  }, [manager, connected])

  return {
    connected,
    instances,
    instanceCount: instances.length + (connected ? 1 : 0),
    error,
    broadcastContentUpdate,
    broadcastFileEvent,
    broadcastOperation,
  }
}

// Required React imports
import { useState, useEffect, useCallback } from 'react'
