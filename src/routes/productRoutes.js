import express from "express";
import auth from "../middlewares/auth.js";
import multer from "multer";
import { addProduct, getProductsByLocation } from "../controllers/productController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/add", auth(["seller"]), upload.single("image"), addProduct);
router.get("/", getProductsByLocation);

export default router;
