import express from "express";
import {
  getAllReservations,
  getAllUsers,
  getAllHotels,
  getTop10Users,
  getTopHotelsReserved,
} from "../controllers/reports.js";

const router = express.Router();

router.get("/reservations", getAllReservations);
router.get("/users", getAllUsers);
router.get("/hotels", getAllHotels);
router.get("/top10users", getTop10Users);
router.get("/tophotels", getTopHotelsReserved);

export default router;
