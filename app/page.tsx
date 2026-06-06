"use client";

import { useState } from "react";

const SYMPTOMS = [
  "itchy",
  "red",
  "dry",
  "breakout",
  "swollen",
  "painful",
  "flaky",
] as const;

type Symptom = (typeof SYMPTOMS)[number];

type SkinLog = {
  id: string;
  date: string;
  skinScore: number;
  symptoms: Symptom[];
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  sleepHours: number;
  stress: number;
  notes: string;
};

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function createEmptyMeals() {
  return { breakfast: "", lunch: "", dinner: "", snacks: "" };
}

export default function Home() {
  const [logs, setLogs] = useState<SkinLog[]>([]);
  const [date, setDate] = useState(getTodayDate);
  const [skinScore, setSkinScore] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [meals, setMeals] = useState(createEmptyMeals);
  const [sleepHours, setSleepHours] = useState(7);
  const [stress, setStress] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  function toggleSymptom(symptom: Symptom) {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (skinScore === null || stress === null) return;

    const entry: SkinLog = {
      id: crypto.randomUUID(),
      date,
      skinScore,
      symptoms,
      meals: { ...meals },
      sleepHours,
      stress,
      notes,
    };

    setLogs((prev) => [entry, ...prev]);
    setDate(getTodayDate());
    setSkinScore(null);
    setSymptoms([]);
    setMeals(createEmptyMeals());
    setSleepHours(7);
    setStress(null);
    setNotes("");
  }

  const canSave = skinScore !== null && stress !== null;

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Skin Log
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Track your skin, meals, sleep, and stress daily.
          </p>
        </header>

        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
        >
          <div>
            <label
              htmlFor="date"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Skin score
            </legend>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setSkinScore(score)}
                  className={`min-h-11 min-w-11 flex-1 rounded-lg border text-sm font-medium transition-colors sm:flex-none sm:px-5 ${
                    skinScore === score
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              1 = worst, 5 = best
            </p>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Symptoms
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SYMPTOMS.map((symptom) => (
                <label
                  key={symptom}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm capitalize transition-colors ${
                    symptoms.includes(symptom)
                      ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  {symptom}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Meals
            </legend>
            <div className="space-y-3">
              {(
                [
                  ["breakfast", "Breakfast"],
                  ["lunch", "Lunch"],
                  ["dinner", "Dinner"],
                  ["snacks", "Snacks"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
                  >
                    {label}
                  </label>
                  <input
                    id={key}
                    type="text"
                    value={meals[key]}
                    onChange={(e) =>
                      setMeals((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    placeholder={`What did you have for ${label.toLowerCase()}?`}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="sleep"
              className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              <span>Sleep hours</span>
              <span className="tabular-nums text-zinc-900 dark:text-zinc-100">
                {sleepHours}h
              </span>
            </label>
            <input
              id="sleep"
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-zinc-900 dark:accent-zinc-100"
            />
            <div className="mt-1 flex justify-between text-xs text-zinc-400">
              <span>0h</span>
              <span>12h</span>
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Stress
            </legend>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setStress(level)}
                  className={`min-h-11 min-w-11 flex-1 rounded-lg border text-sm font-medium transition-colors sm:flex-none sm:px-5 ${
                    stress === level
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              1 = low, 5 = high
            </p>
          </fieldset>

          <div>
            <label
              htmlFor="notes"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else worth noting today..."
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={!canSave}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Save log
          </button>
        </form>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Saved logs
          </h2>
          {logs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No logs yet. Save your first entry above.
            </p>
          ) : (
            <ul className="space-y-4">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <time
                      dateTime={log.date}
                      className="text-base font-medium text-zinc-900 dark:text-zinc-50"
                    >
                      {new Date(log.date + "T12:00:00").toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </time>
                    <div className="flex gap-3 text-sm">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Skin {log.skinScore}/5
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Stress {log.stress}/5
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {log.sleepHours}h sleep
                      </span>
                    </div>
                  </div>

                  {log.symptoms.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Symptoms
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {log.symptoms.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-rose-50 px-2 py-0.5 text-xs capitalize text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(log.meals.breakfast ||
                    log.meals.lunch ||
                    log.meals.dinner ||
                    log.meals.snacks) && (
                    <div className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Meals
                      </p>
                      {log.meals.breakfast && (
                        <p>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            Breakfast:
                          </span>{" "}
                          {log.meals.breakfast}
                        </p>
                      )}
                      {log.meals.lunch && (
                        <p>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            Lunch:
                          </span>{" "}
                          {log.meals.lunch}
                        </p>
                      )}
                      {log.meals.dinner && (
                        <p>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            Dinner:
                          </span>{" "}
                          {log.meals.dinner}
                        </p>
                      )}
                      {log.meals.snacks && (
                        <p>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            Snacks:
                          </span>{" "}
                          {log.meals.snacks}
                        </p>
                      )}
                    </div>
                  )}

                  {log.notes && (
                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Notes:
                      </span>{" "}
                      {log.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
