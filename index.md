# FileShare

Secure file sharing platform with chunked uploads, password protection, and expiration.

## Quick Start

```bash
# Start infrastructure
docker-compose -f docker-compose.dev.yml up -d

# Install & run backend
cd backend && npm install && npm run start:dev

# Install & run frontend (new terminal)
cd frontend && npm install && npm start
```

See [SPEC.md](SPEC.md) for detailed architecture and [README.md](README.md) for full documentation.
