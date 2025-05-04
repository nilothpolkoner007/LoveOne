import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const chatRoomSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatRoomSchema);

export default Chat; 
