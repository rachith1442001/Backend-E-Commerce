import nodemailer from 'nodemailer';

export async function sendOTPToUserEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'melisa.durgan91@ethereal.email',
        pass: 'tNFKx7rmP55ZNgf1e7'
      }
    });

    const mailOptions = {
      from: '"Rachith" "<bhoom@gmail.com>"',
      to: 'rachithrpoojary@gmail.com',
      subject: 'OTP for Your Order',
      text: `Your OTP for the order is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.send(info)
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
