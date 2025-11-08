import Otp from "../models/OtpModel.js";
import { sendEmail } from "../utils/sendEmail.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export default {
  sendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      await Otp.deleteMany({ email });

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // ✅ 3 min expiry

      await Otp.create({ email, otp, expiresAt });

      await sendEmail(
        email,
        "OTP Verification Code",
        `Your OTP code is: ${otp}`
      );

      res.status(200).json({ success: true, message: "OTP sent" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const record = await Otp.findOne({ email });

      if (!record) {
        return res.status(400).json({ message: "OTP not found" });
      }

      if (new Date() > record.expiresAt) {
        await Otp.deleteOne({ email });
        return res.status(400).json({ message: "OTP expired" });
      }

      if (record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      await Otp.deleteOne({ email });
      return res.status(200).json({ success: true, message: "Verified" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },

  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      await Otp.deleteMany({ email });

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

      await Otp.create({ email, otp, expiresAt });

      await sendEmail(
        email,
        "Your New OTP Code",
        `Your new OTP is: ${otp}`
      );

      res.status(200).json({ success: true, message: "OTP resent" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
};
