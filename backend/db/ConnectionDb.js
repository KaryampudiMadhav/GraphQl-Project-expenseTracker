import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Jai Shree Ram Connected the Db.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
