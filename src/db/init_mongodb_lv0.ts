import mongoose from "mongoose";

const connectionString = `mongodb://admin:password@localhost:27017`;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

if (1 == 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", {
    color: true,
  });
}
