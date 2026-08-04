"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { PageHeader } from "@aeon/components/app/page-header";
import { Button } from "@aeon/components/ui/button";
import { Input } from "@aeon/components/ui/input";
import { Badge } from "@aeon/components/ui/badge";

const suggestions = [
  "Why did TC_6_1_1_4 fail?",
  "Explain TS 38.523 clause 6.1.1",
  "Show the Registration procedure",
  "Compare Release 17 vs Release 18",
  "Find similar failures in the last 30 days",
];

type Msg = { role: "user" | "assistant"; content: string };

export default function CopilotPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi Alex — I'm your Telecom Copilot. Ask me about failures, procedures, or 3GPP clauses." },
  ]);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      {
        role: "assistant",
        content:
          "The UE sent REGISTRATION REQUEST without setting the 5GS mobile identity IE to SUCI for the emergency registration type. Per TS 24.501 §5.5.1.2.2, emergency registration shall include a SUCI or a limited SUCI. Suggested fix: nas_mm.c:1284 — set mm_identity.type = SUCI when reg_type == EMERGENCY.",
      },
    ]);
    setInput("");
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col">
      <PageHeader
        title="AI Copilot"
        description="Grounded on your executions, logs, and 3GPP specifications."
        actions={<Badge variant="outline" className="gap-1 border-primary/40 text-primary"><Sparkles className="size-3" /> gemini-3-flash</Badge>}
      />

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto rounded-xl border border-border/70 bg-card p-6">
        {messages.map((m, i) => (
          <div key={i} className={"flex gap-3 " + (m.role === "user" ? "flex-row-reverse" : "")}>
            <div className={"grid size-8 shrink-0 place-items-center rounded-md " + (m.role === "user" ? "bg-secondary" : "bg-primary/15 text-primary")}>
              {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
            </div>
            <div className={"max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed " + (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/40 text-foreground")}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button key={s} onClick={() => send(s)} className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground">
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); send(input); }}
      >
        <Input aria-label="Ask the AI Telecom Copilot" placeholder="Ask about failures, clauses, procedures…" value={input} onChange={(e) => setInput(e.target.value)} />
        <Button type="submit" className="gap-2"><Send className="size-4" /> Send</Button>
      </form>
    </div>
  );
}
