"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Minimize2, Maximize2, Sparkles, RefreshCw } from "lucide-react";
import axios from "axios";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

const SUGGESTIONS = [
  "Best places to visit in Spiti Valley?",
  "Plan a 7-day Himachal trip",
  "Hotels near Manali under ₹3000?",
  "Best time to visit for snowfall?",
  "Paragliding in Bir Billing info",
];

// Fallback local KB in case backend is down
const LOCAL_KB: Record<string, string> = {
  spiti: "Spiti Valley is a cold desert at 3800m+. Top spots: Kaza, Key Monastery, Chandratal Lake, Kibber, Tabo, Langza, Hikkim. Best visited Jun–Oct. ❄️",
  manali: "Manali is HP's adventure capital! 🏔️ Solang Valley, Rohtang Pass, Atal Tunnel, Vashisht hot springs. Best time Mar–Jun & Oct–Nov.",
  shimla: "Shimla, the Queen of Hills! 👑 Mall Road, The Ridge, Jakhu Temple, Kufri, toy train from Kalka. Best time Mar–Jun & Sep–Nov.",
  dharamshala: "Dharamshala/McLeod Ganj — home of the Dalai Lama! 🙏 Triund Trek, Bhagsunag Waterfall, Kangra Fort. Best time Mar–Jun, Sep–Nov.",
  kasol: "Kasol — backpacker's paradise in Parvati Valley! 🌿 Cafes, river camping, Kheerganga trek, Manikaran Sahib hot springs. Best time Mar–May, Sep–Nov.",
  trek: "Top HP treks: Triund (easy, 9km), Kheerganga (moderate, 12km), Hampta Pass (moderate, 4270m), Bhrigu Lake (moderate, 4300m), Pin Parvati (difficult, 5319m). 🥾",
  snowfall: "Best time for snow: ❄️ Dec–Feb in Shimla/Kufri/Manali. Rohtang Pass Jan–Mar. Solang Valley Dec–Mar. Spiti stays snow-bound Oct–May.",
  paragliding: "Bir Billing — Asia's No.1 paragliding spot! 🪂 ₹2000–3500 for tandem. 14km glide from Billing (2400m) to Bir (1400m). Best: Mar–May, Sep–Nov.",
};

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.match(/\bhi\b|\bhello\b|\bnamaste\b|\bhey\b/)) return "Namaste! 🙏 I'm your Himachal Explorer AI. Ask me about destinations, hotels, treks, or anything HP travel-related!";
  if (q.includes("spiti") || q.includes("kaza")) return LOCAL_KB.spiti;
  if (q.includes("manali") || q.includes("solang")) return LOCAL_KB.manali;
  if (q.includes("shimla") || q.includes("kufri")) return LOCAL_KB.shimla;
  if (q.includes("dharamshala") || q.includes("mcleod")) return LOCAL_KB.dharamshala;
  if (q.includes("kasol") || q.includes("parvati")) return LOCAL_KB.kasol;
  if (q.includes("trek") || q.includes("hiking")) return LOCAL_KB.trek;
  if (q.includes("snow")) return LOCAL_KB.snowfall;
  if (q.includes("paraglid") || q.includes("bir billing")) return LOCAL_KB.paragliding;
  return "I'm your Himachal Pradesh travel guide! 🏔️ Ask me about destinations, hotels, trekking, best times to visit, or trip planning!";
}

function formatMessageTime(): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Namaste! 🙏 I'm your Himachal Explorer AI guide. Ask me about destinations, hotels, treks, itineraries, or anything about HP travel — or anything else you're curious about!",
      time: "Now",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const now = formatMessageTime();
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      text,
      time: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:7500/api/ai-chat",
        { message: text, sessionId },
        { timeout: 15000 }
      );
      const responseText = res.data?.response || getFallbackResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          text: responseText,
          time: formatMessageTime(),
        },
      ]);
    } catch {
      // Use local fallback if backend is unavailable
      await new Promise((r) => setTimeout(r, 600));
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          text: getFallbackResponse(text),
          time: formatMessageTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      text: "Chat cleared! 🗑️ How can I help you with your Himachal Pradesh trip?",
      time: formatMessageTime(),
    }]);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="aiAssistantBtn"
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
        animate={{ boxShadow: ["0 0 0 0 rgba(14,165,233,0.4)", "0 0 0 15px rgba(14,165,233,0)"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Sparkles className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-6 right-6 z-50 w-[360px] rounded-3xl shadow-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] ${
              isMinimized ? "h-16" : "h-[580px]"
            } transition-all duration-300 flex flex-col`}
            id="aiChatWindow"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">HP Travel AI</p>
                  <p className="text-sky-200 text-xs">Powered by Gemini • Ask anything</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {!isMinimized && (
                  <button
                    onClick={clearChat}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    title="Clear chat"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm"
                            : "bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                        <div className={`text-xs mt-1.5 ${msg.role === "user" ? "text-sky-200" : "text-gray-400"}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1.5 items-center h-4">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-sky-500 rounded-full"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, delay, repeat: Infinity }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 flex gap-2 flex-wrap">
                    {SUGGESTIONS.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 px-3 py-1.5 rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-[var(--border)] flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                      placeholder="Ask about travel, hotels, treks..."
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] placeholder-gray-400 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                      id="aiChatInput"
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isTyping}
                      className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                      id="aiSendBtn"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-center text-gray-400 mt-2">Powered by Google Gemini AI 🤖</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
