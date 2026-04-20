const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Contact = sequelize.define("contacts", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false, validate: { notEmpty: true } },
  email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
  message: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "contacts",
  timestamps: false,
});

module.exports = Contact;
