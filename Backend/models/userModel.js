import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }, // This field will store the user's cart data as an object
  },
  { minimize: false }, // This option ensures that empty objects are saved in the database instead of being removed
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
