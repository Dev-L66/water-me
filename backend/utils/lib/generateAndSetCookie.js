import jwt from "jsonwebtoken";
export const generateAndSetCookie = (userId, res)=>{
   const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
   res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1 * 60 * 60 * 24 ,  
   });
}