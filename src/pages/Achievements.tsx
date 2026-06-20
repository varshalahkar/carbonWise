import { motion } from "framer-motion";
import { CheckCircle2, LockKeyhole, Medal } from "lucide-react";
import { cumulativeSavedAgainstBenchmark } from "../lib/calculations";
import type { ActivityEntry } from "../types";

type AchievementsProps = {
  entries: ActivityEntry[];
};

type Achievement = {
  title: string;
  detail: string;
  unlocked: boolean;
};

export default function Achievements({ entries }: AchievementsProps) {
  const saved = cumulativeSavedAgainstBenchmark(entries);
  const streak = calculateStreak(entries);
  const achievements: Achievement[] = [
    { title: "First Activity", detail: "Record one carbon activity.", unlocked: entries.length >= 1 },
    { title: "7 Day Streak", detail: "Record activity across seven consecutive days.", unlocked: streak >= 7 },
    { title: "25 Activities", detail: "Record 25 activity entries.", unlocked: entries.length >= 25 },
    { title: "50 Activities", detail: "Record 50 activity entries.", unlocked: entries.length >= 50 },
    { title: "100kg CO2 Saved", detail: "Stay at least 100 kg below the monthly benchmark.", unlocked: saved >= 100 },
    { title: "500kg CO2 Saved", detail: "Accumulate a 500 kg benchmark gap through low-emission tracking.", unlocked: saved >= 500 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-lg bg-forest p-6 text-white shadow-glass">
        <p className="text-sm font-bold text-aquamarine">Achievements</p>
        <h1 className="mt-2 text-3xl font-black">Milestones unlock from your actual activity history.</h1>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.title}
            className={`rounded-lg border p-5 shadow-sm transition hover:-translate-y-1 ${
              achievement.unlocked ? "border-jade bg-white hover:shadow-glow" : "border-seafoam bg-white/76"
            }`}
          >
            <div className={`mb-5 grid h-12 w-12 place-items-center rounded-lg ${achievement.unlocked ? "bg-aquamarine text-forest" : "bg-seafoam/55 text-moss"}`}>
              {achievement.unlocked ? <CheckCircle2 size={24} aria-hidden="true" /> : <LockKeyhole size={24} aria-hidden="true" />}
            </div>
            <h2 className="text-xl font-black text-forest">{achievement.title}</h2>
            <p className="mt-2 text-sm leading-6 text-moss">{achievement.detail}</p>
            <p className="mt-4 inline-flex rounded-lg bg-[#effff7] px-3 py-2 text-xs font-black text-forest">
              {achievement.unlocked ? "Unlocked" : "Locked"}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-seafoam bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint/45 text-forest">
            <Medal size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-black text-forest">Current Progress</h2>
            <p className="text-sm text-moss">{entries.length} activities recorded. {Math.round(saved)} kg CO2 below benchmark.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function calculateStreak(entries: ActivityEntry[]): number {
  const days = Array.from(new Set(entries.map((entry) => new Date(entry.createdAt).toDateString())))
    .map((day) => new Date(day))
    .sort((a, b) => b.getTime() - a.getTime());

  if (days.length === 0) return 0;

  let streak = 1;
  for (let index = 1; index < days.length; index += 1) {
    const previous = days[index - 1];
    const current = days[index];
    const diffDays = Math.round((previous.getTime() - current.getTime()) / 86400000);
    if (diffDays === 1) streak += 1;
    if (diffDays > 1) break;
  }

  return streak;
}
