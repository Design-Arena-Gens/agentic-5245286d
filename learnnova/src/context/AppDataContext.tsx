"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { v4 as uuid } from "uuid";

import { usePersistentState } from "@/hooks/usePersistentState";

export type StudyEntry = {
  id: string;
  date: string;
  minutes: number;
};

export type SleepEntry = {
  id: string;
  date: string;
  durationMinutes: number;
  bedtime?: string;
  wakeTime?: string;
  note?: string;
};

export type Habit = {
  id: string;
  name: string;
  completedDates: string[];
};

export type YoutubeLink = {
  id: string;
  title: string;
  url: string;
  addedAt: string;
};

export type Goals = {
  studyMinutes: number;
  sleepMinutes: number;
  habitsPerDay: number;
};

type AppDataContextValue = {
  hydrated: boolean;
  studyEntries: StudyEntry[];
  sleepEntries: SleepEntry[];
  habits: Habit[];
  youtubeLinks: YoutubeLink[];
  goals: Goals;
  recordStudy: (minutes: number, date?: string) => void;
  recordSleep: (
    durationMinutes: number,
    data?: {
      date?: string;
      bedtime?: string;
      wakeTime?: string;
      note?: string;
    }
  ) => void;
  addHabit: (name: string) => void;
  removeHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  addYoutubeLink: (title: string, url: string) => void;
  removeYoutubeLink: (id: string) => void;
  updateGoals: (goals: Goals) => void;
};

const defaultGoals: Goals = {
  studyMinutes: 360,
  sleepMinutes: 480,
  habitsPerDay: 3,
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

function sortByDateDescending<T extends { date: string }>(entries: T[]) {
  return [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const {
    value: studyEntries,
    setValue: setStudyEntries,
    hydrated: studyHydrated,
  } = usePersistentState<StudyEntry[]>("learnnova:study", []);

  const {
    value: sleepEntries,
    setValue: setSleepEntries,
    hydrated: sleepHydrated,
  } = usePersistentState<SleepEntry[]>("learnnova:sleep", []);

  const {
    value: habits,
    setValue: setHabits,
    hydrated: habitsHydrated,
  } = usePersistentState<Habit[]>("learnnova:habits", []);

  const {
    value: youtubeLinks,
    setValue: setYoutubeLinks,
    hydrated: linksHydrated,
  } = usePersistentState<YoutubeLink[]>("learnnova:lectures", []);

  const {
    value: goals,
    setValue: setGoals,
    hydrated: goalsHydrated,
  } = usePersistentState<Goals>("learnnova:goals", defaultGoals);

  const hydrated =
    studyHydrated &&
    sleepHydrated &&
    habitsHydrated &&
    linksHydrated &&
    goalsHydrated;

  const recordStudy = useCallback((minutes: number, date?: string) => {
    if (!minutes || Number.isNaN(minutes)) return;
    const isoDate = date ?? new Date().toISOString().slice(0, 10);
    setStudyEntries((prev) => {
      const existing = prev.find((entry) => entry.date === isoDate);
      if (existing) {
        return sortByDateDescending(
          prev.map((entry) =>
            entry.date === isoDate
              ? { ...entry, minutes: entry.minutes + minutes }
              : entry
          )
        );
      }
      return sortByDateDescending([
        ...prev,
        {
          id: uuid(),
          date: isoDate,
          minutes,
        },
      ]);
    });
  }, [setStudyEntries]);

  const recordSleep: AppDataContextValue["recordSleep"] = useCallback((
    durationMinutes,
    data
  ) => {
    if (!durationMinutes || Number.isNaN(durationMinutes)) return;
    const isoDate = data?.date ?? new Date().toISOString().slice(0, 10);
    setSleepEntries((prev) => {
      const existing = prev.find((entry) => entry.date === isoDate);
      if (existing) {
        return sortByDateDescending(
          prev.map((entry) =>
            entry.date === isoDate
              ? {
                  ...entry,
                  durationMinutes,
                  bedtime: data?.bedtime,
                  wakeTime: data?.wakeTime,
                  note: data?.note,
                }
              : entry
          )
        );
      }
      return sortByDateDescending([
        ...prev,
        {
          id: uuid(),
          date: isoDate,
          durationMinutes,
          bedtime: data?.bedtime,
          wakeTime: data?.wakeTime,
          note: data?.note,
        },
      ]);
    });
  }, [setSleepEntries]);

  const addHabit = useCallback((name: string) => {
    if (!name.trim()) return;
    setHabits((prev) => [
      ...prev,
      {
        id: uuid(),
        name: name.trim(),
        completedDates: [],
      },
    ]);
  }, [setHabits]);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  }, [setHabits]);

  const toggleHabitCompletion = useCallback((id: string, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        const alreadyDone = habit.completedDates.includes(date);
        return {
          ...habit,
          completedDates: alreadyDone
            ? habit.completedDates.filter((entry) => entry !== date)
            : [...habit.completedDates, date],
        };
      })
    );
  }, [setHabits]);

  const addYoutubeLink = useCallback((title: string, url: string) => {
    if (!title.trim() || !url.trim()) return;
    setYoutubeLinks((prev) => [
      {
        id: uuid(),
        title: title.trim(),
        url: url.trim(),
        addedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [setYoutubeLinks]);

  const removeYoutubeLink = useCallback((id: string) => {
    setYoutubeLinks((prev) => prev.filter((item) => item.id !== id));
  }, [setYoutubeLinks]);

  const updateGoals = useCallback((nextGoals: Goals) => {
    setGoals({
      studyMinutes: Math.max(30, nextGoals.studyMinutes),
      sleepMinutes: Math.max(180, nextGoals.sleepMinutes),
      habitsPerDay: Math.max(1, nextGoals.habitsPerDay),
    });
  }, [setGoals]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      hydrated,
      studyEntries,
      sleepEntries,
      habits,
      youtubeLinks,
      goals,
      recordStudy,
      recordSleep,
      addHabit,
      removeHabit,
      toggleHabitCompletion,
      addYoutubeLink,
      removeYoutubeLink,
      updateGoals,
    }),
    [
      hydrated,
      studyEntries,
      sleepEntries,
      habits,
      youtubeLinks,
      goals,
      recordStudy,
      recordSleep,
      addHabit,
      removeHabit,
      toggleHabitCompletion,
      addYoutubeLink,
      removeYoutubeLink,
      updateGoals,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
