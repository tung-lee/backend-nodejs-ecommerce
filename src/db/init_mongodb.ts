import mongoose from "mongoose";
import { countConnections } from "../helpers/check_connect";
import config from "../configs/config_mongodb";

const connectionString = `${config.db.connectionString}`;

class Database {
  private static instance: Database;

  constructor() {
    this.connect();
  }

  connect(_type: string = "mongodb") {
    if (1 == 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", {
        color: true,
      });
    }
    mongoose
      .connect(connectionString, {
        maxPoolSize: 50,
        dbName: config.db.name,
      })
      .then(() => {
        console.log("Connected to MongoDB");
        countConnections();
      })
      .catch((err) => {
        console.log("Failed to connect to MongoDB", err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const mongodbInstance = Database.getInstance();

export default mongodbInstance;
