const express = require("express");
const router = express.Router();
const { createBooking, getBookings, getBookingById } = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/:id", getBookingById);

module.exports = router;
