"use client";

import { useMemo, useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { useAppData } from "@/context/AppDataContext";
import {
  formatHours,
  formatTimeLabel,
  getLastNDates,
  getTodayISO,
} from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function calculateSleepDuration(start: string, end: string) {
  if (!start || !end) return 0;
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  if (Number.isNaN(startTotal) || Number.isNaN(endTotal)) return 0;
  if (endTotal >= startTotal) {
    return endTotal - startTotal;
  }
  return 24 * 60 - startTotal + endTotal;
}

export default function SleepPage() {
  const { sleepEntries, recordSleep } = useAppData();
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepNotes, setSleepNotes] = useState("");

  const todayISO = getTodayISO();

  const lastSevenDays = useMemo(() => getLastNDates(7), []);

  const chartData = useMemo(() => {
    const values = lastSevenDays.map((date) => {
      const entry = sleepEntries.find((item) => item.date === date);
      return entry ? entry.durationMinutes / 60 : 0;
    });
    return {
      labels: lastSevenDays.map((date) => formatTimeLabel(date)),
      datasets: [
        {
          label: "झोप (तास)",
          data: values,
          borderColor: "#89c4ff",
          backgroundColor: "rgba(137, 196, 255, 0.25)",
          tension: 0.35,
          fill: true,
        },
      ],
    };
  }, [sleepEntries, lastSevenDays]);

  const todaySleep = useMemo(() => {
    const entry = sleepEntries.find((item) => item.date === todayISO);
    return entry ? entry.durationMinutes / 60 : 0;
  }, [sleepEntries, todayISO]);

  const averageSleep = useMemo(() => {
    if (sleepEntries.length === 0) return 0;
    const total = sleepEntries
      .slice(0, 7)
      .reduce((sum, item) => sum + item.durationMinutes, 0);
    return total / Math.min(7, sleepEntries.length) / 60;
  }, [sleepEntries]);

  const handleSaveSleep = () => {
    const minutes = calculateSleepDuration(bedtime, wakeTime);
    if (minutes <= 0) return;
    recordSleep(minutes, {
      bedtime,
      wakeTime,
      note: sleepNotes.trim() || undefined,
    });
    setSleepNotes("");
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-[color:var(--accent)]">
            झोप नोंदवा
          </h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            झोपायला जाण्याची वेळ आणि उठण्याची वेळ जोडा. Learnnova तुमचा झोप
            चक्र विश्लेषित करते.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[color:var(--muted)]">
                झोपायला जाण्याची वेळ
              </span>
              <input
                type="time"
                value={bedtime}
                onChange={(event) => setBedtime(event.target.value)}
                className="rounded-2xl border border-transparent bg-[rgba(255,255,255,0.06)] px-4 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[color:var(--muted)]">
                उठण्याची वेळ
              </span>
              <input
                type="time"
                value={wakeTime}
                onChange={(event) => setWakeTime(event.target.value)}
                className="rounded-2xl border border-transparent bg-[rgba(255,255,255,0.06)] px-4 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none"
              />
            </label>
          </div>
          <textarea
            placeholder="तुमच्या झोपेबद्दल टिपा (उदा. स्वप्ने, उठल्यावरची भावना)"
            value={sleepNotes}
            onChange={(event) => setSleepNotes(event.target.value)}
            className="mt-4 w-full rounded-2xl border border-transparent bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm focus:border-[color:var(--accent)] focus:outline-none"
            rows={3}
          />
          <button
            type="button"
            onClick={handleSaveSleep}
            className="mt-4 glass-button"
          >
            झोप जतन करा
          </button>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-[color:var(--accent)]">
            आजची झोप
          </h3>
          <p className="mt-2 text-3xl font-bold text-[color:var(--foreground)]">
            {formatHours(todaySleep)}
          </p>
          <p className="text-xs text-[color:var(--muted)]">
            सरासरी: {formatHours(Number.isNaN(averageSleep) ? 0 : averageSleep)}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
            <li>• झोपण्याआधी ३० मिनिटे स्क्रीन वापर कमी करा.</li>
            <li>• पाणी किंवा हलका पेय रात्री उशिरा टाळा.</li>
            <li>• दररोज एकाच वेळी उठण्याचा प्रयत्न करा.</li>
          </ul>
        </div>
      </section>

      <section className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[color:var(--accent)]">
          ७ दिवसांचा झोप चार्ट
        </h3>
        <div className="mt-4">
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const value =
                        typeof context.parsed.y === "number"
                          ? context.parsed.y
                          : 0;
                      return `${value.toFixed(1)} तास`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  grid: { color: "rgba(255,255,255,0.08)" },
                  ticks: { color: "#89c4ff" },
                  suggestedMin: 0,
                  suggestedMax: 10,
                },
                x: {
                  grid: { display: false },
                  ticks: { color: "#8ea2d1" },
                },
              },
            }}
          />
        </div>
      </section>

      <section className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[color:var(--accent)]">
          अलीकडील नोंदी
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sleepEntries.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">
              झोपेची नोंद करण्यास सुरुवात करा.
            </p>
          ) : (
            sleepEntries.slice(0, 6).map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-[color:var(--card-border)] bg-[rgba(255,255,255,0.05)] p-4"
              >
                <p className="text-sm font-semibold text-[color:var(--foreground)]">
                  {new Date(entry.date).toLocaleDateString("mr-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="text-xs text-[color:var(--muted)]">
                  {formatHours(entry.durationMinutes / 60)} झोप
                </p>
                {entry.bedtime && entry.wakeTime ? (
                  <p className="text-xs text-[color:var(--muted)]">
                    {entry.bedtime} → {entry.wakeTime}
                  </p>
                ) : null}
                {entry.note ? (
                  <p className="text-xs text-[color:var(--muted)]">
                    टीप: {entry.note}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
