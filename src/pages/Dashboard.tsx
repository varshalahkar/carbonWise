import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Gauge, Leaf, LockKeyhole, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import CountUp from "../components/CountUp";
import EmptyState from "../components/EmptyState";
import LivingEarth from "../components/LivingEarth";
import { BENCHMARK_KG_CO2, calculateCarbonScore, currentMonthEntries, getCategoryTotals, getComparison, getPlanetHealth, totalEmissions } from "../lib/calculations";
import type { ActivityEntry } from "../types";

type DashboardProps = {
  entries: ActivityEntry[];
};

const facts = [
  "Electricity generation, transportation, food choices, and household fuel use all shape a personal carbon footprint.",
  "A lower-emission commute can reduce repeated monthly impact faster than most one-time swaps.",
  "Tracking habits turns climate awareness into measurable action.",
  "Small reductions become visible when they are recorded consistently over time.",
] as const;

export default function Dashboard({ entries }: DashboardProps) {
  const [factIndex, setFactIndex] = useState(0);
  const monthlyEntries = useMemo(() => currentMonthEntries(entries), [entries]);
  const total = useMemo(() => totalEmissions(monthlyEntries), [monthlyEntries]);
  const hasData = monthlyEntries.length > 0;
  const hasAnyEntries = entries.length > 0;
  const score = hasData ? calculateCarbonScore(total) : null;
  const health = getPlanetHealth(score);
  const categories = useMemo(() => getCategoryTotals(entries), [entries]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFactIndex((current) => (current + 1) % facts.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto max-w-7xl space-y-7">
      <section className="overflow-hidden rounded-lg bg-forest px-5 py-8 text-white shadow-glass sm:px-8 lg:px-10">
        <div className="grid items-center gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 inline-flex rounded-lg bg-aquamarine px-4 py-2 text-sm font-black text-forest">Carbon Awareness</p>
            <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">Carbon emissions are one of the leading causes of climate change.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-seafoam sm:text-lg">
              Transportation, electricity usage, food choices, and household fuel consumption all contribute to your carbon footprint.
              Track your habits and discover how small changes can create a measurable environmental impact.
            </p>
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-6 rounded-lg border border-aquamarine/30 bg-white/8 p-4 text-sm leading-6 text-aquamarine"
            >
              {facts[factIndex]}
            </motion.p>
          </div>
          <div className="flex justify-center">
            <LivingEarth score={score} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Gauge} label="Carbon Score" value={score === null ? "Not Available" : <CountUp value={score} suffix="/100" />} />
        <MetricCard icon={Leaf} label="Planet Health" value={health} />
        <MetricCard icon={Activity} label="Monthly Activity Entries" value={hasData ? <CountUp value={monthlyEntries.length} /> : "Not Available"} />
      </section>

      <section className="rounded-lg border border-seafoam bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint/50 text-forest">
            <Target size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-black text-forest">Carbon Impact Meter</h2>
            <p className="text-sm text-moss">Current emissions compared with the 167 kg CO2 monthly benchmark.</p>
          </div>
        </div>

        {hasData ? (
          <div className="grid gap-4 md:grid-cols-3">
            <ImpactItem label="Current Emissions" value={`${total} kg CO2`} />
            <ImpactItem label="Benchmark" value={`${BENCHMARK_KG_CO2} kg CO2`} />
            <ImpactItem label="Comparison" value={getComparison(total)} />
          </div>
        ) : (
          <EmptyState
            title="No carbon data available yet."
            message="Use Carbon Calculator to start tracking your environmental impact."
          />
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <LockedCard title="Recommendations" locked={!hasAnyEntries} detail={hasAnyEntries ? "Unlocked from your highest-emission category." : "Locked"} />
        <LockedCard title="Charts" locked={!hasAnyEntries} detail={hasAnyEntries ? `${categories.length} active categories detected.` : "Empty"} />
        <LockedCard title="Badges and Achievements" locked={!hasAnyEntries} detail={hasAnyEntries ? "Updated from activity history." : "Locked"} />
      </section>
    </motion.div>
  );
}

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-seafoam bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-glow">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-seafoam/55 text-forest">
        <Icon size={22} aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-moss">{label}</p>
      <p className="mt-2 text-2xl font-black text-forest">{value}</p>
    </div>
  );
}

function ImpactItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#effff7] p-5">
      <p className="text-sm font-semibold text-moss">{label}</p>
      <p className="mt-2 text-2xl font-black text-forest">{value}</p>
    </div>
  );
}

function LockedCard({ title, locked, detail }: { title: string; locked: boolean; detail: string }) {
  return (
    <div className="rounded-lg border border-seafoam bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-black text-forest">{title}</h3>
        {locked && <LockKeyhole size={18} className="text-moss" aria-hidden="true" />}
      </div>
      <p className="mt-3 text-sm font-semibold text-moss">{detail}</p>
    </div>
  );
}
