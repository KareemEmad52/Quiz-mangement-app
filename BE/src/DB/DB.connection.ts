import mongoose from "mongoose";

export const DB_CONNECTION = async (): Promise<typeof mongoose> => {
  try {
    const connectionString = process.env.DBCONNECTION as string;
    const connection = await mongoose.connect(connectionString);
    console.log("Database connected successfully");
    return connection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};