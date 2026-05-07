# FileShare - Production-Ready MVP Specification

## 1. Concept & Vision

A sleek, minimal file-sharing service that makes sending large files effortless. Inspired by WeTransfer's clean aesthetic but with enhanced security features. The experience should feel instant, trustworthy, and delightfully simple—like handing someone a physical package, but digital.

**Core Philosophy**: Zero friction upload → Secure share → Peace of mind delivery.

---

## 2. Design Language

### Aesthetic Direction
Minimalist Swiss design meets modern SaaS. Clean whites, purposeful grays, with a vibrant accent color for CTAs. Generous whitespace, subtle shadows, and micro-animations that feel responsive without being distracting.

### Color Palette
```
Primary:        #2563EB (Blue 600 - trust, action)
Primary Dark:   #1D4ED8 (Blue 700 - hover states)
Secondary:      #64748B (Slate 500 - secondary text)
Accent:         #10B981 (Emerald 500 - success states)
Warning:        #F59E0B (Amber 500 - warnings)
Danger:         #EF4444 (Red 500 - errors, destructive)
Background:     #FFFFFF (pure white)
Surface:        #F8FAFC (Slate 50 - cards, elevated surfaces)
Border:         #E2E8F0 (Slate 200 - subtle borders)
Text Primary:   #0F172A (Slate 900 - headings)
Text Secondary: #475569 (Slate 600 - body text)
Text Muted:     #94A3B8 (Slate 400 - placeholders)
```

### Typography
- **Headings**: Inter (700, 600) - clean, modern, excellent readability
- **Body**: Inter (400, 500) - consistent family for cohesion
- **Monospace**: JetBrains Mono - for file sizes, codes, technical info
- **Scale**: 12px / 14px / 16px / 18px / 24px / 32px / 48px

### Spatial System
- Base unit: 4px
- Component padding: 12px / 16px / 24px
- Section spacing: 32px / 48px / 64px
- Border radius: 8px (buttons) / 12px (cards) / 16px (modals)
- Max content width: 1200px

### Motion Philosophy
- **Duration**: 150ms (micro) / 300ms (standard) / 500ms (emphasis)
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1) - smooth deceleration
- **Upload progress**: Linear for accuracy
- **Success states**: Subtle scale + fade
- **Page transitions**: Fade with 200ms duration
- **Hover states**: 150ms transitions

### Visual Assets
- Icons: Lucide Icons (consistent, clean line icons)
- Illustrations: Minimal geometric shapes for empty states
- File type icons: Custom colored icons per type

---

## 3. Layout & Structure

### Page Architecture

