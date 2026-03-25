"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tekroxgpt_conversation");
      if (saved) setMessages(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("tekroxgpt_conversation", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error();

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: "assistant", content: full }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "something went wrong. try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center relative">

      {/* Wallpaper background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundImage: "url('/images/wallpaper.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-blue-950/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Header */}
      <div className="w-full max-w-2xl border-b border-white/10 px-4 py-3 flex items-center gap-3 bg-black/20 backdrop-blur-sm">
        <Image
          src="/images/profile-pic.jpg"
          alt="Tekrox"
          width={32}
          height={32}
          className="rounded-full flex-shrink-0 object-cover"
        />
        <div className="flex-1">
          <h1 className="text-white font-semibold text-sm">
            Tekrox<span className="text-blue-300">GPT</span>
          </h1>
          <p className="text-white/40 text-xs">ETHCC · Cannes 2025</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("tekroxgpt_conversation");
            }}
            className="text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto w-full max-w-2xl px-4 py-6 flex flex-col">
        {/* Spacer pushes messages to bottom; shrinks to 0 once chat fills up */}
        <div className="flex-1" />
        <div className="flex flex-col space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <Image
              src="/images/profile-pic.jpg"
              alt="Tekrox"
              width={88}
              height={88}
              className="w-22 h-22 rounded-full mx-auto mb-5 object-cover ring-2 ring-white/20"
            />
            <h2 className="text-white text-2xl font-semibold mb-2">Tekrox.eth</h2>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-10">ETHCC · Cannes 2025</p>
            <button
              onClick={() => sendMessage("gm")}
              className="px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xl font-semibold transition-all shadow-lg shadow-blue-900/40"
            >
              gm 👋
            </button>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <Image
                  src="/images/profile-pic.jpg"
                  alt="Tekrox"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full flex-shrink-0 mr-2 mt-1 object-cover"
                />
              )}
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-base leading-relaxed break-words ${
                  msg.role === "user"
                    ? "bg-blue-600/90 backdrop-blur-sm text-white rounded-br-sm"
                    : "bg-black/40 backdrop-blur-sm border border-white/10 text-white/90 rounded-bl-sm"
                }`}
              >
                {msg.content ? (
                  msg.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline hover:text-blue-200">{children}</a>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        h1: ({ children }) => <h1 className="text-white font-bold text-base mb-1">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-white font-semibold mb-1">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-white/90 font-semibold mb-1">{children}</h3>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )
                ) : (
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="w-full max-w-2xl border-t border-white/10 px-4 py-4 bg-black/20 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me something..."
            disabled={loading}
            className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:border-blue-400/50 disabled:opacity-50 backdrop-blur-sm"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
