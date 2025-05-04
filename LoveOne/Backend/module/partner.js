import mongoose from 'mongoose';
const MilestoneSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  image: String,
});
const partnerSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  milestones: [MilestoneSchema],
});

export default mongoose.model('Partner', partnerSchema);
