import express from "express";
import mongoose from "mongoose";
import bodyParser from "express";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
  origin:true,
  methods:[ "GET","POST","PUT","DELETE"],
  credentials:true
}))



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
