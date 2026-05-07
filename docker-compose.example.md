# FileShare Docker Development Environment

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- AWS S3 bucket or MinIO for storage

### Local Development with Docker

1. Copy environment file:
```bash
cp backend/.env.example backend/.env
```

2. Start all services:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. Frontend: http://localhost
4. Backend API: http://localhost:3000
5. MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

### Production Deployment

1. Set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_S3_BUCKET=your-bucket
export JWT_SECRET=your-secure-random-string
```

2. Deploy:
```bash
docker-compose up -d
```

## MinIO Setup (Local Development)

1. Access MinIO Console at http://localhost:9001
2. Create a bucket named `fileshare-uploads`
3. Create a user with access to this bucket
4. Update `.env` with MinIO credentials

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | API port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/fileshare |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `AWS_ACCESS_KEY_ID` | S3 access key | - |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key | - |
| `AWS_REGION` | AWS region | us-east-1 |
| `AWS_S3_BUCKET` | S3 bucket name | fileshare-uploads |
| `AWS_S3_ENDPOINT` | S3 endpoint (for MinIO) | - |
| `JWT_SECRET` | JWT signing secret | - |
| `MAX_FILE_SIZE` | Max file size (bytes) | 5368709120 (5GB) |
| `CHUNK_SIZE` | Upload chunk size | 5242880 (5MB) |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Backend API URL | http://localhost:3000/api |

## Scaling Considerations

### Horizontal Scaling
- Backend containers can be scaled horizontally
- Use a load balancer (nginx) in front of multiple backend instances
- Redis and MongoDB handle distributed state

### S3 Pre-signed URLs
For high-traffic scenarios, consider generating pre-signed URLs:
```
GET /api/download/:shareId/signed
```

### CDN Integration
- Deploy CloudFront or similar CDN in front of S3
- Cache static assets at CDN edge locations
- Use signed URLs for private content

## Security Best Practices

1. **Use HTTPS** in production (Let's Encrypt)
2. **Rotate credentials** regularly
3. **Enable S3 server-side encryption** (SSE-S3 or SSE-KMS)
4. **Configure CORS** appropriately for your domain
5. **Set up rate limiting** at the API gateway level
6. **Enable audit logging** for compliance
