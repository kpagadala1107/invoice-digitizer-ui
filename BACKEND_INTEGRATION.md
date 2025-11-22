# Backend Integration Guide

## Overview
This document explains how to configure and integrate the React ChatBot with the Doc Digitizer Agent backend.

## Backend Requirements

### Minimum Requirements
- Node.js or Java backend with REST API support
- CORS enabled for `http://localhost:3000`
- JSON request/response format
- Multipart form data support for file uploads

### Required Endpoints

#### 1. Agent Information
```
GET /api/agent/info
Response: {
  "name": "Doc Digitizer Agent",
  "version": "1.0.0",
  "description": "AI-powered document processing agent",
  "capabilities": [
    "Document extraction",
    "Data validation",
    "Format conversion"
  ]
}
```

#### 2. Available Tools
```
GET /api/agent/tools
Response: [
  {
    "id": "extract",
    "name": "Extract Data",
    "description": "Extract structured data from documents",
    "icon": "📄"
  },
  {
    "id": "validate",
    "name": "Validate",
    "description": "Validate document data",
    "icon": "✓"
  }
]
```

#### 3. Chat Message
```
POST /api/agent/chat
Request: {
  "message": "What can you help me with?",
  "context": { /* optional conversation context */ }
}
Response: {
  "response": "I can help you extract data from documents...",
  "context": { /* updated context */ },
  "metadata": { /* optional metadata */ }
}
```

#### 4. Process Document
```
POST /api/agent/process-document
Content-Type: multipart/form-data
Request:
  - file: [binary data]
  - instruction: "Extract and validate this document"

Response: {
  "extractedData": {
    "invoiceNumber": "INV-001",
    "vendor": "Acme Corp",
    "amount": 1250.00
  },
  "validation": {
    "isValid": true,
    "errors": [],
    "warnings": []
  },
  "message": "Document processed successfully"
}
```

#### 5. Validate Document
```
POST /api/agent/validate
Request: {
  "data": {
    "invoiceNumber": "INV-001",
    "vendor": "Acme Corp",
    "amount": 1250.00
  }
}
Response: {
  "isValid": true,
  "errors": [],
  "warnings": [],
  "fields": {
    "invoiceNumber": "valid",
    "vendor": "valid",
    "amount": "valid"
  }
}
```

#### 6. Search Records
```
GET /api/agent/search?query=Acme+Corp
Response: {
  "results": [
    {
      "id": "1",
      "invoiceNumber": "INV-001",
      "vendor": "Acme Corp",
      "amount": 1250.00
    }
  ],
  "count": 1
}
```

#### 7. Convert Data (Optional)
```
POST /api/agent/convert
Request: {
  "data": { /* data to convert */ },
  "format": "xml" // or "json", "csv", etc.
}
Response: {
  "converted": "<?xml version='1.0'?>...",
  "format": "xml"
}
```

## CORS Configuration

### Node.js/Express Example
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### Spring Boot Example
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000", "http://localhost:3001")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { /* optional additional details */ }
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `413` - Payload Too Large (file too big)
- `500` - Internal Server Error

## File Upload Configuration

### Size Limits
```javascript
// Express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const multer = require('multer');
const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
```

### Supported File Types
- PDF (`.pdf`)
- Images (`.jpg`, `.jpeg`, `.png`, `.gif`)
- Documents (`.doc`, `.docx`)
- Spreadsheets (`.xls`, `.xlsx`)

## Authentication (Optional)

### JWT Token Example
```javascript
// Frontend - Add token to requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Backend - Verify token
app.use('/api/agent', authenticateToken);

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

## Rate Limiting

### Express Rate Limiter
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/agent', limiter);
```

## WebSocket Support (Advanced)

For real-time updates and streaming responses:

```javascript
// Backend
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Process message
    ws.send(JSON.stringify({ response: 'Processed' }));
  });
});

// Frontend - Update agentApi.js
const socket = new WebSocket('ws://localhost:8082');
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
};
```

## Testing Backend Integration

### Using curl
```bash
# Test agent info
curl http://localhost:8081/api/agent/info

# Test chat
curl -X POST http://localhost:8081/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# Test file upload
curl -X POST http://localhost:8081/api/agent/process-document \
  -F "file=@invoice.pdf" \
  -F "instruction=Extract data"
```

### Using Postman
1. Import the collection from `postman_collection.json` (if provided)
2. Set base URL to `http://localhost:8081`
3. Test each endpoint individually

## Environment Variables

### Backend .env Example
```env
PORT=8081
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_secret_key
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## Logging

### Request Logging
```javascript
// Morgan middleware
const morgan = require('morgan');
app.use(morgan('combined'));

// Custom logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
```

## Health Check Endpoint

```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Database Integration

### Example with MongoDB
```javascript
const mongoose = require('mongoose');

// Document schema
const DocumentSchema = new mongoose.Schema({
  filename: String,
  extractedData: Object,
  uploadDate: { type: Date, default: Date.now },
  status: String
});

// Save processed document
app.post('/api/agent/process-document', async (req, res) => {
  const document = new Document({
    filename: req.file.originalname,
    extractedData: processedData,
    status: 'completed'
  });
  await document.save();
  res.json({ success: true, data: processedData });
});
```

## Performance Optimization

### Caching
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

app.get('/api/agent/info', (req, res) => {
  const cached = cache.get('agent-info');
  if (cached) return res.json(cached);
  
  const data = getAgentInfo();
  cache.set('agent-info', data);
  res.json(data);
});
```

### Async Processing
```javascript
const Queue = require('bull');
const documentQueue = new Queue('document-processing');

documentQueue.process(async (job) => {
  const { file, instruction } = job.data;
  return await processDocument(file, instruction);
});

app.post('/api/agent/process-document', (req, res) => {
  const job = await documentQueue.add({
    file: req.file,
    instruction: req.body.instruction
  });
  res.json({ jobId: job.id, status: 'processing' });
});
```

## Security Best Practices

1. **Input Validation**
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/agent/chat',
  body('message').isString().trim().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

2. **File Upload Security**
```javascript
const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
```

3. **SQL Injection Prevention**
```javascript
// Use parameterized queries
const query = 'SELECT * FROM documents WHERE id = ?';
db.query(query, [documentId], (err, results) => {
  // Handle results
});
```

## Monitoring

### Add health metrics
```javascript
const metrics = {
  requestCount: 0,
  errorCount: 0,
  averageResponseTime: 0
};

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    metrics.requestCount++;
    metrics.averageResponseTime = 
      (metrics.averageResponseTime + (Date.now() - start)) / 2;
  });
  next();
});

app.get('/api/metrics', (req, res) => {
  res.json(metrics);
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify CORS headers are set
   - Check allowed origins include frontend URL
   - Ensure preflight requests are handled

2. **File Upload Fails**
   - Check file size limits
   - Verify multer configuration
   - Ensure upload directory exists and is writable

3. **Timeout Errors**
   - Increase request timeout limits
   - Implement async processing for long operations
   - Add progress indicators

4. **Memory Issues**
   - Implement streaming for large files
   - Clean up temporary files after processing
   - Set appropriate memory limits

## Production Deployment

### Checklist
- [ ] Environment variables configured
- [ ] CORS set to production URLs
- [ ] Rate limiting enabled
- [ ] HTTPS configured
- [ ] Error logging enabled
- [ ] Health checks working
- [ ] Database backups configured
- [ ] File storage optimized
- [ ] Load balancing configured
- [ ] Monitoring and alerts set up

---

For frontend configuration, see `CHATBOT_README.md`
