import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export const sendEmail = async (mailOption: Mail.Options) => {
  // Check if email credentials are configured
  if (!process.env.SEND_EMAIL || !process.env.SEND_EMAIL_PASSWORD) {
    throw new Error(
      'Email credentials are not configured. Please set SEND_EMAIL and SEND_EMAIL_PASSWORD environment variables.',
    );
  }

  console.log('Attempting to send email to:', mailOption.to);
  console.log('Using email:', process.env.SEND_EMAIL);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SEND_EMAIL,
      pass: process.env.SEND_EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Verify connection configuration (optional - we can skip if it fails)
  try {
    await transporter.verify();
    console.log('SMTP server is ready to send emails');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('SMTP verification warning:', errorMessage);
    // Don't throw here - try to send anyway
    // Some servers might fail verify but still send emails
  }

  // Try to send the email
  try {
    const info = await transporter.sendMail({
      from: `"Social Media App" <${process.env.SEND_EMAIL}>`,
      ...mailOption,
    });

    console.log('Message sent successfully:', info.messageId);
    console.log('Email sent to:', mailOption.to);
    return info;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to send email:', errorMessage);
    // Provide helpful error message for Gmail authentication issues
    if (
      errorMessage.includes('535') ||
      errorMessage.includes('BadCredentials') ||
      errorMessage.includes('Invalid login')
    ) {
      throw new Error(
        'Gmail authentication failed. Please use an App Password instead of your regular password. ' +
          'Go to: https://myaccount.google.com/apppasswords to create an App Password.',
      );
    }
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};

export const otpEmail = () => {
  return Math.floor(100000 + Math.random() * 999999);
};
