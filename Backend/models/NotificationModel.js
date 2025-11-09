import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  mechanic_name:
  {
    type:String,
    required:true
  },
  mechanic_mobile: {
    type: String,
    required: true,
  },
  customer_mobile: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  mechanic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  latitude:{
    type: Number,
    required: false,},
    longitude:{
      type:Number,
      required:false,
    },
  isAccept: {
    type: Boolean,
    default: false,
  },
  service_id:{
    type:String,
    required:true,  }

}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;