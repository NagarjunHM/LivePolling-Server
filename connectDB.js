import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb connected ", con.connection.host);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
