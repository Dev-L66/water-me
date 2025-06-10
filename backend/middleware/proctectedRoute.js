import jwt from 'jsonwebtoken';
export const protectedRoute = (req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({error: "Unauthorized access. Please login."});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error: "Invalid token. Unauthorized access. Please login."});
        }
        console.log(decoded);
   
        req.userId = decoded.userId;
        
        next();
    }catch(error){
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
}