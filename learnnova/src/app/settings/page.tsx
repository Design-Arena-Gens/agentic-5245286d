"use client";

import { FormEvent, useState } from "react";

import { useAppData } from "@/context/AppDataContext";

export default function SettingsPage() {
  const { goals, updateGoals } = useAppData();
  const [studyGoal, setStudyGoal] = useState(goals.studyMinutes / 60);
  const [sleepGoal, setSleepGoal] = useState(goals.sleepMinutes / 60);
  const [habitGoal, setHabitGoal] = useState(goals.habitsPerDay);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateGoals({
      studyMinutes: Math.round(Math.max(1, studyGoal) * 60),
      sleepMinutes: Math.round(Math.max(1, sleepGoal) * 60),
      habitsPerDay: Math.round(Math.max(1, habitGoal)),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold text-[color:var(--accent)]">
          ध्येये आणि पसंती
        </h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          तुमच्या आवडीप्रमाणे अभ्यास, झोप आणि सवयींचे दररोजचे लक्ष्य ठरवा.
        </p>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[color:var(--muted)]">
                दररोज अभ्यास लक्ष्य (तास)
              </span>
              <input
                type="number"
                min="1"
                step="0.5"
                value={studyGoal}
                onChange={(event) => setStudyGoal(Number(event.target.value))}
                className="rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[color:var(--muted)]">
                दररोज झोप लक्ष्य (तास)
              </span>
              <input
                type="number"
                min="3"
                step="0.5"
                value={sleepGoal}
                onChange={(event) => setSleepGoal(Number(event.target.value))}
                className="rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[color:var(--muted)]">
                दररोज सवयींचे लक्ष्य (संख्या)
              </span>
              <input
                type="number"
                min="1"
                value={habitGoal}
                onChange={(event) => setHabitGoal(Number(event.target.value))}
                className="rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none"
              />
            </label>
          </div>
          <button type="submit" className="glass-button px-6 py-3">
            जतन करा
          </button>
        </form>
        {saved ? (
          <p className="mt-3 text-sm text-[color:var(--accent)]">
            ध्येये जतन केली गेली आहेत.
          </p>
        ) : null}
      </section>

      <section className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[color:var(--accent)]">
          उपयोगी सूचना
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
          <li>• सेटिंग्जमध्ये केलेले बदल लगेच सर्व स्क्रीनवर प्रतिबिंबित होतील.</li>
          <li>• Learnnova तुमचा डेटा तुमच्या डिव्हाइसवर सुरक्षित ठेवते (Local Storage).</li>
          <li>
            • नवीन लक्ष्य ठरवल्यानंतर AI सहाय्यकाला विचारून अभ्यास योजना पुन्हा
            तयार करून घ्या.
          </li>
        </ul>
      </section>
    </div>
  );
}

