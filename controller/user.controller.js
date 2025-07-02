import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

dotenv.config();

const registerUser = async (req, res) => {
  //get user deatils
  //avlidate the user details
  //check if user is laready present 
  //craete a user 
  //craete a verfication token
  //save token in databse 
  //send token as email to USER 
  //send sucess staus to user


  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token; //databse ko token de rhe hai

    await user.save();
    // console.log("Code idhar thak toh aa rha hai");

    //send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
    // console.log("Creating transporter with config:");
    // console.log({
    //   host: process.env.MAILTRAP_HOST,
    //   port: Number(process.env.MAILTRAP_PORT),
    //   user: process.env.MAILTRAP_USERNAME,
    //   pass: process.env.MAILTRAP_PASSWORD,
    // });


    transporter.verify((error, success) => {
      if (error) {
        console.log("SMTP Error:", error);
      } else {
        console.log("SMTP connection success", success);
      }
    });


    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email", // Subject line
      text: `Please click on the following link:
      ${process.env.BASE_URL}/api/v1/users/verify/${token}
      `,
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered ",
      error,
      success: false,
    });
  }
};


const verifyUser = async(req,res)=>{
     //get token from URL 
     //validate
     //find user based on token
     //if not
     //set is verified to true 
     //remove verificationToken
     //save
     //return response 

     const { token } = req.params;
     console.log(token);

      //valdiate
      if(!token){
        return res.status(402).json({
          message:"token doesnt exist"
        })
      }


      try {
        console.log("verification Started");

        const user = await User.findOne({
           verificationToken : token
        });

        // console.log(user);


        if(!user){
          return res.status(404).json({
            message:"Invalid token"
          })
        }
        
        user.isVerified = true;
        user.verificationToken = undefined; //yaad rakna its undeined not Null //In undefined both key value are gone but null only value is gone
        await user.save();
        
       
       console.log("has the code reached here");
       console.log(user.isVerified,user.verificationToken);

       res.status(400).json({
          message:"user verfied sucessfully",
          success:true,
       });

      } catch (error) {
         res.status(400).json({
          message:"user not verffied",
          error,
          success : false,
         })
      }

    

}


const loginUser = async(req,res)=>{

  //Get the deatils 
  //validate the datails 
  //compare the hashed passowrd ,coz it cannot be dehashed like decryption
  //create a session using jwt


  const { email , password }= req.body

  //validate
  if(!email || !password){
    return res.staus(400).josn({
      message:"All fields are requrired",
    })

  }

    try {
      const user =await User.findOne({
         email
      })  

      if(!user){
        return res.staus(400).josn({
          message:"User doesnt exist",
        });
      }


      const isMatch = await bcrypt.compare( password, user.password);
      console.log("has the code reached here?")
      console.log(isMatch); //will be set as true


      if(!isMatch){
        return res.status(400).json({
          message:"Invalid username or password"
        });
      }


      
      const token = jwt.sign(
          { id:user._id , role:user.role },//user kiase acces ho rha ??scroll up alil idhar hi login mein hi access hoga uska
          process.env.JWt_SECRET,
          {
            expiresIn:"24h"
          }
    )


    const cookieoptions ={
      hhtpOnly:true,
      secure: true,
      maxAge:24*60*60*1000
    }

    res.cookie("token",token,cookieoptions)

    res.status(200).json({
        sucess:true,
        message:"login succcesful",
        user:{
          id:user._id,
          name:user.name,
          role:user.role,
        }
    })

    } catch (error) {
      res.status(201).json({
        sucess:false,
        message:"login not sucessful plz try again"
      })
    
  }
}


const getMe =async(req,res)=>{
    try {
      const user = await User.findById(req.user.id).select("-password") //sarri details dega except passowrd ki
      console.log(user);

      if(!user){
        return res.status(400).json({
          message:"cannot get the user",
          success:false
        })
      }

      return res.status(400).json({
        success:true,
        user,
      })
    } catch (error) {
        console.log("error in getMe",error)
    }
}

const logout =async(req,res)=>{
  try {
      //2 methods to logout 
      //1)clear the cookie

      res.cookie('token','',{});
      return res.status(200).json({
        success:true,
        message:"user logged out successfully",
      })

      //2)expire the cokkie Time
      //the ocde will not execute below this line due to return above
      res.cookie('token',' ',{
        expiresIn:new Date()
      })
  } catch (error) {
      return res.status(400).json({
        success:false,
        message:"User still loggedin"
      })
  }

}

const forgotPassowrd = async(req,res)=>{
  
}


const resetPassword = async(req,res)=>{

}



export { registerUser, verifyUser, loginUser, getMe,logout, forgotPassowrd, resetPassword}