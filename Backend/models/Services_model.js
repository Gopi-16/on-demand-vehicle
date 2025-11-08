import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema({
  username: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },

  service: { type: String, required: true },

  status: { type: String, default: "pending" },

  mechanic_id: { type: String, default: "" },

  top5_mechanics: {
    type: [String],
    default: []
  },

  price: { type: String },

  latitude: { type: Number },
  longitude: { type: Number },

  issue: { type: String },
  vehicle_number: { type: String },

  createdAt: { type: Date }
}, { timestamps: true });

const services_ = mongoose.model("service_data", serviceSchema);

export default services_;
