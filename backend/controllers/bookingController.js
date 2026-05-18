const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const { name, phone, email, location, hotel_name, check_in, check_out, room_type, total_price } = req.body;
    console.log(req.body);
    if (!name || !phone || !email || !location || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: name, phone, email, location, check_in, check_out",
      });
    }

    if (new Date(check_out) <= new Date(check_in)) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in" });
    }

    const booking = await Booking.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      location: location.trim(),
      hotel_name: hotel_name || "General Booking",
      check_in,
      check_out,
      room_type: room_type || "Standard Room",
      total_price: total_price || 0,
    });

    return res.status(201).json({
      success: true,
      message: `Booking confirmed at ${hotel_name || "your selected property"}!`,
      data: {
        id: booking.id,
        name: booking.name,
        hotel: booking.hotel_name,
        check_in: booking.check_in,
        check_out: booking.check_out,
        room_type: booking.room_type,
        total_price: booking.total_price,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ success: false, message: `Booking failed: ${error.message}` });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [["id", "DESC"]] });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  console.log("DEBUG: getBookingById hit with ID:", req.params.id);
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bookings?email=user@example.com — fetch active bookings by email
const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }
    const { Op } = require("sequelize");
    const bookings = await Booking.findAll({
      where: {
        email: email.trim().toLowerCase(),
        status: { [Op.ne]: "cancelled" },
      },
      order: [["id", "DESC"]],
    });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/bookings/cancel — cancel a booking by id + email
const cancelBooking = async (req, res) => {
  try {
    const { bookingId, email } = req.body;
    if (!bookingId || !email) {
      return res.status(400).json({ success: false, message: "bookingId and email are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const booking = await Booking.findOne({
      where: { id: Number(bookingId), email: email.trim().toLowerCase() },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found for this email" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "This booking is already cancelled" });
    }

    await booking.update({ status: "cancelled" });

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: { id: booking.id, status: "cancelled" },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByEmail,
  cancelBooking,
};
