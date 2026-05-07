# FileShare - Secure File Sharing Platform

A production-ready WeTransfer-like file sharing application built with Angular, NestJS, MongoDB, and AWS S3.

## Features

- **Drag & Drop Upload** - Easy file upload with intuitive UI
- **Large File Support** - Chunked upload for files up to 5GB
- **Password Protection** - Secure your files with optional passwords
- **Time-based Expiry** - Automatic file expiration
- **Download Limits** - Optional download count restrictions
- **Email Notifications** - Notify recipients when files are shared
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Progress Tracking** - Real-time upload progress with retry support

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 17 (Standalone Components, Signals) |
| Backend | NestJS 10 (Modular Architecture) |
| Database | MongoDB 6 |
| Storage | AWS S3 / MinIO |
| Queue | BullMQ / Redis |
| Auth | JWT (Optional) |
| Styling | Tailwind CSS |

## Project Structure

```
file-share/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── upload/         # Chunked upload handling
│   │   ├── files/          # File metadata management
│   │   ├── download/      # Secure download endpoints
│   │   ├── storage/       # S3 integration
│   │   ├── email/         # Email notifications
│   │   ├── queue/         # Background job processing
│   │   └── common/        # Shared utilities
│   └── docker/
│
├── frontend/               # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/      # Services, guards
│   │   │   ├── shared/    # Reusable components
│   │   │   ├── features/  # Feature modules
│   │   │   └── pages/     # Page components
│   │   └── environments/
│   └── docker/
│
├── SPEC.md                # Detailed specification
├── docker-compose.yml      # Production deployment
└── docker-compose.dev.yml  # Development environment
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- MongoDB (or use provided docker-compose)
- Redis (or use provided docker-compose)
- AWS S3 Bucket or MinIO

### Local Development

1. **Clone and install dependencies:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. **Set up environment:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

3. **Start infrastructure (Docker):**
```bash
docker-compose -f docker-compose.dev.yml up -d mongodb redis
```

4. **Start MinIO (for local S3):**
```bash
docker run -d -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

5. **Create S3 bucket:**
- Access MinIO Console at http://localhost:9001
- Create bucket: `fileshare-uploads`

6. **Start backend:**
```bash
cd backend
npm run start:dev
```

7. **Start frontend:**
```bash
cd frontend
npm start
```

8. **Access the app:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

### Using Docker Compose

For a complete local environment:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

## API Reference

### Upload Module

#### Initiate Chunked Upload
```http
POST /api/upload/initiate
Content-Type: application/json

{
  "fileName": "document.pdf",
  "fileSize": 104857600,
  "mimeType": "application/pdf",
  "chunkSize": 5242880
}
```

Response:
```json
{
  "uploadId": "abc123...",
  "chunkSize": 5242880,
  "totalChunks": 20,
  "expiresAt": "2024-01-02T00:00:00Z"
}
```

#### Upload Chunk
```http
POST /api/upload/chunk/:uploadId
Content-Type: multipart/form-data

chunk: <binary data>
chunkIndex: 0
```

#### Complete Upload
```http
POST /api/upload/complete/:uploadId
Content-Type: application/json

{
  "fileName": "document.pdf",
  "mimeType": "application/pdf",
  "password": "optional-password",
  "expiresAt": "2024-01-03T00:00:00Z",
  "maxDownloads": 10,
  "notifyEmails": ["user@example.com"]
}
```

Response:
```json
{
  "fileId": "...",
  "shareId": "xKj9mNpQ",
  "downloadUrl": "http://localhost/download/xKj9mNpQ"
}
```

### Files Module

#### Get File Info
```http
GET /api/files/:shareId
```

Response:
```json
{
  "shareId": "xKj9mNpQ",
  "originalName": "document.pdf",
  "fileSize": 104857600,
  "mimeType": "application/pdf",
  "passwordEnabled": true,
  "expiresAt": "2024-01-03T00:00:00Z",
  "maxDownloads": 10,
  "downloadCount": 2,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Verify Password
```http
POST /api/files/:shareId/verify
Content-Type: application/json

{
  "password": "user-password"
}
```

### Download Module

#### Download File
```http
GET /api/download/:shareId
```

#### Get Download Info
```http
GET /api/download/:shareId/info
```

#### Get Signed URL
```http
GET /api/download/:shareId/signed
```

## Database Schema

### Files Collection
```javascript
{
  _id: ObjectId,
  shareId: String,          // 8-char unique ID
  originalName: String,
  fileName: String,         // S3 key
  fileSize: Number,
  mimeType: String,
  password: String,         // bcrypt hashed
  passwordEnabled: Boolean,
  expiresAt: Date,
  maxDownloads: Number,     // -1 = unlimited
  downloadCount: Number,
  notifyEmails: [String],
  uploadedBy: ObjectId,     // Optional user ref
  createdAt: Date,
  updatedAt: Date
}
```

### Uploads Collection (Chunked)
```javascript
{
  _id: ObjectId,
  uploadId: String,         // 32-char session ID
  fileName: String,
  fileSize: Number,
  mimeType: String,
  chunkSize: Number,
  totalChunks: Number,
  chunksReceived: [Number],
  status: String,           // pending/uploading/completed/failed
  multipartUploadId: String,
  expiresAt: Date
}
```

## Security Features

1. **Share IDs** - Cryptographically random 8-character alphanumeric strings
2. **Password Protection** - bcrypt hashing with cost factor 12
3. **Rate Limiting** - 100 requests/minute (configurable)
4. **Input Validation** - class-validator DTOs
5. **Helmet.js** - Security headers
6. **CORS** - Configurable origin whitelist
7. **S3 Encryption** - Server-side AES-256

## Scaling Architecture

```
                    ┌─────────────┐
                    │   CDN       │
                    │ (CloudFront)│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Load        │
                    │ Balancer    │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
    │Backend 1│       │Backend 2│       │Backend N│
    └────┬────┘       └────┬────┘       └────┬────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                       │
┌───▼───┐           ┌──────▼──────┐         ┌─────▼────┐
│ Redis │           │  MongoDB    │         │    S3    │
│Cluster│           │ Replica Set │         │  Bucket  │
└───────┘           └─────────────┘         └──────────┘
```

## Environment Variables

### Backend (.env)

```env
# Application
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/fileshare

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=fileshare-uploads
AWS_S3_ENDPOINT=http://localhost:9000  # For MinIO

# JWT
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d

# Limits
MAX_FILE_SIZE=5368709120  # 5GB
CHUNK_SIZE=5242880        # 5MB
RATE_LIMIT_MAX=100
```

## Production Deployment

### Using Docker Compose

```bash
# Set environment variables
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx
export AWS_S3_BUCKET=fileshare-prod
export JWT_SECRET=$(openssl rand -base64 32)

# Deploy
docker-compose up -d
```

### Manual Deployment

1. Build frontend: `cd frontend && npm run build`
2. Build backend: `cd backend && npm run build`
3. Configure environment variables
4. Set up MongoDB, Redis, and S3
5. Start services with PM2 or similar

## License

MIT License - See SPEC.md for full specification.
