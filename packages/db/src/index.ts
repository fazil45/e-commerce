import "dotenv/config"
import mongoose from "mongoose";

declare const process: {
  env: {
    DATABASE_URL?: string;
  };
};

export const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });

  if (!process.env.DATABASE_URL) {
    return console.log("DATABASE URL UNDEFINED")
  }
  await mongoose.connect(process.env.DATABASE_URL);
};
