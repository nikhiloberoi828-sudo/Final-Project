const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_HISTORY_MESSAGES = 12;
const SESSION_TTL_MS = 1000 * 60 * 60 * 6;

const chatSessions = new Map();

const WEBSITE_CONTEXT = [
  "Website name: Himachal Explorer.",
  "Main pages: Home, Destinations, Accommodation, How to Reach, Nai Raahein, Gallery, About, Contact.",
  "User features: floating AI assistant, destination search, favorites saved in browser, accommodation browsing, booking request modal, contact form, destination exploration by district/category.",
  "Theme: sky-blue primary brand, travel discovery focused on Himachal Pradesh.",
].join("\n");

const SYSTEM_INSTRUCTION = `
You are Himachal Explorer AI, an advanced travel assistant, trip planner, local guide, and website helper.

Core behavior:
- Always prioritize practical, real-world usefulness.
- For travel questions, recommendations, prices, timings, weather, routes, hotel suggestions, local tips, events, or anything current, rely on grounded Google Search results before answering.
- Never invent places, prices, schedules, opening hours, routes, or hotel details.
- If fresh information cannot be verified, say that clearly and give the safest useful fallback.
- Keep answers clear, structured, concise, and easy to scan.
- Use a warm, helpful, human tone.

Trip planning mode:
- If the user asks for a trip plan or itinerary and key details are missing, ask only for the missing details:
  1. destination
  2. number of days (1 to 20)
  3. budget (low, mid, luxury)
  4. travel type (solo, couple, family, friends)
  5. interests (adventure, food, culture, nightlife, nature, shopping, relaxation)
- Once you have enough details, produce a complete itinerary with:
  - day-by-day structure
  - morning / afternoon / evening breakdown
  - realistic routes and travel flow
  - food recommendations
  - hotel or stay suggestions when useful
  - estimated daily cost
  - timing, safety, crowd, weather, and local tips
- Keep itineraries realistic and geographically sensible. Do not rush too many places into one day.

General Q&A mode:
- Answer directly and clearly.
- For local destination answers, include practical details like what to do, best time, approximate cost, timing, and common mistakes or tourist traps when relevant.
- If the user's plan is weak, suggest better alternatives.

Website help mode:
- If the user asks about this website or its features, answer using the known site context below and do not invent unsupported features.

Formatting:
- Prefer short sections and bullet points.
- If grounded sources are available, use them and make the response specific.
- Avoid robotic filler and vague statements.

Known website context:
${WEBSITE_CONTEXT}
`.trim();

function pruneExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of chatSessions.entries()) {
    if (now - session.updatedAt > SESSION_TTL_MS) {
      chatSessions.delete(sessionId);
    }
  }
}

function getSession(sessionId) {
  pruneExpiredSessions();

  if (!chatSessions.has(sessionId)) {
    chatSessions.set(sessionId, { history: [], updatedAt: Date.now() });
  }

  return chatSessions.get(sessionId);
}

function extractResponseText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const text = parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("")
    .trim();

  return text || "I couldn't generate a useful answer just now. Please try rephrasing your travel question.";
}

function extractGroundedSources(data) {
  const chunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const seen = new Set();
  const sources = [];

  for (const chunk of chunks) {
    const uri = chunk?.web?.uri;
    const title = chunk?.web?.title;
    if (!uri || seen.has(uri)) continue;
    seen.add(uri);
    sources.push({
      title: title || "Source",
      uri,
    });
  }

  return sources.slice(0, 5);
}

function formatSourcesSection(sources) {
  if (!sources.length) return "";

  const lines = sources.map((source) => `- ${source.title}: ${source.uri}`);
  return `\n\nSources:\n${lines.join("\n")}`;
}

function buildConversationContents(history, userMessage) {
  const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);
  return [
    ...trimmedHistory,
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];
}

function buildUserMessage(message) {
  const today = new Date().toISOString().split("T")[0];
  return `Today is ${today}.\n\nUser request:\n${message}`;
}

async function requestGemini(contents) {
  const response = await axios.post(
    GEMINI_API_URL,
    {
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents,
      tools: [
        {
          google_search: {},
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
        responseMimeType: "text/plain",
      },
    },
    {
      headers: {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  return response.data;
}

async function handleAiChat(req, res) {
  const { message, sessionId = "default-session" } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Gemini API key is missing on the server.",
    });
  }

  try {
    const session = getSession(sessionId);
    const userMessage = buildUserMessage(message.trim());
    const contents = buildConversationContents(session.history, userMessage);
    const data = await requestGemini(contents);

    const responseText = extractResponseText(data);
    const sources = extractGroundedSources(data);
    const formattedResponse = `${responseText}${formatSourcesSection(sources)}`;

    session.history = [
      ...session.history,
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
      {
        role: "model",
        parts: [{ text: responseText }],
      },
    ].slice(-MAX_HISTORY_MESSAGES);
    session.updatedAt = Date.now();

    return res.json({
      success: true,
      response: formattedResponse,
      grounded: sources.length > 0,
      sources,
    });
  } catch (error) {
    const apiMessage =
      error?.response?.data?.error?.message ||
      error?.message ||
      "AI request failed";

    console.error("AI chat error:", apiMessage);

    return res.status(500).json({
      success: false,
      message: "AI travel assistant is temporarily unavailable.",
      error: apiMessage,
    });
  }
}

module.exports = { handleAiChat };
