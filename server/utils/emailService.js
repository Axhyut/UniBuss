const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a more robust transporter
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

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Ride is Confirmed!</h2>
      <p>Dear User,</p>
      <p>Your booking has been successfully confirmed. Here are your trip details:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>PNR Number:</strong> ${pnr.PNRid}</p>
        <p><strong>Date:</strong> ${pnr.date}</p>
        <p><strong>Time:</strong> ${pnr.time}</p>
        <p><strong>Pick-up Location:</strong> ${pnr.locationFrom}</p>
        <p><strong>Drop-off Location:</strong> ${pnr.locationTo}</p>
        <p><strong>Distance:</strong> ${pnr.distance} km</p>
        <p><strong>Fare:</strong> ₹${pnr.price}</p>
      </div>

      <div style="background-color: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Driver Details</h3>
        <p><strong>Name:</strong> ${driver.firstName} ${driver.lastName}</p>
        <p><strong>Vehicle Number:</strong> ${driver.vehicleNumber}</p>
        <p><strong>Vehicle Type:</strong> ${driver.vehicleType}</p>
        <p><strong>Contact:</strong> ${driver.phoneNumber}</p>
      </div>

      <p>For any assistance, please contact our support team.</p>
      <p>Thank you for choosing our service!</p>
    </div>
  `;

  return { subject, html };
};

// Generate ride completion email for driver
const generateRideCompletionDriverEmail = (pnr, user) => {
  const subject = `Ride Completed Successfully - PNR: ${pnr.PNRid}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Ride Successfully Completed</h2>
      <p>Dear Driver,</p>
      <p>We are pleased to inform you that the following ride has been marked as completed:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>PNR Number:</strong> ${pnr.PNRid}</p>
        <p><strong>Date:</strong> ${pnr.date}</p>
        <p><strong>Time:</strong> ${pnr.time}</p>
        <p><strong>Pick-up Location:</strong> ${pnr.locationFrom}</p>
        <p><strong>Drop-off Location:</strong> ${pnr.locationTo}</p>
        <p><strong>Total Distance:</strong> ${pnr.distance} km</p>
        <p><strong>Total Fare:</strong> ₹${pnr.price}</p>
      </div>

      <div style="background-color: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">User Details</h3>
        <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Contact:</strong> ${user.phoneNumber}</p>
      </div>

      <p>Thank you for providing excellent service to our users!</p>
      <p>For any issues or concerns, please contact our support team.</p>
    </div>
  `;

  return { subject, html };
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
  generateVerificationEmail,
};
