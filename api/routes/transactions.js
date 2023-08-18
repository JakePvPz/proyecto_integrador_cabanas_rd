import express from "express";
import {
  createTransaction,
  getAllTransactions,
} from "../controllers/transaction.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTransaction);
router.get("/:year/:month", getAllTransactions);

export default router;
