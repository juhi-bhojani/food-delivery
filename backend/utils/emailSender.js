import nodemailer from "nodemailer";

// Create a transporter object using SMTP configuration (update these settings)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send the reset email
export const sendResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:8080/reset-password/${token}`;

  const mailOptions = {
    from: "juhi.bhojani@argusoft.in", // Replace with app's email
    to: email,
    subject: "Password Reset Request",
    html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `,
  };

  await transporter.sendMail(mailOptions);
};
