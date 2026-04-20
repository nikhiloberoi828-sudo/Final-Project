const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required: name, email, message" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (message.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Message must not be empty" });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { id: contact.id, name: contact.name, email: contact.email },
    });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createContact };
