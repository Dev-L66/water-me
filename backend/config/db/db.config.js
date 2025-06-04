import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Connected to database: ${connection.connection.name} at ${connection.connection.host}:${connection.connection.port}`
    );
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
};
