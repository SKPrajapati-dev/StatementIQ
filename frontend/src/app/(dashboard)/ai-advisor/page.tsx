"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  User, 
  Loader2, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  RefreshCcw,
  Lightbulb
} from "lucide-react";
import { agentApi } from "@/lib/api";
import { QuestionAnswer } from "@/types";

interface Message {
  role: "user" | "ai";
  content: string | QuestionAnswer;
  timestamp: Date;
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! I'm your StatementIQ AI Advisor. I've analyzed your financial data and am ready to help you optimize your spending, savings, and investments. What would you like to know today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSuggestions = async () => {
    try {
      setIsFetchingSuggestions(true);
      const { questions } = await agentApi.questions();
      setSuggestions(questions);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const answer = await agentApi.answerQuestion(text);
      const aiMsg: Message = {
        role: "ai",
        content: answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: "ai",
        content: "I'm sorry, I encountered an error while processing your request. Please try again or ask a different question.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAiResponse = (content: string | QuestionAnswer) => {
    if (typeof content === "string") return content;

    return (
      <div>
        <p style={{ marginBottom: "12px" }}>{content.answer}</p>
        
        {content.keyPoints && content.keyPoints.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: "4px" }}>
              Key Observations
            </p>
            <ul style={{ paddingLeft: "16px", fontSize: "0.85rem" }}>
              {content.keyPoints.map((point, i) => (
                <li key={i} style={{ marginBottom: "2px" }}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {content.recommendation && (
          <div style={{ padding: "10px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-card)" }}>
            <p style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.8rem", color: "var(--accent-primary)", marginBottom: "4px" }}>
              <Sparkles size={14} /> Recommendation
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{content.recommendation}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      <div className="section-header">
        <div>
          <h1 className="page-title">AI Financial Advisor</h1>
          <p className="page-subtitle">Chat with our AI to get deep insights into your finances</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
           <span className="badge badge-blue"><Sparkles size={12} /> Powered by Copilot</span>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        background: "var(--bg-secondary)", 
        borderRadius: "var(--radius-lg)", 
        border: "1px solid var(--border-card)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        marginTop: "16px"
      }}>
        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ 
              display: "flex", 
              gap: "12px", 
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              flexDirection: msg.role === "user" ? "row-reverse" : "row"
            }}>
              <div style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "10px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexShrink: 0,
                background: msg.role === "user" ? "var(--accent-secondary)" : "var(--accent-primary)",
                color: "white"
              }}>
                {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div className={`chat-bubble ${msg.role}`}>
                  {renderAiResponse(msg.content)}
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: "flex", gap: "12px", alignSelf: "flex-start" }}>
              <div style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "10px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)"
              }}>
                <Loader2 size={18} className="spinner" color="var(--accent-primary)" />
              </div>
              <div className="chat-bubble ai" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                Analyzing your statement...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div style={{ padding: "12px 24px", borderTop: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
              <Lightbulb size={14} color="var(--accent-amber)" /> Suggested Questions
            </div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {suggestions.map((q, i) => (
                <button 
                  key={i} 
                  className="btn btn-secondary btn-sm" 
                  style={{ borderRadius: "99px", background: "var(--bg-card)", fontSize: "0.75rem" }}
                  onClick={() => handleSend(q)}
                >
                  {q}
                </button>
              ))}
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={fetchSuggestions}
                disabled={isFetchingSuggestions}
              >
                <RefreshCcw size={12} className={isFetchingSuggestions ? "spinner" : ""} />
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div style={{ padding: "20px 24px", background: "var(--bg-card)", borderTop: "1px solid var(--border-subtle)" }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            style={{ display: "flex", gap: "12px" }}
          >
            <input 
              className="input" 
              placeholder="Ask anything about your finances..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ padding: "0 20px" }}
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
