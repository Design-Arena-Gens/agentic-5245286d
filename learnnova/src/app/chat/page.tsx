"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SAMPLE_PROMPTS = [
  "आजच्या अभ्यासासाठी वेळापत्रक सुचवा",
  "उद्या परीक्षेसाठी जलद पुनरावलोकन टिप्स",
  "झोप उत्तम व्हावी यासाठी काय करावे?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "नमस्कार! मी Learnnova AI. तुमच्या अभ्यास आणि दिनचर्येबद्दल काहीही विचारा.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || loading) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };
    const nextMessages = [...messages, newMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await response.json()) as { content: string };
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            data.content || "माफ करा, सध्या उत्तर मिळू शकले नाही. पुन्हा प्रयत्न करा.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "माफ करा, काही तांत्रिक अडचण आली. थोड्या वेळाने पुन्हा प्रयत्न करा.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <section className="glass-card flex-1 overflow-hidden p-6">
        <h2 className="text-xl font-semibold text-[color:var(--accent)]">
          AI संवाद
        </h2>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          अभ्यास, वेळ व्यवस्थापन, झोप किंवा सवयींबद्दल मार्गदर्शन विचारू शकता.
        </p>
        <div className="mt-4 flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl bg-[rgba(255,255,255,0.04)] p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "self-end bg-[color:var(--accent)]/30 text-[color:var(--foreground)]"
                  : "self-start border border-[color:var(--card-border)] bg-[rgba(13,25,53,0.8)] text-[color:var(--foreground)]"
              }`}
            >
              {message.content}
            </div>
          ))}
          {loading ? (
            <div className="self-start rounded-2xl border border-[color:var(--card-border)] bg-[rgba(13,25,53,0.8)] px-4 py-3 text-sm text-[color:var(--muted)]">
              विचार सुरू आहे...
            </div>
          ) : null}
        </div>
      </section>

      <section className="glass-card p-6">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="text-xs text-[color:var(--muted)]">
            तुमचा प्रश्न किंवा विनंती
          </label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={3}
            className="rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm focus:border-[color:var(--accent)] focus:outline-none"
            placeholder="उदा. माझ्या अभ्यासासाठी कोणती प्राधान्यक्रम योजना ठेवू?"
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
              {SAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-transparent bg-[rgba(255,255,255,0.08)] px-3 py-1 hover:border-[color:var(--accent)]/40"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="glass-button px-8 py-3 disabled:opacity-60"
            >
              पाठवा
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

