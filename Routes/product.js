import express from "express";
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../Controllers/product.js";
const router = express.Router();
export default router;

router.post("/add", addProduct);

//get products
router.get("/all", getProducts);

//get product by id
router.get("/:id", getProductById);

//update product by id
router.put("/:id", updateProductById);

//delete product by id 
router.delete("/:id",deleteProductById);
