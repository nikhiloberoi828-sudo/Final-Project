"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Minimize2, Maximize2 } from "lucide-react";

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

const KB: Record<string, string> = {
  spiti: "Spiti Valley is a cold desert at 3800m+. Top spots: Kaza (base), Key Monastery, Chandratal Lake (4300m), Kibber village, Tabo (1000-year monastery), Langza (fossil village), Hikkim (world's highest PO). Best visited Jun–Oct. Reach via Manali (200km) or Shimla via Kinnaur (460km).",
  manali: "Manali is the adventure capital of HP! Top spots: Old Manali, Hadimba Temple, Solang Valley (skiing/paragliding), Rohtang Pass (3978m, permit needed), Atal Tunnel, Vashisht hot springs. Best hotels: The Himalayan, Span Resort & Spa. Best time Mar–Jun & Oct–Nov.",
  shimla: "Shimla, Queen of Hills! Must-visit: Mall Road, The Ridge, Jakhu Temple (2455m), Kufri (snow), Narkanda (ski). Stay at Wildflower Hall or Oberoi Cecil. Take the famous Toy Train from Kalka. Best time Mar–Jun & Sep–Nov.",
  dharamshala: "Dharamshala/McLeod Ganj — home of the Dalai Lama. Do: Triund Trek (9km, 2827m), Bhagsunag Waterfall, Kangra Fort, Namgyal Monastery. Best hotels: Hyatt Regency Dharamshala. Best time Mar–Jun, Sep–Nov. Airport at Gaggal (13km).",
  kasol: "Kasol in Parvati Valley is the backpacker's paradise. Israeli cafes, river camping, base for Kheerganga trek (12km, 2950m). Nearby: Manikaran Sahib (hot springs), Tosh village, Malana. Best time Mar–May, Sep–Nov.",
  budget: "Budget tips: ₹1000–2000/night for guesthouses in Kasol/Spiti. Eat at dhabas (₹80–200/meal). HRTC buses are cheapest. Volvo buses from Delhi to Manali ₹600–1200. Kaza homestays from ₹800.",
  itinerary7: "7-day Himachal itinerary:\nDay 1: Arrive Manali, Old Manali\nDay 2: Solang Valley, Rohtang (permit)\nDay 3: Drive to Kaza via Atal Tunnel\nDay 4: Key Monastery, Kibber, Komic\nDay 5: Chandratal Lake\nDay 6: Langza, Hikkim, Tabo\nDay 7: Return to Manali",
  snowfall: "Best time for snow: Dec–Feb in Shimla/Kufri/Manali. Rohtang Pass Jan–Mar (permit). Solang Valley Dec–Mar. Spiti stays snow-bound Oct–May — roads open Jun.",
  paragliding: "Bir Billing — Asia's No.1 paragliding spot! ₹2000–3500 for tandem flight. 14km glide from Billing (2400m) to Bir landing (1400m). World Cup was held here in 2015. Best: Mar–May, Sep–Nov. Also Solang Valley & Dharamshala for shorter flights.",
  kinnaur: "Kinnaur — apple orchards & ancient culture! Highlights: Kalpa (views of Kinner Kailash 6050m), Sangla Valley, Chitkul (last village near Tibet border, 3450m), Nako Lake. Take NH22 Hindustan-Tibet Highway from Shimla (260km). Best Apr–Oct.",
  trek: "Top Himachal treks:\n• Triund: Easy, 9km, near McLeod Ganj\n• Kheerganga: Moderate, 12km, hot spring at top\n• Hampta Pass: Moderate, 4270m crossover\n• Bhrigu Lake: Moderate, 4300m, near Manali\n• Indrahar Pass: Difficult, 4342m, Dhauladhar\n• Pin Parvati: Difficult, 5319m",
  default: "I'm your Himachal Pradesh travel AI! 🏔️ I can help with:\n• Destination info (Manali, Shimla, Spiti, Dharamshala...)\n• Hotel recommendations\n• Trekking routes & adventure sports\n• Travel itineraries\n• Budget travel tips\n• Seasonal travel advice\n\nWhat would you like to know?",
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("spiti") || q.includes("kaza") || q.includes("key monastery")) return KB.spiti;
  if (q.includes("manali") || q.includes("solang") || q.includes("rohtang")) return KB.manali;
  if (q.includes("shimla") || q.includes("kufri") || q.includes("mall road")) return KB.shimla;
  if (q.includes("dharamshala") || q.includes("mcleod") || q.includes("triund")) return KB.dharamshala;
  if (q.includes("kasol") || q.includes("parvati") || q.includes("kheerganga")) return KB.kasol;
  if (q.includes("budget") || q.includes("cheap") || q.includes("cost")) return KB.budget;
  if (q.includes("7 day") || q.includes("7-day") || q.includes("week")) return KB.itinerary7;
  if (q.includes("snow") || q.includes("snowfall") || q.includes("winter")) return KB.snowfall;
  if (q.includes("paraglid") || q.includes("bir billing") || q.includes("flying")) return KB.paragliding;
  if (q.includes("kinnaur") || q.includes("kalpa") || q.includes("chitkul") || q.includes("sangla")) return KB.kinnaur;
  if (q.includes("trek") || q.includes("hiking") || q.includes("trail")) return KB.trek;
  if (q.includes("hotel") || q.includes("stay") || q.includes("accommodation")) {
    return "Top Himachal hotels:\n🌟 Luxury: Wildflower Hall Shimla (₹18K+), Hyatt Regency Dharamshala (₹15K+), Span Resort Manali (₹12K+)\n✨ Mid-range: Radisson Shimla (₹5-8K), Fortune Park Moksha Dharamshala (₹6K)\n💰 Budget: Zostel Spiti (₹800-1500), local guesthouses in Kasol/Manali (₹800-2500)";
  }
  if (q.includes("best time") || q.includes("when to visit") || q.includes("season")) {
    return "Himachal travel seasons:\n☀️ Summer (Mar–Jun): Best overall! Pleasant weather across HP.\n🌧️ Monsoon (Jul–Sep): Avoid Spiti/Kinnaur roads. Good for Kasol/Dharamshala.\n🍂 Autumn (Oct–Nov): Perfect clear skies, snow begins.\n❄️ Winter (Dec–Feb): Snow at Shimla/Manali/Kufri. Spiti is cut off.";
  }
  return KB.default;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Namaste! 🙏 I'm your Himachal Explorer AI guide. Ask me about destinations, hotels, treks, itineraries, or anything about HP travel!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((res) => setTimeout(res, 800 + Math.random() * 700));
    const response = getAIResponse(text);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      text: response,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
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
        style={{
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          boxShadow: "0 0 0 0 rgba(14,165,233,0.4)",
        }}
        animate={{ boxShadow: ["0 0 0 0 rgba(14,165,233,0.4)", "0 0 0 15px rgba(14,165,233,0)"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white" />
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
              isMinimized ? "h-16" : "h-[550px]"
            } transition-all duration-300`}
            id="aiChatWindow"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">HP Travel AI</p>
                  <p className="text-sky-200 text-xs">Always available • Ask me anything</p>
                </div>
              </div>
              <div className="flex gap-1.5">
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[390px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm"
                            : "bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                        <div className={`text-xs mt-1 ${msg.role === "user" ? "text-sky-200" : "text-gray-400"}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1">
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

                {/* Suggestions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 flex gap-2 flex-wrap">
                    {SUGGESTIONS.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 px-3 py-1.5 rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-[var(--border)]">
                  <div className="flex gap-2">
                    <input
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
                      className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      id="aiSendBtn"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
