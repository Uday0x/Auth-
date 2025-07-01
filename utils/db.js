import mongoose from "mongoose"
import dotenv from "dotenv"


dotenv.config()


const db = ()=>{
     mongoose
    .connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("database connected")
    })
    .catch(()=>{
        console.log("error connecting the databse")
})
}


export default db