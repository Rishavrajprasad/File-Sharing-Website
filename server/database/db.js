import mongoose from "mongoose";

const DB_URL = 'mongodb+srv://rishav:rishav@cluster0.4x2r742.mongodb.net/?retryWrites=true&w=majority'
const DBConnection =async () =>{
    try {
       await mongoose.connect(DB_URL)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error('Error while connecting MongoDB',error.message );
    }
}

export default DBConnection;