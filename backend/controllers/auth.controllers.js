import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {
  sendResetPasswordMail,
  sendResetPasswordSuccessMail,
  sendWelcomeMail,
} from "../config/nodemailer/nodemailer.config.js";
import { generateAndSetCookie } from "../utils/lib/generateAndSetCookie.js";

//signup
export const signupController = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields arer required!" });
    }

    const existingMail = await User.findOne({ email });
    if (existingMail) {
      return res.status(400).json({ error: "email already exists!" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(Math.random() * 100000) + 1;

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      verificationToken: {
        token: verificationToken,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      },
    });
    generateAndSetCookie(user._id, res);
    await sendWelcomeMail(user.email, verificationToken);

    return res.status(201).json({
      message: "User created successfully",
      ...user._doc,
      password: undefined,
    });
  } catch (error) {
    console.error(`Error in signupController ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//verifyEmail
export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(404).json({ error: "Verification code required!" });
    }
    const user = await User.findOne({
      "verificationToken.token": code,
      "verificationToken.expiresAt": { $gt: Date.now() },
    });
  
    if (!user) {
      return res.status(400).json({ error: "Invalid code or expired code." });
    }
      if(user.isVerified){
      return res.status(400).json({ error: "Email already verified." });
    }

    user.isVerified = true;
    user.verificationToken.token = undefined;
    user.verificationToken.expiresAt = undefined;

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      ...user.doc,
      password: undefined,
    });
  } catch (error) {
    console.error(`Error in verifyEmailController ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
   

    const existingUsername = await User.findOne({ username });
    if (!existingUsername) {
      return res
        .status(404)
        .json({ error: "Invalid username. User not found." });
    }
    if (existingUsername.isVerified === false) {
      return res.status(400).json({ error: "Please verify your email first." });
    }
    const matchPassword = await bcryptjs.compare(
      password,
      existingUsername.password
    );
    if (!matchPassword) {
      return res.status(400).json({ error: "Invalid password." });
    }
    generateAndSetCookie(existingUsername._id, res);
    return res.status(200).json({
      message: "Login successful",
      ...existingUsername._doc,
      password: undefined,
    });
  } catch (error) {
    console.error(`Error in loginController ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const hello = (req, res) => {
  res.send("hello");
};

//logout
export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(`Error in logoutController ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//resetPassword
export const resetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!email) {
      return res
        .status(404)
        .json({ message: "Invalid email! User does not exist!" });
    }
    const forgotPasswordCode = Math.floor(Math.random() * 100000) + 1;
    console.log(forgotPasswordCode);
    user.forgotPasswordToken.token = forgotPasswordCode;
    console.log(user.forgotPasswordToken.token);
    user.forgotPasswordToken.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendResetPasswordMail(user.email, forgotPasswordCode);
    return res
      .status(200)
      .json({ message: "Password reset code sent successfully.", ...user.doc, password: undefined });
  } catch (error) {
    console.log(`Error in resetPasswordController ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//verifyresetPassword
export const verifyResetPasswordController = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(404).json({ error: "Reset password code required!" });
    }
 
    const user = await User.findOne({
      "forgotPasswordToken.token": code,
      "forgotPasswordToken.expiresAt": { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid code or expired code." });
    }

    user.forgotPasswordToken.token = undefined;
    user.forgotPasswordToken.expiresAt = undefined;

    await user.save();
    await sendResetPasswordSuccessMail(user.email);
    return res.status(200).json({
      message: "Reset password code verified successfully",
      ...user.doc,
      password: undefined,
    });
  } catch (error) {
    console.log(`Error in verifyResetPasswordController: ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//checkAuth - getME

export const checkAuth = async (req, res)=>{
  try{
const user = await User.findOne(req.userId);
if(!user){
  return res.status(404).json({error: "User not found."});
}
return res.status(200).json({message: "User found successfully.", ...user.doc, password: undefined});
  }catch(error){
    console.error(`Error in getMe ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
  
}