import { NextResponse } from "next/server";
const Booking = require("../../../../backend/models/Booking");

export async function POST(req: Request) {
  try {
    const { 
      name, phone, email, location, hotel_name, 
      check_in, check_out, room_type, total_price 
    } = await req.json();

    if (!name || !email || !location || !check_in || !check_out) {
      return NextResponse.json(
        { success: false, message: "Required fields missing: name, email, location, check_in, check_out" },
        { status: 400 }
      );
    }

    if (new Date(check_out) <= new Date(check_in)) {
      return NextResponse.json(
        { success: false, message: "Check-out must be after check-in" },
        { status: 400 }
      );
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

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { success: false, message: `Booking failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await Booking.findAll({ order: [["id", "DESC"]] });
    return NextResponse.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
