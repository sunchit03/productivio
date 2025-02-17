import mongoose from "mongoose";

const connectDB = async () => {
  try {

    if (mongoose.connection.readyState >= 1) {
      return; // Already connected
    }

    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
