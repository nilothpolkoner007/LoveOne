import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: [{ type: String, required: true }],
  email: { type: String, required: true, unique: true },
  birthday: { type: Date, required: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  // 👇 Partner feature fields
  partnerCode: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
  