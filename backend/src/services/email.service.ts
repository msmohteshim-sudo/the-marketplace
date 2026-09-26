import nodemailer from 'nodemailer';
import { config } from '../config/env';

export const sendEmailVerificationCode = async (toEmail: string, otp: string): Promise<{ success: boolean; delivered: boolean; message: string }> => {
  if (config.gmailUser && config.gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.gmailUser,
          pass: config.gmailPass
        }
      });

      const mailOptions = {
        from: `"The Marketplace" <${config.gmailUser}>`,
        to: toEmail,
        subject: `${otp} is your verification code for The Marketplace`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0d0f17; padding: 30px; color: #ffffff; border-radius: 12px;">
            <div style="max-width: 500px; margin: 0 auto; background: #141724; border: 1px solid #2d334d; border-radius: 12px; padding: 24px;">
              <h2 style="color: #a78bfa; margin-top: 0; font-size: 22px;">Verify Your Email Address</h2>
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.5;">
                Welcome to <strong>The Marketplace</strong>! Use the 6-digit verification code below to complete your account registration:
              </p>
              <div style="background: #1e1b4b; border: 1px dashed #7c3aed; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #ffffff;">${otp}</span>
              </div>
              <p style="color: #94a3b8; font-size: 13px;">
                This code will expire in 5 minutes. If you did not request this verification code, please ignore this email.
              </p>
              <hr style="border: 0; border-top: 1px solid #2d334d; margin: 20px 0;" />
              <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} The Marketplace. All rights reserved.
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Verification code email successfully delivered to ${toEmail}`);
      return {
        success: true,
        delivered: true,
        message: `Verification code sent to ${toEmail}. Check your inbox or spam folder.`
      };
    } catch (err: any) {
      console.error('[EMAIL SERVICE] Failed to send Gmail SMTP email:', err.message);
      return {
        success: true,
        delivered: false,
        message: `Could not connect to SMTP server. Using local code: ${otp}`
      };
    }
  }

  console.log(`[EMAIL SERVICE] (Dev Mode) Verification code for ${toEmail}: ${otp}`);
  return {
    success: true,
    delivered: false,
    message: `Dev verification code generated for ${toEmail}.`
  };
};
