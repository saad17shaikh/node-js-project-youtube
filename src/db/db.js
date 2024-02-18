import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    const dbInstance = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`);
    console.log(dbInstance.connection.host)
    
  } catch (error) {
    console.log(error);
  }
};
