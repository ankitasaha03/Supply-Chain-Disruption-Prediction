"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSupplyChain } from "@/context/SupplyChainContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Zap,
  CheckCircle2,
  CornerDownLeft,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAssistantDrawer() {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendMessage,
    executeActionFromChat,
    healthScore,
    financialCostTotal,
  } = useSupplyChain();

  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal.trim());
    setInputVal("");
  };

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Synapse AI Ops Copilot</h3>
              <Badge variant="cyber" className="text-[9px] py-0 px-1">
                GPT-SCM v4
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous Supply Chain Reasoning &amp; Decision Support
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Mini Telemetry Ticker */}
      <div className="px-4 py-1.5 bg-blue-950/30 border-b border-blue-900/40 text-[11px] text-blue-300 flex items-center justify-between font-mono">
        <span>HEALTH INDEX: {healthScore}/100</span>
        <span>AT-RISK EXPOSURE: ${(financialCostTotal / 1000000).toFixed(2)}M</span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={cn("flex flex-col space-y-1.5", isUser ? "items-end" : "items-start")}
            >
              {/* Message Bubble */}
              <div
                className={cn(
                  "rounded-2xl p-3.5 max-w-[90%] shadow-md leading-relaxed whitespace-pre-line",
                  isUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none"
                )}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-1.5">
                    <Sparkles className="h-3 w-3" />
                    AI Intelligence Assessment
                  </div>
                )}
                <div>{msg.text}</div>

                {/* Interactive Action Button Inside Chat Response */}
                {msg.actionPrompt && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    {msg.actionPrompt.executed ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{msg.actionPrompt.feedback || "Action Dispatched to Carrier Telemetry"}</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="cyber"
                        onClick={() =>
                          executeActionFromChat(msg.actionPrompt!.actionId, msg.actionPrompt!.incidentId)
                        }
                        className="w-full text-xs font-semibold h-8"
                      >
                        <Zap className="h-3.5 w-3.5 mr-1 text-amber-300" />
                        {msg.actionPrompt.label}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-500 px-1">{msg.timestamp}</span>

              {/* Suggestions chips if assistant */}
              {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                  {msg.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(sug)}
                      className="rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 text-[11px] font-medium transition-all text-left flex items-center gap-1 hover:border-blue-500/40 cursor-pointer"
                    >
                      <ArrowRight className="h-2.5 w-2.5 text-blue-400 shrink-0" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <form onSubmit={handleSend} className="relative flex items-center">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask AI Copilot: 'Reroute port', 'Assess TSMC delay'..."
            className="pr-12 text-xs bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 h-10 rounded-xl"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputVal.trim()}
            className="absolute right-1.5 h-7 w-7 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 mt-2">
          <span>Natural Language SCM Disruption Engine</span>
          <span>Press Enter ↵</span>
        </div>
      </div>
    </div>
  );
}
