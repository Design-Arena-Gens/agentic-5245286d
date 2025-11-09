"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  buildStyles,
  CircularProgressbar,
} from "react-circular-progressbar";

import { useAppData } from "@/context/AppDataContext";
import {
  clampPercentage,
  formatMinutes,
  getTodayISO,
} from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

export default function DashboardPage() {
  const { studyEntries, sleepEntries, habits, goals, youtubeLinks } =
    useAppData();
  const today = getTodayISO();

  const { studyToday, sleepTodayMinutes, habitsToday } = useMemo(() => {
    const study = studyEntries.find((entry) => entry.date === today)?.minutes ?? 0;
    const sleep =
      sleepEntries.find((entry) => entry.date === today)?.durationMinutes ?? 0;
    const habitsCompleted = habits.filter((habit) =>
      habit.completedDates.includes(today)
    ).length;

    return {
      studyToday: study,
      sleepTodayMinutes: sleep,
      habitsToday: habitsCompleted,
    };
  }, [habits, sleepEntries, studyEntries, today]);

  const stats = [
    {
      key: "study",
      label: "अभ्यास",
      value: studyToday,
      goal: goals.studyMinutes,
      suffix: "मिनिटे",
      gradient: ["#d4af37", "#f9e79f"],
    },
    {
      key: "sleep",
      label: "झोप",
      value: sleepTodayMinutes,
      goal: goals.sleepMinutes,
      suffix: "मिनिटे",
      gradient: ["#89c4ff", "#d4af37"],
    },
    {
      key: "habits",
      label: "सवयी",
      value: habitsToday,
      goal: Math.max(1, goals.habitsPerDay),
      suffix: "पूर्ण",
      gradient: ["#9d8eff", "#f7d26a"],
    },
  ];

  const quickLinks = [
    { href: "/study", label: "अभ्यास", description: "वेळ नोंद व लक्ष" },
    { href: "/sleep", label: "झोप", description: "उत्तम झोप नोंद" },
    { href: "/habits", label: "सवयी", description: "रोजची प्रेरणा" },
    { href: "/chat", label: "AI संवाद", description: "तत्काळ मदत" },
    { href: "/settings", label: "सेटिंग्ज", description: "ध्येय निश्चित करा" },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const percentage =
            stat.goal > 0 ? (stat.value / stat.goal) * 100 : stat.value;
          return (
            <div key={stat.key} className="glass-card p-6 text-center">
              <h2 className="text-lg font-semibold text-[color:var(--muted)]">
                {stat.label}
              </h2>
              <div className="mx-auto my-4 h-36 w-36">
                <CircularProgressbar
                  value={clampPercentage(percentage)}
                  text={`${clampPercentage(percentage)}%`}
                  styles={buildStyles({
                    pathColor: stat.gradient[0],
                    trailColor: "rgba(255,255,255,0.08)",
                    textColor: "#fef8d4",
                    textSize: "16px",
                    pathTransitionDuration: 0.4,
                  })}
                />
              </div>
              <p className="text-sm">
                <span className="text-xl font-semibold text-[color:var(--accent)]">
                  {stat.key === "habits" ? stat.value : formatMinutes(stat.value)}
                </span>
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                आजचे ध्येय: {stat.goal} {stat.suffix}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-[color:var(--accent)]">
            आजची प्रेरणा
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
            सातत्य आणि संतुलन या दोन गोष्टी अभ्यासाच्या प्रवासाला चमक देतात.
            Learnnova तुमचा प्रत्येक पाऊल साठवून बुद्धिमान मार्ग दाखवते.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="glass-button">
                <span className="font-semibold">{item.label}</span>
                <span className="text-xs text-[color:var(--muted)]">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-[color:var(--accent)]">
            अलीकडील व्याख्यान दुवे
          </h3>
          <div className="mt-4 space-y-3">
            {youtubeLinks.length === 0 ? (
              <p className="text-sm text-[color:var(--muted)]">
                अद्याप कोणतेही YouTube दुवे जोडलेले नाहीत. अभ्यास व्यवस्थापकातून
                तुमचे आवडते व्याख्यान जतन करा.
              </p>
            ) : (
              youtubeLinks.slice(0, 4).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-transparent bg-[color:var(--card)]/60 px-4 py-3 transition hover:border-[color:var(--accent)]/40"
                >
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[color:var(--muted)]">
                    {new Date(item.addedAt).toLocaleString("mr-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[color:var(--accent)]">
          Learnnova AI टिप
        </h3>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          दररोज शिक्षण, झोप आणि सवयींची तपशीलवार नोंद ठेवा. त्यानुसार AI
          सहाय्यक अधिक अचूक सुचना देईल आणि तुमच्या अभ्यास पॅटर्नवर आधारित
          वैयक्तिक मार्गदर्शन उपलब्ध होईल.
        </p>
      </section>
    </div>
  );
}

