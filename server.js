import express from "express";
import mongoose from "mongoose";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import cors from 'cors';

const app = express();



app.use(cors());
// Dynamic CORS Configuration

// Rest of your server configuration...
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);
app.use('/api/product', productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);

// MongoDB Connection
mongoose.connect("mongodb+srv://sohamarora80:sohamarora80@cluster0.srq1w.mongodb.net/", {
    dbName: "Trendify_Ecommerce",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log(err));

const port = process.env.PORT || 1000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
