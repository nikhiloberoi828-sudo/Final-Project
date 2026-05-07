const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const sequelize = require("./config/db");

// ─── Load Models ──────────────────────────────────────────────
require("./models/Booking");
require("./models/Contact");

// ─── Load Routes ──────────────────────────────────────────────
const bookingRoutes = require("./routes/bookingRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Himachal Explorer Backend API is active",
    endpoints: {
      health: "/api/health",
      bookings: "/api/bookings",
      contact: "/api/contact (POST)",
      destinations: "/api/destinations"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Himachal Explorer API is running",
    timestamp: new Date().toISOString()
  });
});

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/bookings", bookingRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/contact", contactRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on this server`,
    method: req.method
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Connect DB then Start Server ─────────────────────────────
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Supabase PostgreSQL connected");
    return sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📍 Health:    http://localhost:${PORT}/api/health`);
      console.log(`📋 Bookings:  http://localhost:${PORT}/api/bookings`);
      console.log(`📨 Contact:   http://localhost:${PORT}/api/contact`);

      // Keep-alive cron job (every 10 minutes)
      const RENDER_URL = process.env.RENDER_EXTERNAL_URL || "http://localhost:8080";
      const pingUrl = process.env.NODE_ENV === "production"
        ? `${RENDER_URL}/api/health`
        : `http://localhost:${PORT}/api/health`;

      setInterval(() => {
        axios
          .get(pingUrl)
          .then(() => console.log("💓 Keep-alive ping successful"))
          .catch((err) =>
            console.error("💔 Keep-alive ping failed:", err.message)
          );
      }, 10 * 60 * 1000);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  });