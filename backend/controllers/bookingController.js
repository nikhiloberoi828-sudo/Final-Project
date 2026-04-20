const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const { name, phone, email, location, hotel_name, check_in, check_out, room_type, total_price } = req.body;

    if (!name || !email || !location || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: name, email, location, check_in, check_out",
      });
    }

    if (new Date(check_out) <= new Date(check_in)) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in" });
    }

    const booking = await Booking.create({
      name: name.trim(),
      phone: phone ? phone.trim() : null,
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
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
};
