import mongoose from "mongoose";

const eventplaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  location: { type: String, required: true },
  goodfor: { type: String, required: true },
  type: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  ratting: { type: Number, default: 0 },
});

const Eventplace = mongoose.model("Eventplace", eventplaceSchema);

export default Eventplace;