import express from "express"
import dotenv from "dotenv"
import db from "./utils/db.js";
import userRoutes from "./routes/user.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express();

const port = process.env.PORT || 3000


app.get('/uday',(req,res)=>{
    res.send(`hello we r aliens`)
})


app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



//execution of db
db();


app.use('/api/v1/users',userRoutes)

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`)
})