#### Upload Page (`/`)
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                              [Theme Toggle] [About] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────────┐            │
│              │                                 │            │
│              │     [Drag & Drop Zone]          │            │
│              │     Drop files here or          │            │
│              │     click to browse             │            │
│              │                                 │            │
│              │     Supported: Any file type    │            │
│              │     Max size: 5GB               │            │
│              │                                 │            │
│              └─────────────────────────────────┘            │
│                                                             │
│              [Selected files list with remove option]        │
│                                                             │
│              ┌─ Options ───────────────────────────────┐    │
│              │ [x] Password protection  [____________] │    │
│              │ [x] Set expiry        [24 hours ▼]     │    │
│              │ [x] Email notification [____________]   │    │
│              └─────────────────────────────────────────┘    │
│                                                             │
│                           [Send Files →]                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Footer: Privacy | Terms | © 2024 FileShare                │
└─────────────────────────────────────────────────────────────┘
```

#### Upload Progress Page
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────────┐            │
│              │                                 │            │
│              │     ████████████░░░░  73%       │            │
│              │     document.pdf               │            │
│              │     Uploading...               │            │
│              │                                 │            │
│              │     [Cancel Upload]             │            │
│              │                                 │            │
│              └─────────────────────────────────┘            │
│                                                             │
│              ┌─ Queued ───────────────────────────────┐    │
│              │ 📄 image.jpg (2.4 MB) - Waiting        │    │
│              │ 📄 video.mp4 (156 MB) - Waiting         │    │
│              └─────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Share Success Page
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ✓  Files ready to share                        │
│                                                             │
│              ┌─────────────────────────────────┐            │
│              │  🔗 Your download link          │            │
│              │  ┌───────────────────────────┐ │            │
│              │  │ https://fs.co/d/xKj9m... │ │            │
│              │  └───────────────────────────┘ │            │
│              │  [📋 Copy Link] [📧 Send Email] │            │
│              │                                 │            │
│              │  Expires: 24 hours              │            │
│              │  Downloads: Unlimited           │            │
│              │  Password: Not set               │            │
│              └─────────────────────────────────┘            │
│                                                             │
│              [Upload More Files]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Download Page (`/download/:id`)
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────────┐            │
│              │                                 │            │
│              │     📄 document.pdf             │            │
│              │     2.4 MB • PDF Document      │            │
│              │                                 │            │
│              │     ┌───────────────────────┐  │            │
│              │     │ Enter password        │  │            │
│              │     └───────────────────────┘  │            │
│              │                                 │            │
│              │     [Download Files →]          │            │
│              │                                 │            │
│              │     Expires in 23 hours        │            │
│              │     Downloaded 0 of 3 times    │            │
│              │                                 │            │
│              └─────────────────────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Strategy
- **Desktop (1024px+)**: Full layout, side-by-side elements
- **Tablet (768px-1023px)**: Stacked layout, reduced padding
- **Mobile (< 768px)**: Single column, bottom sheet for options, larger touch targets (min 44px)

---

## 4. Features & Interactions

### File Upload

#### Drag & Drop
- **Drag enter**: Border color changes to primary, background tints blue (#EBF5FF)
- **Drag over**: Subtle pulse animation on drop zone
- **Drop**: Immediate file add with success feedback
- **Invalid file**: Shake animation + red border + toast error
- **Click**: Opens native file picker (multiple files allowed)

#### File Selection
- Display file list with: icon, name (truncated with tooltip), size (human readable)
- Remove button on hover/focus for each file
- Total size calculation at bottom
- Clear all option when multiple files

#### Upload Progress
- Linear progress bar with percentage
- Current file name displayed
- Upload speed calculation (KB/s or MB/s)
- Time remaining estimation
- Cancel button (with confirmation if >50% complete)
- Retry button on failure (with error message)
- Auto-retry on network error (3 attempts, exponential backoff)

#### Chunked Upload (Large Files > 100MB)
- Chunk size: 5MB
- Individual chunk progress indicators
- Parallel chunk uploads (3 concurrent)
- Resumable uploads (store chunk progress in localStorage)
- Server-side chunk validation and assembly

### File Sharing Options

#### Password Protection
- Toggle checkbox
- Password input (min 4 characters)
- Show/hide password toggle
- Password strength indicator (optional)

#### Expiry Settings
- Toggle checkbox
- Dropdown options: 1 hour, 6 hours, 24 hours, 7 days, 30 days, Custom
- Custom date/time picker for specific expiry
- Visual countdown on share success page

#### Download Limits
- Toggle checkbox
- Number input (1-100)
- Default: Unlimited

#### Email Notification
- Toggle checkbox
- Email input with validation
- Optional message textarea (max 500 chars)
- Multiple email support (comma separated)

### Download Experience

#### Password Gate
- Password input with centered display
- Show/hide toggle
- "Download" button only enabled when password entered
- Error shake on wrong password (3 attempts, then rate limit)

#### Download Process
- Direct browser download (no intermediary page)
- Multiple files: ZIP download
- Progress bar for large files
- "Download again" option after completion

### Error States

#### Upload Errors
- Network failure: "Connection lost. Your upload has been paused. [Retry]"
- File too large: "This file exceeds the 5GB limit. [Choose another file]"
- Invalid type: "This file type is not allowed. [View allowed types]"
- Server error: "Something went wrong on our end. Your upload has been saved and will resume automatically."

#### Download Errors
- File expired: "This link has expired. [Upload new files]"
- Invalid password: "Incorrect password. [X] attempts remaining."
- File deleted: "This file has been removed. [Upload new files]"
- Rate limited: "Too many download attempts. Please try again in [time]."

---

## 5. Component Inventory

### DropZone
- **Default**: Dashed border (#E2E8F0), icon + text centered
- **Hover**: Border solid, background tint
- **Drag Over**: Primary border, blue background tint, scale(1.02)
- **Disabled**: Grayed out, cursor not-allowed
- **Loading**: Spinner overlay, progress text

### FileCard
- **Default**: White background, subtle shadow, file icon + name + size
- **Hover**: Elevated shadow, remove button visible
- **Uploading**: Progress bar overlay, percentage
- **Complete**: Green checkmark badge
- **Error**: Red border, error icon, retry button

### Button
- **Primary**: Blue background, white text, hover darken
- **Secondary**: White background, border, hover fill
- **Ghost**: No background, hover fill
- **Danger**: Red background for destructive actions
- **Disabled**: 50% opacity, no hover effect
- **Loading**: Spinner replaces text, maintains width

### Input
- **Default**: Border #E2E8F0, white background
- **Focus**: Primary border, subtle shadow
- **Error**: Red border, error message below
- **Disabled**: Gray background

### ProgressBar
- **Default**: Gray track, primary fill
- **Indeterminate**: Animated gradient sweep
- **Complete**: Green fill, checkmark

### Toast/Notification
- **Success**: Green left border, checkmark icon
- **Error**: Red left border, X icon
- **Warning**: Amber left border, alert icon
- **Info**: Blue left border, info icon
- **Auto-dismiss**: 5 seconds (configurable)

### Modal
- **Overlay**: Black 50% opacity, blur(4px) backdrop
- **Content**: White, rounded, shadow-xl
- **Close**: X button top right, Escape key, click outside

---

## 6. Technical Architecture

### Backend (NestJS)

#### Module Structure
```
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── config.module.ts
│   ├── config.service.ts
│   └── configuration.ts
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   └── rate-limit.guard.ts
│   ├── interceptors/
│   │   └── logging.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── decorators/
│       └── current-user.decorator.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── dto/
│       └── login.dto.ts
├── upload/
│   ├── upload.module.ts
│   ├── upload.controller.ts
│   ├── upload.service.ts
│   ├── dto/
│   │   ├── initiate-upload.dto.ts
│   │   ├── complete-upload.dto.ts
│   │   └── upload-chunk.dto.ts
│   └── interfaces/
│       └── upload.interface.ts
├── files/
│   ├── files.module.ts
│   ├── files.controller.ts
│   ├── files.service.ts
│   ├── schemas/
│   │   └── file.schema.ts
│   └── dto/
│       ├── create-file.dto.ts
│       ├── file-response.dto.ts
│       └── share-file.dto.ts
├── download/
│   ├── download.module.ts
│   ├── download.controller.ts
│   ├── download.service.ts
│   └── dto/
│       └── download-file.dto.ts
├── email/
│   ├── email.module.ts
│   ├── email.service.ts
│   └── email.processor.ts
├── queue/
│   ├── queue.module.ts
│   └── processors/
│       ├── cleanup.processor.ts
│       └── email.processor.ts
└── storage/
    ├── storage.module.ts
    └── storage.service.ts
