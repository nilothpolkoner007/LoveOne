import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    coupleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple', required: true },
    name: { type: String, required: true }, // e.g. "Anniversary Dinner"
    eventType: {
      type: String,
      enum: ['birthday', 'anniversary', 'date', 'custom'],
      required: true,
    },
    date: { type: Date, required: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eventplace' },
    notes: String,
    images: [String],
    repeat: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Event', EventSchema);
