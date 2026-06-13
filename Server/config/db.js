const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MongoDB connection failed: MONGO_URI is not set");
    process.exit(1);
  }

  try {
    // Keep logs helpful but avoid leaking secrets.
    const uriHost = uri.replace(/^mongodb\+srv:\/\/[\w:@.-]+@/, "mongodb+srv://<credentials>@");

    await mongoose.connect(uri, {
      // Fast fail + clearer errors during DNS/network problems
      serverSelectionTimeoutMS: 7000,
      socketTimeoutMS: 45000,
      // Avoid buffering long enough to cause "buffering timed out" noise
      bufferCommands: false,
      // Improve compatibility with modern MongoDB/mongoose
      maxPoolSize: 10,
    });

    console.log(`MongoDB connected successfully. Host: ${uriHost}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error?.message || error);
    process.exit(1);
  }
};

module.exports = connectDB;

