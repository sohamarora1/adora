import express from "express";
import mongoose from "mongoose";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import cors from 'cors';

const app = express();

// Dynamic CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000', 
            'https://adorafrontend.vercel.app',
            'https://www.adorafrontend.vercel.app'
        ];

        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Auth', 
        'X-Requested-With', 
        'Access-Control-Allow-Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400 // 24 hours
};

// CORS Middleware
app.use(cors(corsOptions));

// Preflight route handler
app.options('*', cors(corsOptions));

// Additional CORS headers middleware
app.use((req, res, next) => {
    // Dynamic origin handling
    const allowedOrigins = [
        'http://localhost:3000', 
        'https://adorafrontend.vercel.app',
        'https://www.adorafrontend.vercel.app'
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Auth');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

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
mongoose.connect("mongodb+srv://sohamarora80:zgYYRc64iHqQ63jz@cluster0.srq1w.mongodb.net/", {
    dbName: "Trendify_Ecommerce",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log(err));

const port = process.env.PORT || 1000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
