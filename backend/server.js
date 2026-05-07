const path = require("path");
// Load environment variables at the VERY top
require("dotenv").config({ path: path.join(__dirname, ".env") });

const next = require("next");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const sequelize = require("./config/db");

// ─── Next.js Configuration ────────────────────────────────────

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "../") });
const handle = nextApp.getRequestHandler();

// ─── Load Models ──────────────────────────────────────────────
require("./models/Booking");
require("./models/Contact");

// ─── Load Routes ──────────────────────────────────────────────
const bookingRoutes = require("./routes/bookingRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Initialize Next.js then Start Express
nextApp.prepare().then(() => {
  const app = express();
  const PORT = process.env.PORT || 8080;

  // ─── Middleware ───────────────────────────────────────────────
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ─── API Routes ───────────────────────────────────────────────
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/destinations", destinationRoutes);
  app.use("/api/contact", contactRoutes);

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      message: "Himachal Explorer API is running",
      timestamp: new Date().toISOString()
    });
  });

  // ─── Next.js Page Handler ─────────────────────────────────────
  // This serves the full website home page and other pages
  app.all("*", (req, res) => {
    return handle(req, res);
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
        console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
        console.log(`📋 API Bookings: http://localhost:${PORT}/api/bookings`);
        console.log(`📋 API Contact: http://localhost:${PORT}/api/contact`);

        // Keep-alive cron job (every 10 minutes)
        const RENDER_URL = process.env.RENDER_EXTERNAL_URL || "https://final-project-em3w.onrender.com";
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
});