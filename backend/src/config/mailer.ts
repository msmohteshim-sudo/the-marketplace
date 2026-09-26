import nodemailer from 'nodemailer';
import { config } from './env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmailUser,
    pass: config.gmailPass
  }
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  if (!config.gmailUser || config.gmailUser === 'YOUR_GMAIL_ADDRESS_HERE') {
    console.log(`[DEV] Password reset token for ${email}: ${token}`);
    console.log(`[DEV] Reset URL: ${config.frontendUrl}/auth/reset-password?token=${token}`);
    return;
  }
  
  const resetUrl = `${config.frontendUrl}/auth/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: `"The Marketplace" <${config.gmailUser}>`,
    to: email,
    subject: 'Reset Your Password — The Marketplace',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0b14; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <h1 style="color: #7c3aed; margin-bottom: 8px;">The Marketplace</h1>
        <p style="color: #94a3b8; margin-bottom: 32px; font-size: 14px;">Every Skill. Every Task. Every Idea. Every Opportunity.</p>
        <h2 style="color: #e2e8f0;">Reset Your Password</h2>
        <p style="color: #94a3b8;">You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        <p style="color: #64748b; font-size: 12px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `
  });
};
