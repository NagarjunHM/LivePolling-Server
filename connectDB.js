import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(
      "mongodb+srv://testdemotest31:lRp2RnzuTqCu5x2H@livepolling1.bpyfsie.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("mongodb connected ", con.connection.host);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
