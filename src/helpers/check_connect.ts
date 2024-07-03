import mongoose from "mongoose";
import os from "os";
import process from "process";

const SECONDS = 5000;

const countConnections = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numConnections}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numCores * 5;

    console.log("Active connections: ", numConnections);
    console.log(`Memory usage: ${memoryUsage / Math.pow(1024, 2)} MB`);

    if (numConnections > maxConnections) {
      console.log("Connection overload detected");
    }
  }, SECONDS); // monitor every 5 seconds
};

export { countConnections, checkOverload };
