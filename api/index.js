import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import listingRoute from './routes/listing.route.js'
dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
})

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',router)
app.use('/api/user',userRouter);
app.use('/api/listing',listingRoute);
app.use((err,req,res,next)=>{
    const statusCode = err.status || 500;
    const errMessage = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success : false,
        message: errMessage,
    });
});


app.listen(3000,()=>{
    console.log("Server at port 3000.");
});