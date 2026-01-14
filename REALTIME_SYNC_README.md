# Real-Time Synchronization System for Next.js Admin Panel

A comprehensive, scalable real-time synchronization system designed for Next.js applications, enabling seamless content management across multiple admin users with automatic conflict resolution, file synchronization, and optimistic updates.

## 🚀 Features

### Core Synchronization
- **Bidirectional WebSocket Communication**: Real-time, two-way communication between clients and server
- **Server-Sent Events Fallback**: Automatic fallback for browsers without WebSocket support
- **Multi-Instance Scalability**: Redis pub/sub for horizontal scaling across server instances
- **Optimistic Updates**: Instant UI feedback with automatic rollback on conflicts

### Conflict Resolution
- **Automatic Conflict Detection**: Identifies conflicting changes in real-time
- **Multiple Resolution Strategies**: Merge, overwrite, or manual resolution options
- **Version Control**: Change history and versioning for audit trails

### File Synchronization
- **Resumable Uploads**: Large file uploads with progress tracking and resume capability
- **Chunked Transfer**: Efficient transfer of large files in chunks
- **Integrity Verification**: Checksum validation to ensure file integrity
- **Thumbnail Generation**: Automatic thumbnail creation for image files

### User Experience
- **Real-Time Status Indicators**: Live connection status and sync state
- **Activity Notifications**: Real-time notifications for sync events and conflicts
- **Performance Monitoring**: Latency tracking and sync performance metrics
- **Offline Support**: Graceful degradation when connection is lost

## 🏗️ Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Client  │    │   Next.js API   │    │   Redis Pub/Sub │
│                 │    │                 │    │                 │
│ • React Hooks   │◄──►│ • WebSocket API │◄──►│ • Cross-Instance │
│ • Content Forms │    │ • REST Endpoints│    │ • Event Routing  │
│ • Sync Status   │    │ • File Upload   │    │ • Message Queue  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   MongoDB       │
                    │                 │
                    │ • Content Data  │
                    │ • File Metadata │
                    │ • Change History│
                    └─────────────────┘
```

### Data Flow

1. **Content Changes**: Admin makes changes in the UI
2. **Optimistic Update**: UI updates immediately for instant feedback
3. **Server Sync**: Changes sent to server via WebSocket/HTTP
4. **Broadcast**: Changes broadcasted to all connected clients via Redis
5. **Conflict Check**: Server checks for conflicts with recent changes
6. **Resolution**: Conflicts resolved automatically or flagged for manual resolution
7. **Persistence**: Changes saved to MongoDB with version history
8. **Confirmation**: Success/failure communicated back to originating client

## 📦 Installation & Setup

### Prerequisites

- Next.js 15+
- Node.js 18+
- MongoDB
- Redis (for multi-instance deployments)

### Dependencies

```bash
npm install ws redis @redis/client
# or
pnpm add ws redis @redis/client
```

### Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ngmapp

# Redis (optional, for multi-instance)
REDIS_URL=redis://localhost:6379

# File Upload
MAX_FILE_SIZE=104857600  # 100MB
UPLOAD_DIR=./uploads
```

### Configuration

1. **Update `next.config.mjs`** for WebSocket support:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['ws'],
  },
}

export default nextConfig
```

2. **Custom Server Setup** (optional, for WebSocket support):
```javascript
// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // Initialize WebSocket manager
  const { WebSocketManager } = require('./lib/realtime-sync/websocket-manager')
  const wsManager = new WebSocketManager(server)

  const port = process.env.PORT || 3000
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
```

## 🔧 Usage

### Basic Setup

```tsx
// app/admin/layout.tsx
import { ContentProvider } from '@/lib/content-context'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ContentProvider>
      {children}
    </ContentProvider>
  )
}
```

### Using Real-Time Hooks

```tsx
// components/admin/ContentEditor.tsx
"use client"

import { useContent } from '@/lib/content-context'
import { useWebSocketSync } from '@/hooks/use-websocket-sync'
import { useOptimisticUpdates } from '@/lib/realtime-sync/optimistic-updates'

export function ContentEditor() {
  const { content, updateContent } = useContent()

  // Initialize real-time sync
  const { syncOperation, status } = useWebSocketSync({
    onContentUpdate: (data) => {
      console.log('Content updated from another client:', data)
    },
    onConflictDetected: (conflicts) => {
      console.log('Conflicts detected:', conflicts)
    },
  })

  // Optimistic updates
  const { applyUpdate, handleConflicts } = useOptimisticUpdates({
    onConflictDetected: handleConflicts,
  })

  const handleTitleChange = async (newTitle: string) => {
    // Apply optimistic update
    const updateId = applyUpdate(
      {
        id: `update-${Date.now()}`,
        type: 'update',
        entityType: 'content',
        entityId: 'home',
        data: { heroTitle: newTitle },
        optimistic: true,
      },
      content.home,
      (updatedData) => {
        // Update local state immediately
        updateContent({ home: { ...content.home, heroTitle: newTitle } })
      },
      (originalData) => {
        // Rollback function
        updateContent({ home: originalData })
      }
    )

    try {
      // Sync with server
      await syncOperation({
        type: 'update',
        entityType: 'content',
        entityId: 'home',
        data: { heroTitle: newTitle },
        optimistic: true,
      })
    } catch (error) {
      // Handle sync failure - optimistic update will be rolled back
      console.error('Sync failed:', error)
    }
  }

  return (
    <div>
      <input
        value={content.home.heroTitle}
        onChange={(e) => handleTitleChange(e.target.value)}
        disabled={status !== 'connected'}
      />
    </div>
  )
}
```

### File Upload Integration

```tsx
// components/admin/FileUploader.tsx
"use client"

