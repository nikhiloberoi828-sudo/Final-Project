require("dotenv").config({ path: "./backend/.env" });

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

require("./models/Booking");

const bookingRoutes = require("./routes/bookingRoutes");
const aiChatRoutes = require("./routes/aiChatRoutes");
const destinationRoutes = require("./routes/destinationRoutes");

const app = express();
const PORT = process.env.PORT || 7500;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running", timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/bookings", bookingRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/ai-chat", aiChatRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Connect DB then Start Server ─────────────────────────────
sequelize
  .authenticate()
  .then(function () {
    console.log("✅ PostgreSQL connected");
    return sequelize.sync({ force: false });
  })
  .then(function () {
    app.listen(PORT, function () {
      console.log("🚀 Server running at http://localhost:" + PORT);
      console.log("📍 Health check: http://localhost:" + PORT + "/api/health");
      console.log("📋 Bookings: http://localhost:" + PORT + "/api/bookings");
    });
  })
  .catch(function (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  });