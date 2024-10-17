import express from "express";
import { addAddress, getAddress } from "../Controllers/address.js";
import { Authenticated } from "../Middlewares/Auth.js";
const router = express.Router();
router.post("/add", Authenticated, addAddress);

//get adress
router.get('/get',Authenticated,getAddress)


export default router;