import { useFileUpload } from '@/lib/realtime-sync/file-sync-manager'

export function FileUploader() {
  const { initiateUpload, cancelUpload, uploads } = useFileUpload({
    onProgress: (progress) => {
      console.log('Upload progress:', progress)
    },
    onComplete: (fileId, metadata) => {
      console.log('Upload complete:', fileId, metadata)
    },
    onError: (error) => {
      console.error('Upload error:', error)
    },
  })

  const handleFileSelect = async (files: FileList) => {
    for (const file of Array.from(files)) {
      try {
        const fileId = await initiateUpload(file, 'current-user-id')
        console.log('Upload initiated:', fileId)
      } catch (error) {
        console.error('Failed to initiate upload:', error)
      }
    }
  }

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
      />

      {/* Upload Progress */}
      {Array.from(uploads.values()).map((upload) => (
        <div key={upload.fileId}>
          <div>{upload.fileName}</div>
          <progress value={upload.uploadedSize} max={upload.totalSize} />
          <button onClick={() => cancelUpload(upload.fileId)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Sync Status Display

```tsx
// components/admin/SyncStatus.tsx
"use client"

import { EnhancedSyncStatus, SyncDashboard } from '@/components/admin/enhanced-sync-status'

export function SyncStatus() {
  return (
    <div className="space-y-4">
      <EnhancedSyncStatus />
      {/* For detailed dashboard view: */}
      {/* <SyncDashboard /> */}
    </div>
  )
}
```

## 🔄 Synchronization Strategies

### Optimistic Updates

Optimistic updates provide instant UI feedback while changes are synchronized in the background:

```typescript
const updateId = applyUpdate(
  operation,           // The sync operation
  currentData,         // Current local state
  applyChange,         // Function to apply change to UI
  rollbackChange       // Function to revert change on failure
)
```

### Conflict Resolution

The system supports multiple conflict resolution strategies:

- **Merge**: Attempts to intelligently merge non-conflicting changes
- **Last Write Wins**: Accepts the most recently modified value
- **Manual**: Flags conflicts for manual resolution by the user

```typescript
const resolution = resolveConflicts(conflicts, 'merge')
if (resolution.resolution === 'manual') {
  // Show conflict resolution UI
  showConflictDialog(conflicts)
}
```

### Version History

All changes are versioned and stored for audit trails:

```typescript
const history = await getChangeHistory(entityId, limit)
const operations = await getOperationsSince(version)
```

## 📊 Monitoring & Analytics

### Performance Metrics

The system tracks several key metrics:

- **Latency**: Round-trip time for sync operations
- **Throughput**: Operations per second
- **Success Rate**: Percentage of successful syncs
- **Conflict Rate**: Frequency of conflicts requiring resolution

### Logging

Comprehensive logging is built-in:

```typescript
// Enable debug logging
process.env.DEBUG = 'realtime-sync:*'

// Logs include:
// - Connection events
// - Sync operations
// - Conflict detections
// - File upload progress
// - Performance metrics
```

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### Load Testing

```bash
npm run test:load
```

### Manual Testing Checklist

- [ ] Multiple admin users can edit simultaneously
- [ ] Changes appear in real-time across browsers
- [ ] File uploads work with progress indicators
- [ ] Conflicts are detected and resolved appropriately
- [ ] Offline mode gracefully degrades
- [ ] Reconnection works after network issues
- [ ] Large files can be uploaded and resumed

## 🚀 Deployment

### Single Instance

For single-server deployments, no additional configuration is needed beyond basic setup.

### Multi-Instance

For multi-instance deployments with load balancing:

1. **Configure Redis** for cross-instance communication
2. **Use sticky sessions** or ensure WebSocket connections are handled properly
3. **Configure shared storage** for uploaded files
4. **Set up monitoring** for sync performance across instances

### Docker Configuration

```dockerfile
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache redis

# Set environment variables
ENV REDIS_URL=redis://localhost:6379
ENV MONGODB_URI=mongodb://mongo:27017/ngmapp

# Expose ports
EXPOSE 3000

# Start application
CMD ["npm", "run", "dev"]
```

## 🔒 Security Considerations

### Authentication

- All sync operations require valid user sessions
- File uploads are validated for type and size
- WebSocket connections are authenticated

### Authorization

- Users can only sync content they have permission to edit
- File access is restricted by ownership and permissions

### Data Validation

- All sync operations are validated server-side
- File uploads are scanned for malware (recommended)
- Checksums ensure data integrity

## 🐛 Troubleshooting

### Common Issues

**WebSocket Connection Fails**
- Check if custom server is properly configured
- Verify firewall settings allow WebSocket connections
- Ensure SSL certificates are valid for WSS

**Sync Operations Lag**
- Check Redis connection and performance
- Monitor server CPU and memory usage
- Review network latency between instances

**File Upload Issues**
- Verify upload directory permissions
- Check file size limits in configuration
- Ensure sufficient disk space is available

**Conflict Resolution Problems**
- Review conflict resolution strategy settings
- Check if manual resolution UI is properly implemented
- Verify version history is being maintained

### Debug Mode

Enable debug logging for troubleshooting:

```bash
DEBUG=realtime-sync:* npm run dev
```

## 📈 Performance Optimization

### Server Optimization

- Use Redis clustering for high availability
- Implement connection pooling for database
- Cache frequently accessed content

### Client Optimization

- Debounce rapid changes to reduce sync frequency
- Implement virtual scrolling for large lists
- Use compression for large payloads

### Network Optimization

- Implement delta encoding for content updates
- Use binary protocols for file transfers
- Compress WebSocket messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the troubleshooting guide
- Review the API documentation

---

**Note**: This system is designed for real-time content management in Next.js applications. For other use cases, some components may need adaptation.
