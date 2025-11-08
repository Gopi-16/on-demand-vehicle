import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can change to your SMTP service
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"On Demand Vehicle Assistance" <${process.env.EMAIL}>`,
    to: email,
    subject,
    text: message,
  });
};
