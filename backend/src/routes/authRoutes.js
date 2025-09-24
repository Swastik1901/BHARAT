import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

//POST /api/auth/register
// Register a new user
router.post("/register", register);

//    POST /api/auth/login   Authenticate user and get token
router.post("/login", login);

export default router;