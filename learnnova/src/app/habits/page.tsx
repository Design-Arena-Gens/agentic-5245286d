"use client";

import { useMemo, useState } from "react";

import { useAppData } from "@/context/AppDataContext";
import { getLastNDates, getTodayISO } from "@/lib/utils";

function calculateStreak(dates: string[]) {
  const today = new Date(getTodayISO());
  let streak = 0;
  while (true) {
    const dateISO = today.toISOString().slice(0, 10);
    if (!dates.includes(dateISO)) break;
    streak += 1;
    today.setDate(today.getDate() - 1);
  }
  return streak;
}

export default function HabitsPage() {
  const { habits, addHabit, removeHabit, toggleHabitCompletion } = useAppData();
  const [habitName, setHabitName] = useState("");

  const weekDates = useMemo(() => getLastNDates(7), []);

  const handleAddHabit = () => {
    addHabit(habitName);
    setHabitName("");
  };

  return (
    <div className="space-y-8">
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold text-[color:var(--accent)]">
          नवीन सवय जोडा
        </h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          तुमच्या अभ्यासाला आधार देणाऱ्या सवयी जतन करा. दररोज पूर्ण झालेल्या
          सवयींचे ट्रॅकिंग करा.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="उदा. ३० मिनिटे वाचन"
            value={habitName}
            onChange={(event) => setHabitName(event.target.value)}
            className="w-full rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm focus:border-[color:var(--accent)] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddHabit}
            className="glass-button whitespace-nowrap"
          >
            सवय जोडा
          </button>
        </div>
      </section>

      <section className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[color:var(--accent)]">
          आठवड्याचे कॅलेंडर
        </h3>
        <div className="mt-5 space-y-6">
          {habits.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">
              अजून कोणतीही सवय जोडलेली नाही. वरून सवय जोडा.
            </p>
          ) : (
            habits.map((habit) => {
              const streak = calculateStreak(habit.completedDates);
              return (
                <div
                  key={habit.id}
                  className="rounded-2xl border border-[color:var(--card-border)] bg-[rgba(255,255,255,0.04)] p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">
                        {habit.name}
                      </p>
                      <p className="text-xs text-[color:var(--muted)]">
                        सलग {streak} दिवस पूर्ण
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHabit(habit.id)}
                      className="glass-button px-4 py-2 text-sm"
                    >
                      हटवा
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-7 gap-2">
                    {weekDates.map((date) => {
                      const isDone = habit.completedDates.includes(date);
                      const dayLabel = new Date(date).toLocaleDateString(
                        "mr-IN",
                        {
                          weekday: "short",
                        }
                      );
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => toggleHabitCompletion(habit.id, date)}
                          className={`flex flex-col items-center rounded-2xl border px-2 py-3 text-xs transition ${
                            isDone
                              ? "border-[color:var(--accent)] bg-[color:var(--accent)]/30"
                              : "border-transparent bg-[rgba(255,255,255,0.05)] hover:border-[color:var(--accent)]/40"
                          }`}
                        >
                          <span className="font-medium uppercase">
                            {dayLabel}
                          </span>
                          <span>{new Date(date).getDate()}</span>
                          <span className="mt-1 text-base">
                            {isDone ? "✅" : "⬜"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

