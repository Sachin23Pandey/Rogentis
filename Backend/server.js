

//! Connecting mongodb database ;

import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose, { connect } from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected with database");
    } catch(err) {
        console.log("Failsed to connect with DB: ", err);
    }
}

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
});



