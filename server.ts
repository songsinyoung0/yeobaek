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

  // Inquiries persistent storage directory
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const inquiriesFile = path.join(dataDir, 'inquiries.json');

  // Submit Inquiry Endpoint: Saves to server disk and dispatches email directly to representative
  app.post('/api/send-inquiry', async (req, res) => {
    try {
      const inquiry = req.body;
      const refNum = inquiry.referenceNumber || ('YB-' + Math.floor(100000 + Math.random() * 900000));
      const now = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // 1. Save to local data/inquiries.json for backup
      let existingInquiries: any[] = [];
      try {
        if (fs.existsSync(inquiriesFile)) {
          const content = fs.readFileSync(inquiriesFile, 'utf-8');
          existingInquiries = JSON.parse(content);
        }
      } catch {
        existingInquiries = [];
      }
      const record = {
        id: 'inq_' + Date.now(),
        referenceNumber: refNum,
        submittedAt: now,
        status: 'NEW',
        data: inquiry,
        ...inquiry,
      };
      existingInquiries.unshift(record);
      fs.writeFileSync(inquiriesFile, JSON.stringify(existingInquiries, null, 2), 'utf-8');

      // 2. Format email body
      const subject = `[여백스튜디오 신규 예약문의] ${inquiry.groomName || inquiry.brideName || '고객'}님 (${inquiry.weddingDate || '일정미정'} 예식)`;
      const emailPayload = {
        _subject: subject,
        _replyto: inquiry.email || 'yeobaek5795@naver.com',
        접수번호: refNum,
        접수일시: now,
        신랑성함: inquiry.groomName || '-',
        신부성함: inquiry.brideName || '-',
        연락처: inquiry.phone || '-',
        고객이메일: inquiry.email || '미입력',
        예식일자: inquiry.weddingDate || '-',
        예식시간: inquiry.weddingTime || '12:00',
        예식장소: inquiry.venueName || '-',
        선택상품: inquiry.packageName || inquiry.selectedPackage || '-',
        적용가격: inquiry.priceText || '-',
        리뷰이벤트: inquiry.reviewEvent === 'JOIN' ? '참여함 (보정본 5~10장 우선 발송)' : '참여 안함',
        요청사항: inquiry.specialRequests || '없음',
      };

      // 3. Dispatch to representative emails (Gmail: tlsdud3071@gmail.com, Naver: yeobaek5795@naver.com)
      const targetEmails = ['tlsdud3071@gmail.com', 'yeobaek5795@naver.com'];
      const sendPromises = targetEmails.map(async (email) => {
        try {
          const resp = await fetch(`https://formsubmit.co/ajax/${email}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(emailPayload),
          });
          return { email, ok: resp.ok };
        } catch (err) {
          console.warn(`[Inquiry Mail Notice] Failed to send to ${email}:`, err);
          return { email, ok: false };
        }
      });

      await Promise.allSettled(sendPromises);
      console.log(`[Inquiry Recorded] Ref: ${refNum}, Couple: ${inquiry.groomName || '-'}/${inquiry.brideName || '-'}, Date: ${inquiry.weddingDate}`);

      return res.json({
        success: true,
        referenceNumber: refNum,
        submittedAt: now,
      });
    } catch (err: any) {
      console.error('[Inquiry Error]', err);
      return res.status(500).json({ error: err?.message || 'Failed to process inquiry' });
    }
  });

  // Get Inquiries endpoint for admin panel
  app.get('/api/inquiries', (_req, res) => {
    try {
      if (fs.existsSync(inquiriesFile)) {
        const content = fs.readFileSync(inquiriesFile, 'utf-8');
        const list = JSON.parse(content);
        const normalized = Array.isArray(list)
          ? list.map((item: any) => ({
              id: item.id || 'inq_' + Math.random(),
              referenceNumber: item.referenceNumber || 'YB-000000',
              submittedAt: item.submittedAt || '',
              status: item.status || 'NEW',
              data: item.data || {
                groomName: item.groomName || '',
                brideName: item.brideName || '',
                phone: item.phone || '',
                email: item.email || '',
                weddingDate: item.weddingDate || '',
                weddingTime: item.weddingTime || '12:00',
                venueName: item.venueName || '',
                selectedPackage: item.selectedPackage || 'raw',
                priceType: item.priceType || 'NORMAL',
                reviewEvent: item.reviewEvent || 'JOIN',
                specialRequests: item.specialRequests || '',
                agreeToTerms: true,
              },
            }))
          : [];
        return res.json({ inquiries: normalized });
      }
      return res.json({ inquiries: [] });
    } catch {
      return res.json({ inquiries: [] });
    }
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

