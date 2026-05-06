import { NextResponse } from "next/server";
const Contact = require("../../../../backend/models/Contact");

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required: name, email, message" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }
    if (message.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: "Message must not be empty" },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        data: { id: contact.id, name: contact.name, email: contact.email },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
