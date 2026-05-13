const express = require("express");
const router = express.Router();
const { createBooking, getBookings, getBookingById, getBookingsByEmail, cancelBooking } = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/by-email", getBookingsByEmail);
router.patch("/cancel", cancelBooking);
router.get("/:id(\\d+)", getBookingById);

module.exports = router;
