import mongoose from 'mongoose';

const singleMessageSchema = new mongoose.Schema({
  content: { type: String },
  imageUrl: { type: String },
  created_at: { type: Date, default: Date.now },
});

const chatBundleSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    messages: [singleMessageSchema], // ✅ messages as array
  },
  {
    timestamps: true,
  },
);

chatBundleSchema.index({ roomId: 1 }); // Optional index for faster lookups

const ChatBundle = mongoose.model('ChatBundle', chatBundleSchema);

export default ChatBundle;
