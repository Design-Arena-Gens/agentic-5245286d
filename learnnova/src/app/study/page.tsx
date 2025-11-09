"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { useAppData } from "@/context/AppDataContext";
import {
  formatMinutes,
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

const POMODORO_SECONDS = 25 * 60;

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${s}`;
}

export default function StudyPage() {
  const {
    studyEntries,
    recordStudy,
    youtubeLinks,
    addYoutubeLink,
    removeYoutubeLink,
  } = useAppData();

  const [hoursInput, setHoursInput] = useState("0");
  const [minutesInput, setMinutesInput] = useState("0");
  const [timerSeconds, setTimerSeconds] = useState(POMODORO_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const todayISO = getTodayISO();

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return POMODORO_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const weeklyData = useMemo(() => {
    const dates = getLastNDates(7);
    const values = dates.map((date) => {
      const entry = studyEntries.find((item) => item.date === date);
      return entry ? entry.minutes : 0;
    });
    return {
      labels: dates.map((date) => formatTimeLabel(date)),
      datasets: [
        {
          label: "अभ्यास (मिनिटे)",
          data: values,
          borderColor: "#d4af37",
          backgroundColor: "rgba(212, 175, 55, 0.25)",
          tension: 0.35,
        },
      ],
    };
  }, [studyEntries]);

  const todayStudyMinutes = useMemo(() => {
    return studyEntries.find((item) => item.date === todayISO)?.minutes ?? 0;
  }, [studyEntries, todayISO]);

  const handleSaveTime = () => {
    const hours = Number.parseInt(hoursInput, 10) || 0;
    const minutes = Number.parseInt(minutesInput, 10) || 0;
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes <= 0) return;
    recordStudy(totalMinutes);
    setHoursInput("0");
    setMinutesInput("0");
  };

  const handleTimerToggle = () => {
    setTimerRunning((prev) => !prev);
  };

  const handleTimerReset = () => {
    setTimerRunning(false);
    setTimerSeconds(POMODORO_SECONDS);
  };

  const handleAddYoutube = () => {
    addYoutubeLink(youtubeTitle, youtubeUrl);
    setYoutubeTitle("");
    setYoutubeUrl("");
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-[color:var(--accent)]">
            आजचा अभ्यास वेळ नोंदवा
          </h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            आज तुम्ही किती वेळ अभ्यास केला ते जोडा. Learnnova तुमची सात दिवसांची
            प्रगती दाखवेल.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[color:var(--muted)]">तास</span>
              <input
                type="number"
                min="0"
                value={hoursInput}
                onChange={(event) => setHoursInput(event.target.value)}
                className="rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-2 text-[color:var(--foreground)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-[color:var(--muted)]">मिनिटे</span>
              <input
                type="number"
                min="0"
                max="59"
                value={minutesInput}
                onChange={(event) => setMinutesInput(event.target.value)}
                className="rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-2 text-[color:var(--foreground)] focus:border-[color:var(--accent)] focus:outline-none"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSaveTime}
                className="glass-button w-full"
              >
                वेळ जतन करा
              </button>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-[color:var(--card-border)] bg-[rgba(255,255,255,0.03)] p-4">
            <p className="text-sm text-[color:var(--muted)]">आजपर्यंत</p>
            <p className="text-2xl font-semibold text-[color:var(--accent)]">
              {formatMinutes(todayStudyMinutes)}
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-[color:var(--accent)]">
            फोकस टाइमर (Pomodoro)
          </h3>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            २५ मिनिटांचे लक्ष केंद्रीत सत्र पूर्ण करा.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[color:var(--accent)] bg-[rgba(255,255,255,0.05)] text-3xl font-semibold">
              {formatTimer(timerSeconds)}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleTimerToggle}
                className="glass-button px-6"
              >
                {timerRunning ? "थांबवा" : "सुरू करा"}
              </button>
              <button
                type="button"
                onClick={handleTimerReset}
                className="glass-button px-6"
              >
                रीसेट
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[color:var(--accent)]">
          ७ दिवसांची अभ्यास प्रगती
        </h3>
        <div className="mt-4">
          <Line
            data={weeklyData}
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
                      return `${value} मिनिटे`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  grid: { color: "rgba(255,255,255,0.08)" },
                  ticks: { color: "#d4af37" },
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--accent)]">
              YouTube व्याख्यान दुवे
            </h3>
            <p className="text-xs text-[color:var(--muted)]">
              प्रभावी पुनरावलोकनासाठी उपयुक्त दुवे जोडून ठेवा.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="शीर्षक"
              value={youtubeTitle}
              onChange={(event) => setYoutubeTitle(event.target.value)}
              className="w-full rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none"
            />
            <input
              type="url"
              placeholder="YouTube दुवा"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              className="w-full rounded-2xl border border-transparent bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm focus:border-[color:var(--accent)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddYoutube}
              className="glass-button whitespace-nowrap"
            >
              जोडा
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {youtubeLinks.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">
              अद्याप कोणतेही दुवे जतन केलेले नाहीत.
            </p>
          ) : (
            youtubeLinks.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-[color:var(--card-border)] bg-[rgba(255,255,255,0.04)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    {item.title}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[color:var(--accent)] underline"
                  >
                    {item.url}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => removeYoutubeLink(item.id)}
                  className="glass-button px-4 py-2 text-sm"
                >
                  हटवा
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
