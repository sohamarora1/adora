import express from "express";
import mongoose from "mongoose";
import bodyParser from "express";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import cors from 'cors';

const cors = require('cors');
const express = require('express');
const app = express();

// Allow CORS for specific frontend origins
const allowedOrigins = ['http://localhost:3000', 'https://adorafrontend.vercel.app'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials like cookies or tokens
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//home testing route
app.get("/", (req, res) => res.json({ message: "This is home route" }));

//user Router
app.use("/api/user", userRouter);

//product router
app.use('/api/product',productRouter); // Replace 'products' with your route file

//cart router
app.use("/api/cart", cartRouter);

// address router
app.use("/api/address", addressRouter);

mongoose
  .connect(
    "mongodb+srv://sohamarora80:zgYYRc64iHqQ63jz@cluster0.srq1w.mongodb.net/",
    {
      dbName: "Trendify_Ecommerce",
    }
  )
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));
const port = 1000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
