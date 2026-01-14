/**
 * Optimistic Updates and Conflict Resolution System
 *
 * Provides optimistic UI updates with automatic rollback on conflicts,
 * and intelligent conflict resolution strategies.
 */

import { SyncOperation, Conflict, ConflictResolution } from './advanced-realtime-architecture'

export interface OptimisticUpdate {
  id: string
  operation: SyncOperation
  originalData: any
  updatedData: any
  timestamp: number
  rollback?: () => void
  status: 'pending' | 'applied' | 'failed' | 'rolled-back'
}

export interface ConflictResolutionStrategy {
  name: string
  description: string
  canResolve: (conflicts: Conflict[]) => boolean
  resolve: (conflicts: Conflict[], localData: any, remoteData: any) => any
}

export class OptimisticUpdateManager {
  private updates: Map<string, OptimisticUpdate> = new Map()
  private conflictResolver: ConflictResolutionManager

  constructor() {
    this.conflictResolver = new ConflictResolutionManager()
  }

  // =============================================================================
  // OPTIMISTIC UPDATES
  // =============================================================================

  applyOptimisticUpdate(
    operation: SyncOperation,
    originalData: any,
    applyUpdate: (data: any) => void,
    rollbackUpdate: (data: any) => void
  ): string {
    const updateId = `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const optimisticUpdate: OptimisticUpdate = {
      id: updateId,
      operation,
      originalData,
      updatedData: this.applyOperationToData(operation, originalData),
      timestamp: Date.now(),
      rollback: () => rollbackUpdate(originalData),
      status: 'pending',
    }

    // Store the update
    this.updates.set(updateId, optimisticUpdate)

    // Apply the optimistic update to the UI
    applyUpdate(optimisticUpdate.updatedData)
    optimisticUpdate.status = 'applied'

    // Set up automatic rollback after timeout (in case server doesn't respond)
    setTimeout(() => {
      const update = this.updates.get(updateId)
      if (update && update.status === 'applied') {
        console.warn(`Optimistic update ${updateId} timed out, rolling back`)
        this.rollbackUpdate(updateId)
      }
    }, 10000) // 10 second timeout

    return updateId
  }

  confirmUpdate(updateId: string): void {
    const update = this.updates.get(updateId)
    if (update) {
      update.status = 'applied'
      // Keep successful updates for potential future rollbacks
    }
  }

  rollbackUpdate(updateId: string): void {
    const update = this.updates.get(updateId)
    if (update && update.status === 'applied' && update.rollback) {
      update.rollback()
      update.status = 'rolled-back'
      console.log(`Rolled back optimistic update ${updateId}`)
    }
  }

  failUpdate(updateId: string, error?: string): void {
    const update = this.updates.get(updateId)
    if (update) {
      update.status = 'failed'
      this.rollbackUpdate(updateId)

      if (error) {
        console.error(`Optimistic update ${updateId} failed:`, error)
      }
    }
  }

  // =============================================================================
  // CONFLICT DETECTION AND RESOLUTION
  // =============================================================================

  detectConflicts(operation: SyncOperation, remoteData: any): Conflict[] {
    const conflicts: Conflict[] = []

    // Compare the operation data with remote data
    this.compareObjects(operation.data, remoteData, '', conflicts, operation)

    return conflicts
  }

  private compareObjects(
    local: any,
    remote: any,
    path: string,
    conflicts: Conflict[],
    operation: SyncOperation
  ): void {
    if (typeof local !== typeof remote) {
      conflicts.push({
        field: path,
        localValue: local,
        remoteValue: remote,
        lastModified: operation.id ? parseInt(operation.id.split('-')[1]) : Date.now(),
      })
      return
    }

    if (typeof local !== 'object' || local === null || remote === null) {
      if (local !== remote) {
        conflicts.push({
          field: path,
          localValue: local,
          remoteValue: remote,
          lastModified: operation.id ? parseInt(operation.id.split('-')[1]) : Date.now(),
        })
      }
      return
    }

    // Compare arrays
    if (Array.isArray(local) && Array.isArray(remote)) {
      if (local.length !== remote.length) {
        conflicts.push({
          field: path,
          localValue: local,
          remoteValue: remote,
          lastModified: operation.id ? parseInt(operation.id.split('-')[1]) : Date.now(),
        })
      } else {
        for (let i = 0; i < local.length; i++) {
          this.compareObjects(local[i], remote[i], `${path}[${i}]`, conflicts, operation)
        }
      }
      return
    }

    // Compare objects
    const allKeys = new Set([...Object.keys(local), ...Object.keys(remote)])

    for (const key of allKeys) {
      const localValue = local[key]
      const remoteValue = remote[key]

      if (!(key in local)) {
        conflicts.push({
          field: path ? `${path}.${key}` : key,
          localValue: undefined,
          remoteValue: remoteValue,
          lastModified: operation.id ? parseInt(operation.id.split('-')[1]) : Date.now(),
        })
      } else if (!(key in remote)) {
        conflicts.push({
          field: path ? `${path}.${key}` : key,
          localValue: localValue,
          remoteValue: undefined,
          lastModified: operation.id ? parseInt(operation.id.split('-')[1]) : Date.now(),
        })
      } else {
        this.compareObjects(localValue, remoteValue, path ? `${path}.${key}` : key, conflicts, operation)
      }
    }
  }

  // =============================================================================
  // CONFLICT RESOLUTION STRATEGIES
  // =============================================================================

  resolveConflicts(conflicts: Conflict[], strategy: 'merge' | 'overwrite' | 'manual' = 'merge'): ConflictResolution {
    const strategyImpl = this.conflictResolver.getStrategy(strategy)

    if (!strategyImpl.canResolve(conflicts)) {
      return {
        operationId: '',
        conflicts,
        resolution: 'manual',
      }
    }

    try {
      const mergedData = strategyImpl.resolve(conflicts, {}, {}) // Would need actual data

      return {
        operationId: '',
        conflicts,
        resolution: 'merge',
        mergedData,
      }
    } catch (error) {
      console.error('Conflict resolution failed:', error)
      return {
        operationId: '',
        conflicts,
        resolution: 'manual',
      }
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private applyOperationToData(operation: SyncOperation, data: any): any {
    // Apply the operation to create optimistic data
    // This is a simplified implementation - real implementation would be more sophisticated
    switch (operation.type) {
      case 'update':
        return this.deepMerge(data, operation.data)
      case 'create':
        // For create operations, we'd need to know where to add the item
        return data
      case 'delete':
        // For delete operations, we'd need to know what to remove
        return data
      default:
        return data
    }
  }

  private deepMerge(target: any, source: any): any {
    if (typeof source !== 'object' || source === null) {
      return source
    }

    if (typeof target !== 'object' || target === null) {
      return source
    }

    const result = Array.isArray(target) ? [...target] : { ...target }

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object') {
        result[key] = this.deepMerge(result[key], source[key])
      } else {
        result[key] = source[key]
      }
    }

    return result
  }

  getActiveUpdates(): OptimisticUpdate[] {
    return Array.from(this.updates.values()).filter(update => update.status === 'applied')
  }

  clearCompletedUpdates(): void {
    for (const [id, update] of this.updates) {
      if (update.status === 'applied' || update.status === 'rolled-back' || update.status === 'failed') {
        // Keep completed updates for a short time in case they're needed
        setTimeout(() => {
          this.updates.delete(id)
        }, 60000) // 1 minute
      }
    }
  }
}

export class ConflictResolutionManager {
  private strategies: Map<string, ConflictResolutionStrategy> = new Map()

  constructor() {
    this.registerDefaultStrategies()
  }

  registerStrategy(name: string, strategy: ConflictResolutionStrategy): void {
    this.strategies.set(name, strategy)
  }

  getStrategy(name: string): ConflictResolutionStrategy {
    const strategy = this.strategies.get(name)
    if (!strategy) {
      throw new Error(`Unknown conflict resolution strategy: ${name}`)
    }
    return strategy
  }

  private registerDefaultStrategies(): void {
    // Last Write Wins
    this.registerStrategy('overwrite', {
      name: 'Last Write Wins',
      description: 'Accepts the most recently modified value',
      canResolve: () => true,
      resolve: (conflicts, localData, remoteData) => {
        let result = { ...localData }
        for (const conflict of conflicts) {
          // Choose the value with the most recent timestamp
          result[conflict.field] = conflict.lastModified > Date.now() - 1000 ? conflict.localValue : conflict.remoteValue
        }
        return result
      },
    })

    // Merge Strategy
    this.registerStrategy('merge', {
      name: 'Merge',
      description: 'Attempts to merge non-conflicting changes',
      canResolve: (conflicts) => {
        // Can resolve if there are no overlapping field conflicts
        const fields = new Set(conflicts.map(c => c.field))
        return fields.size === conflicts.length
      },
      resolve: (conflicts, localData, remoteData) => {
        const result = { ...localData }
        for (const conflict of conflicts) {
          // Simple merge - prefer local changes for now
          result[conflict.field] = conflict.localValue
        }
        return result
      },
    })

    // Manual Resolution Required
    this.registerStrategy('manual', {
      name: 'Manual Resolution',
      description: 'Requires manual conflict resolution',
      canResolve: () => false,
      resolve: () => {
        throw new Error('Manual resolution required')
      },
    })
  }
}

// =============================================================================
// REACT HOOK INTEGRATION
// =============================================================================

export interface OptimisticUpdateHookOptions {
  onConflictDetected?: (conflicts: Conflict[]) => void
  onUpdateFailed?: (error: string) => void
  onUpdateRolledBack?: (updateId: string) => void
  autoResolveConflicts?: boolean
  defaultResolutionStrategy?: 'merge' | 'overwrite' | 'manual'
}

export function useOptimisticUpdates(options: OptimisticUpdateHookOptions = {}) {
  const {
    onConflictDetected,
    onUpdateFailed,
    onUpdateRolledBack,
    autoResolveConflicts = true,
    defaultResolutionStrategy = 'merge',
  } = options

  const updateManager = useRef(new OptimisticUpdateManager())

  const applyUpdate = useCallback((
    operation: SyncOperation,
    currentData: any,
    onUpdateApplied: (newData: any) => void,
    onUpdateRolledBack: (originalData: any) => void
  ) => {
    return updateManager.current.applyOptimisticUpdate(
      operation,
      currentData,
      onUpdateApplied,
      onUpdateRolledBack
    )
  }, [])

  const confirmUpdate = useCallback((updateId: string) => {
    updateManager.current.confirmUpdate(updateId)
  }, [])

  const failUpdate = useCallback((updateId: string, error?: string) => {
    updateManager.current.failUpdate(updateId, error)
    onUpdateFailed?.(error || 'Update failed')
  }, [onUpdateFailed])

  const handleConflicts = useCallback((conflicts: Conflict[], operation: SyncOperation) => {
    onConflictDetected?.(conflicts)

    if (autoResolveConflicts) {
      const resolution = updateManager.current.resolveConflicts(conflicts, defaultResolutionStrategy)

      if (resolution.resolution !== 'manual') {
        // Apply the resolved data
        console.log('Auto-resolved conflicts:', resolution)
      } else {
        // Manual resolution required
        console.warn('Manual conflict resolution required:', conflicts)
      }
    }
  }, [autoResolveConflicts, defaultResolutionStrategy, onConflictDetected])

  const rollbackUpdate = useCallback((updateId: string) => {
    updateManager.current.rollbackUpdate(updateId)
    onUpdateRolledBack?.(updateId)
  }, [onUpdateRolledBack])

  // Cleanup completed updates periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      updateManager.current.clearCompletedUpdates()
    }, 30000) // Clean up every 30 seconds

    return () => clearInterval(cleanup)
  }, [])

  return {
    applyUpdate,
    confirmUpdate,
    failUpdate,
    rollbackUpdate,
    handleConflicts,
    getActiveUpdates: () => updateManager.current.getActiveUpdates(),
  }
}

// Required React import for hooks
import { useCallback, useEffect, useRef } from 'react'
