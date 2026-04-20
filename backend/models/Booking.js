const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("bookings", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false, validate: { notEmpty: true } },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
  location: { type: DataTypes.STRING(255), allowNull: false },
  hotel_name: { type: DataTypes.STRING(255), allowNull: true },
  check_in: { type: DataTypes.DATEONLY, allowNull: false },
  check_out: { type: DataTypes.DATEONLY, allowNull: false },
  room_type: {
    type: DataTypes.STRING(50),
    defaultValue: "Standard Room",
  },
  total_price: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: "confirmed",
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "bookings",
  timestamps: false,
});

module.exports = Booking;
