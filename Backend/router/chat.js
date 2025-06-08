import express from 'express';
import partner from '../module/partner.js';
import multer from 'multer';
import ChatBundle from '../module/ChatMessage.js';
import { getSocketIO } from './chatSocket.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Use in-memory storage (for serverless)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload route (via Cloudinary)
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'chat_uploads', resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Upload failed' });
        }

        return res.json({ imageUrl: result.secure_url });
      },
    );

    // Pipe file buffer to cloudinary stream
    result.end(req.file.buffer);
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// ✅ Delete a message from chat
router.delete('/message', async (req, res) => {
  const { roomId, sender_id, created_at } = req.body;

  try {
    const result = await ChatBundle.updateOne(
      { roomId, sender_id },
      { $pull: { messages: { created_at } } },
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('❌ Failed to delete message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ✅ Fetch messages by room
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const bundles = await ChatBundle.find({ roomId }).sort({ 'messages.created_at': 1 });

    const allMessages = bundles
      .flatMap((b) =>
        b.messages.map((m) => ({
          ...m.toObject(),
          sender_id: b.sender_id,
        })),
      )
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    res.json(allMessages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
