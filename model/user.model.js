import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
    {
        name:String,
        email:String,
        password:{
            type:String,
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user",
        },

        isVerified:{
            default:false,
            type:Boolean,
        },

        verificationToken:{
            type:String,
        },

        resetPassowrdToken:{
            type:String,
        },

        resetPassowrdExpires :{
            type :Date,
        },


    },{
        timestamps :true,
    }
);
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next();
})

const User = mongoose.model("User",userSchema)


export default User