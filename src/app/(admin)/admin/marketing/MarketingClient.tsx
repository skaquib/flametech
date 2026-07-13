"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Copy, Check, AlertTriangle, Send, Bot, User, Plus, Trash2, MessageSquare, PanelLeftOpen, PanelLeftClose, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  shortDesc: string | null;
  price: number | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatSessionSummary {
  id: string;
  title: string | null;
  updatedAt: string;
  messageCount: number;
}

const SUGGESTIONS = [
  "Who needs a follow-up today?",
  "List all leads overdue by 30+ days",
  "Draft a WhatsApp broadcast for our AMC service",
  "Write a LinkedIn caption announcing our spare parts catalog",
];

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function MarketingClient({ products }: { products: Product[] }) {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshSessions = async () => {
    try {
      const res = await fetch("/api/admin/marketing/sessions");
      const data = await res.json();
      if (res.ok) setSessions(data.sessions);
    } catch {
      // Sidebar history is a convenience list — a failed refresh shouldn't block chatting.
    }
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleNewChat = () => {
    if (loading) return; // don't switch away while a response is still in flight
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
  };

  const handleSelectSession = async (id: string) => {
    if (loading || loadingSession) return; // avoid a response landing in the wrong session
    if (id === activeSessionId) return;
    setLoadingSession(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/marketing/sessions/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load that chat.");
      } else {
        setActiveSessionId(id);
        setMessages(data.messages);
      }
    } catch {
      setError("Connection error loading that chat.");
    } finally {
      setLoadingSession(false);
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading && id === activeSessionId) return; // don't clear the panel mid-response
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (id === activeSessionId) handleNewChat();
    await fetch(`/api/admin/marketing/sessions/${id}`, { method: "DELETE" }).catch(() => {});
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/marketing/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId, message: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not get a response.");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
        if (!activeSessionId) setActiveSessionId(data.sessionId);
        refreshSessions();
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      setError("Couldn't copy to clipboard — your browser may be blocking clipboard access.");
    }
  };

  const quickSuggestions =
    products.length > 0
      ? [...SUGGESTIONS, `Write a product description for ${products[0].name}`]
      : SUGGESTIONS;

  return (
    <div className="relative flex gap-4 h-[70vh] max-h-[720px] min-w-0">
      {/* Mobile-only backdrop, shown while the drawer is open below `lg` */}
      {sessionsOpen && (
        <div
          onClick={() => setSessionsOpen(false)}
          className="absolute inset-0 bg-black/50 z-20 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Session sidebar — off-canvas drawer below `lg`, static collapsible panel at `lg`+ */}
      <div
        className={`shrink-0 w-64 bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 rounded-xl flex flex-col overflow-hidden absolute inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          sessionsOpen
            ? "translate-x-0 lg:w-64 lg:opacity-100"
            : "-translate-x-full lg:w-0 lg:border-0 lg:opacity-0 lg:pointer-events-none"
        }`}
      >
        <div className="p-3 border-b border-slate-200 dark:border-brand-slate/40 space-y-2">
          <div className="flex items-center justify-between lg:hidden">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chat History</span>
            <button
              onClick={() => setSessionsOpen(false)}
              type="button"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close chat history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleNewChat}
            disabled={loading}
            title={loading ? "Wait for the current response to finish" : undefined}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 && (
            <p className="text-slate-400 text-[11px] text-center py-4 px-2">No past chats yet — start one above.</p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              role="button"
              aria-disabled={loading || loadingSession}
              tabIndex={loading || loadingSession ? -1 : 0}
              onClick={() => handleSelectSession(s.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSelectSession(s.id);
              }}
              className={`w-full text-left px-2.5 py-2 rounded-lg group flex items-start gap-2 transition-colors ${
                loading || loadingSession ? "opacity-50 cursor-wait pointer-events-none" : "cursor-pointer"
              } ${
                s.id === activeSessionId
                  ? "bg-brand-orange/10 border border-brand-orange/30"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {s.title || "New chat"}
                </p>
                <p className="text-[10px] text-slate-400">{timeAgo(s.updatedAt)}</p>
              </div>
              <button
                onClick={(e) => handleDeleteSession(s.id, e)}
                disabled={loading || loadingSession}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity shrink-0"
                title="Delete chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 min-w-0 bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 rounded-xl flex flex-col overflow-hidden">
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-brand-slate/40">
          <button
            onClick={() => setSessionsOpen((v) => !v)}
            type="button"
            className="p-1.5 rounded-md text-slate-400 hover:text-brand-orange hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
            title={sessionsOpen ? "Collapse chat history" : "Open chat history"}
            aria-label={sessionsOpen ? "Collapse chat history" : "Open chat history"}
          >
            {sessionsOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chat History</span>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loadingSession && (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">Loading chat...</div>
          )}

          {!loadingSession && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center">
                <Bot className="w-6 h-6 text-brand-orange" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-900 dark:text-white font-bold text-sm">Ask about leads or draft marketing copy</p>
                <p className="text-slate-500 text-xs max-w-sm">
                  Grounded in your real quote-request leads and product catalog — never invents contacts. Drafts are for you to review and send manually.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2 max-w-lg">
                {quickSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-brand-dark/40 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold rounded-full hover:border-brand-orange/50 hover:text-brand-orange transition-colors disabled:opacity-50 disabled:cursor-wait disabled:hover:border-slate-300 dark:disabled:hover:border-slate-800 disabled:hover:text-slate-600 dark:disabled:hover:text-slate-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loadingSession &&
            messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-brand-orange" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-orange text-white rounded-tr-sm"
                      : "bg-slate-50 dark:bg-[#060b13] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {m.content}
                  {m.role === "assistant" && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleCopy(m.content, i)}
                        className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 hover:text-brand-orange transition-colors"
                      >
                        {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === i ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                )}
              </div>
            ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-brand-orange" />
              </div>
              <div className="bg-slate-50 dark:bg-[#060b13] border border-slate-200 dark:border-slate-800 rounded-xl rounded-tl-sm px-4 py-2.5 text-xs text-slate-500 italic">
                Thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-lg p-3 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-slate-200 dark:border-brand-slate/40 p-4 flex items-end gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a lead, or request marketing copy... (Enter to send)"
            className="flex-1 bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-orange resize-none max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="shrink-0 h-10 w-10 flex items-center justify-center bg-brand-orange hover:bg-brand-orange/90 text-white rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
