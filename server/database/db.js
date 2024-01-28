import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const DB_URL = process.env.DB_URL;
const DBConnection =async () =>{
    try {
       await mongoose.connect(DB_URL)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error('Error while connecting MongoDB',error.message );
    }
}

export default DBConnection;