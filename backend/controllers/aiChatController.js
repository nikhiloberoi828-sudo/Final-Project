const handleAiChat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: "Message is required" });

  res.json({
    success: true,
    response: `Thank you for asking about "${message}". Our AI is processing your query. For instant answers, use the floating AI assistant on any page!`,
  });
};

module.exports = { handleAiChat };