```

#### API Endpoints

##### Upload Module
```
POST   /api/upload/initiate
       Body: { fileName, fileSize, fileType, chunkSize? }
       Response: { uploadId, chunkSize, totalChunks }

POST   /api/upload/chunk/:uploadId
       Body: FormData { chunk, chunkIndex }
       Response: { chunkIndex, received }

POST   /api/upload/complete/:uploadId
       Body: { fileName, fileType, options: { password?, expiresAt?, maxDownloads?, notifyEmails? } }
       Response: { fileId, shareId, downloadUrl }

GET    /api/upload/status/:uploadId
       Response: { status, chunksReceived, totalChunks }
```

##### Files Module
```
GET    /api/files/:shareId
       Response: { id, files[], expiresAt, maxDownloads, downloadCount, password }

POST   /api/files/:shareId/verify
       Body: { password }
       Response: { valid, attemptsRemaining }
```

##### Download Module
```
GET    /api/download/:shareId
       Response: File stream (single file) or ZIP (multiple)
       
GET    /api/download/:shareId/info
       Response: { fileCount, totalSize, expiresAt }
```

##### Auth Module (Optional for MVP+)
```
POST   /api/auth/login
       Body: { email, password }
       Response: { accessToken, refreshToken }

POST   /api/auth/register
       Body: { email, password, name }
       Response: { accessToken, refreshToken }

GET    /api/auth/profile
       Headers: Authorization: Bearer <token>
       Response: { id, email, name, createdAt }
```

### Database Schema (MongoDB)

#### Files Collection
```javascript
{
  _id: ObjectId,
  shareId: String,           // Unique share identifier (8 chars)
  originalName: String,
  fileName: String,          // S3 key
  fileSize: Number,
  mimeType: String,
  password: String,          // Hashed (optional)
  passwordEnabled: Boolean,
  expiresAt: Date,           // Auto-delete after this
  maxDownloads: Number,      // -1 for unlimited
  downloadCount: Number,
  notifyEmails: [String],
  uploadedBy: ObjectId,      // User reference (optional)
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date            // Soft delete
}

// Indexes
{ shareId: 1 }               // Unique
{ expiresAt: 1 }            // For cleanup job
{ createdAt: 1 }            // For user history
{ uploadedBy: 1 }
```

#### Uploads Collection (for chunked uploads)
```javascript
{
  _id: ObjectId,
  uploadId: String,         // Unique upload session ID
  fileName: String,
  fileSize: Number,
  mimeType: String,
  chunkSize: Number,
  totalChunks: Number,
  chunksReceived: [Number],  // Array of received chunk indices
  status: String,            // 'pending', 'uploading', 'completed', 'failed'
  expiresAt: Date,          // Cleanup incomplete uploads
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ uploadId: 1 }             // Unique
{ expiresAt: 1 }            // Cleanup
{ status: 1 }
```

#### Users Collection (Optional for MVP+)
```javascript
{
  _id: ObjectId,
  email: String,
  password: String,          // Hashed
  name: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ email: 1 }                // Unique
