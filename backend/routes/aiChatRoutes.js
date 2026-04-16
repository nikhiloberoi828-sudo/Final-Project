const express = require("express");
const router = express.Router();
const { handleAiChat } = require("../controllers/aiChatController");

router.post("/", handleAiChat);

module.exports = router;
