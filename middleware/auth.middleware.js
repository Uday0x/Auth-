import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();


export const isLoggedIn = async(req,res,next)=>{
    //get the token req //we gave the req a superpower using cookie-parser
        try {
            console.log(req.cookies);
            let token = req.cookies?.token
    
    
    
            if(!token){
                console.log("no token ");
                return res.status(400).json({
                    success:false,
                    message:"auth failed",  
                })
            }
        
        const decoded = await jwt.verify(token, process.env.JWt_SECRET);
        // console.log("ok is it reaching here?")
        console.log("decoded data",decoded)
        
    
        req.user = decoded;
        next()
        } 
        catch (error) {
            console.log("Auth middleware failure");
            return res.status(500).json({
                success:false,
                message:"Internal server error",
            });
        }

}