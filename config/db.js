import mongoose from "mongoose";

const connectDB=async()=>{
 try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database is connected....")
 } catch (error) {
    console.log("This is the Error:", error.messages)
    process.exit(1);
 }
}

export default connectDB;