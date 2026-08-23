import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for raw high-res photo uploads (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure public/images and public directories exist
  const publicImagesDir = path.join(process.cwd(), 'public', 'images');
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Dedicated direct image upload endpoint: accepts base64 and saves directly to disk
  app.post('/api/upload-image', (req, res) => {
    try {
      const { dataUrl, filename, targetName } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'dataUrl is required' });
      }

      // Extract base64 data
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid dataUrl format' });
      }

      const buffer = Buffer.from(matches[2], 'base64');
      const safeTargetName = (targetName || filename || `upload_${Date.now()}.jpg`).replace(/[^a-zA-Z0-9_\-\.\uAC00-\uD7A3]/g, '_');
      
      // Save in public/images/
      const filePathInImages = path.join(publicImagesDir, safeTargetName);
      fs.writeFileSync(filePathInImages, buffer);

      // Also copy to public/ root for fallback path compatibility
      const filePathInPublic = path.join(publicDir, safeTargetName);
      fs.writeFileSync(filePathInPublic, buffer);

      const publicUrl = `/images/${safeTargetName}`;
      console.log(`[Upload Success] Saved image: ${safeTargetName} (${Math.round(buffer.length / 1024)}KB) -> ${publicUrl}`);

      return res.json({
        success: true,
        url: publicUrl,
        filename: safeTargetName,
        size: buffer.length,
      });
    } catch (err: any) {
      console.error('[Upload Error]', err);
      return res.status(500).json({ error: err?.message || 'Failed to upload image' });
    }
  });

  // Serve static files from public
  app.use(express.static(publicDir));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

