// ==========================================
// ReUz — Main Server Entry Point
// ==========================================

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { setupSocket } from './socket.js';
import createRoutes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = join(__dirname, '..', 'uploads');
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

const app = express();
const httpServer = createServer(app);

// Socket.IO
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

setupSocket(io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api', createRoutes(io));

// Serve static frontend in production
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(distPath, 'index.html'));
  }
});

// Start
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  console.log('\n==========================================');
  console.log('  🟢 ReUz Server Running');
  console.log('==========================================');
  console.log(`  ➜  Local:   http://localhost:${PORT}`);
  ips.forEach(ip => console.log(`  ➜  Network: http://${ip}:${PORT}`));
  console.log('==========================================\n');
});