```

### Frontend (Angular)

#### Project Structure
```
src/
├── main.ts
├── index.html
├── styles.scss
├── app/
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── core/
│   │   ├── services/
│   │   │   ├── upload.service.ts
│   │   │   ├── download.service.ts
│   │   │   ├── api.service.ts
│   │   │   └── toast.service.ts
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts
│   │   └── guards/
│   │       └── auth.guard.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── drop-zone/
│   │   │   ├── file-card/
│   │   │   ├── progress-bar/
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   └── toast/
│   │   └── pipes/
│   │       ├── file-size.pipe.ts
│   │       └── time-ago.pipe.ts
│   ├── features/
│   │   ├── upload/
│   │   │   ├── upload-page.component.ts
│   │   │   ├── upload-progress.component.ts
│   │   │   └── upload-options.component.ts
│   │   ├── share/
│   │   │   └── share-success.component.ts
│   │   └── download/
│   │       ├── download-page.component.ts
│   │       └── password-gate.component.ts
│   └── pages/
│       ├── home.component.ts
│       └── not-found.component.ts
├── assets/
│   ├── icons/
│   └── images/
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## 7. Security Implementation

### File Access Control
1. **Share IDs**: Cryptographically random 8-character alphanumeric strings
2. **Password Protection**: bcrypt hashing with cost factor 12
3. **Signed URLs**: S3 pre-signed URLs with 1-hour expiry for downloads
4. **Rate Limiting**: 
   - Upload: 100 requests/minute per IP
   - Download: 50 requests/minute per IP
   - Password attempts: 5 per 15 minutes per share ID

### S3 Configuration
- Bucket: Private (no public access)
- IAM Role: Minimal permissions (PutObject, GetObject, DeleteObject)
- Server-side encryption: AES-256
- Lifecycle rules: Auto-delete after expiry + 24 hours grace period

### API Security
- CORS: Whitelist allowed origins
- Helmet.js: Security headers
- Input validation: class-validator DTOs
- File validation: Magic bytes check, not just extension
- Size limits: 5GB per file, 10GB per upload session

---

## 8. Queue Architecture (BullMQ)

### Job Types

#### Cleanup Job
```typescript
{
  name: 'cleanup-expired-files',
  cron: '*/5 * * * *',  // Every 5 minutes
  process: Find files where expiresAt < now,
           Delete from S3,
           Remove from database
}
```

#### Email Job
```typescript
{
  name: 'send-share-email',
  data: {
    shareId: string,
    emails: string[],
    fileName: string,
    downloadUrl: string,
    expiresAt: Date,
    message?: string
  },
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 }
}
```

#### Thumbnail Job (Future)
```typescript
{
  name: 'generate-thumbnail',
  data: { fileId: string, s3Key: string }
}
```

---

## 9. Scaling Considerations

### Horizontal Scaling
- Stateless backend servers (no local file storage)
- Redis for session state and rate limiting
- MongoDB replica set for read scaling
- S3 for unlimited file storage

### CDN Integration
- CloudFront in front of S3 for global distribution
- Pre-signed URLs with edge location optimization
- Static assets served from CDN

### Performance Optimizations
- Chunked uploads reduce memory usage
- Streaming responses for downloads (no full file in memory)
- Connection pooling for database
- Redis caching for frequent queries

### Cost Optimization
- S3 Intelligent-Tiering for variable access patterns
- Cleanup jobs prevent indefinite storage
- Compression for ZIP bundles

---

## 10. Environment Configuration

### Backend (.env)
```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
MONGODB_URI=mongodb://localhost:27017/fileshare

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=fileshare-uploads
AWS_S3_ENDPOINT=http://localhost:9000  # For MinIO

# JWT (Optional)
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100

# Upload
MAX_FILE_SIZE=5368709120  # 5GB
CHUNK_SIZE=5242880  # 5MB
UPLOAD_EXPIRY_HOURS=24
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  maxFileSize: 5368709120,
  allowedMimeTypes: ['*/*'],
  uploadChunkSize: 5242880,
  uploadConcurrency: 3,
  uploadRetries: 3
};
```

---

## 11. Docker Setup

### Services
- **frontend**: Angular app (nginx)
- **backend**: NestJS app
- **mongodb**: Database
- **redis**: Queue/Cache
- **minio**: S3-compatible storage (dev only)

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [backend]
    
  backend:
    build: ./backend
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
    depends_on: [mongodb, redis, minio]
    
  mongodb:
    image: mongo:6
    ports: ["27017:27017"]
    volumes: [mongodb_data:/data/db]
    
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    
  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    command: server /data --console-address ":9001"
    volumes: [minio_data:/data]

volumes:
  mongodb_data:
  minio_data:
```
