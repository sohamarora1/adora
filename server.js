import express from "express";
import mongoose from "mongoose";
import bodyParser from "express";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import cors from 'cors';

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*', // or '*' to allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}));






//home testing route
app.get("/", (req, res) => res.json({ message: "This is home route" }));

//user Router
app.use("/api/user", userRouter);

//product router
app.use("/api/product", productRouter);

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
