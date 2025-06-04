const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a more rodrivert transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use false for TLS
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
};

// Generate user email content
const generateUserEmail = (pnr, driver) => {
  const subject = `Booking Confirmation - PNR: ${pnr.PNRid}`;
  const html = `...`; // Your existing HTML content
  return { subject, html };
};

// Generate ride completion email for driver
const generateRideCompletionDriverEmail = (pnr, user) => {
  const subject = `Ride Completed Successfully - PNR: ${pnr.PNRid}`;
  const html = `...`; // Your existing HTML content
  return { subject, html };
};

// ✅ Define this missing function
const generateRideCompletionUserEmail = (pnr, driver) => {
  const subject = `Thanks for Riding with Us - PNR: ${pnr.PNRid}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Ride is Complete!</h2>
      <p>Dear User,</p>
      <p>We hope you had a pleasant journey. Here are the ride details:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>PNR Number:</strong> ${pnr.PNRid}</p>
        <p><strong>Date:</strong> ${pnr.date}</p>
        <p><strong>From:</strong> ${pnr.locationFrom}</p>
        <p><strong>To:</strong> ${pnr.locationTo}</p>
        <p><strong>Fare:</strong> ₹${pnr.price}</p>
      </div>

      <div style="background-color: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Driver Info</h3>
        <p><strong>Name:</strong> ${driver.firstName} ${driver.lastName}</p>
        <p><strong>Vehicle No.:</strong> ${driver.vehicleNumber}</p>
      </div>

      <p>Thank you for riding with UniBuss!</p>
    </div>
  `;
  return { subject, html };
};

// ✅ Optional: Placeholder for generateVerificationEmail
const generateVerificationEmail = (user) => {
  return {
    subject: "Verify Your Email",
    html: `<p>Hello ${user.firstName}, please verify your email by clicking <a href="#">this link</a>.</p>`,
  };
};

// Enhanced send email function
const sendEmail = async (to, { subject, html }, retries = 2) => {
  const transporter = createTransporter();

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL,
        to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info);
      return true;
    } catch (error) {
      console.error(`Email sending error (Attempt ${attempt}):`, error);
      if (attempt === retries + 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }

  return false;
};

module.exports = {
  sendEmail,
  generateUserEmail,
  generateRideCompletionUserEmail,
  generateRideCompletionDriverEmail,
  generateVerificationEmail,
};
