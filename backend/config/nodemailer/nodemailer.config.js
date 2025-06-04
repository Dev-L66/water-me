import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,

  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendWelcomeMail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_ID,
      to: email,
      subject: "Welcome, to water me , please verify your account to continue.",
      text: `Your verfication code is: ${verificationToken}`,
    });

    console.log(`Welcome mail sent successfully. ${info.messageId}.`);
  } catch (error) {
    console.log(`Error sending welcome mail: ${error}`);
  }
};

export const sendResetPasswordMail = async (email, forgotPasswordCode)=>{
   try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_ID,
      to: email,
      subject: "Please reset your password.",
      text: `Your reset code is: ${forgotPasswordCode}, Please reset your password,the code is valid for 10 minutes only.`,
    });

    console.log(`Password reset mail sent successfully. ${info.messageId}.`);
  } catch (error) {
    console.log(`Error sending password reset mail: ${error}`);
  }
}


export const sendResetPasswordSuccessMail = async (email)=>{
     try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_ID,
      to: email,
      subject: "Reset Password Successful.",
      text: `Your password has been reset successfully.`,
    });

    console.log(`Reset password mail sent successfully. ${info.messageId}.`);
  } catch (error) {
    console.log(`Error sending reset password successful mail: ${error}`);
  }
}