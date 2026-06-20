import { motion } from "framer-motion";
import { Bus, Flame, Leaf, Lightbulb, PlugZap, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { highestCategory } from "../lib/calculations";
import type { ActivityEntry, Category } from "../types";

type EcoCoachProps = {
  entries: ActivityEntry[];
};

const recommendationMap: Record<Category, { title: string; detail: string; icon: LucideIcon }> = {
  transport: {
    title: "Reduce transport intensity",
    detail: "Your transportation entries currently lead your footprint. Try replacing recurring solo trips with bus travel, walking, cycling, or grouped errands where practical.",
    icon: Bus,
  },
  electricity: {
    title: "Lower electricity consumption",
    detail: "Electricity is your highest-emission category. Focus on high-use appliances, cooling habits, efficient lighting, and switching idle devices off at the source.",
    icon: PlugZap,
  },
  food: {
    title: "Adjust meal impact",
    detail: "Food is currently your biggest source. Reducing non-vegetarian meals over the month can create a visible drop in your tracked emissions.",
    icon: Utensils,
  },
  fuel: {
    title: "Improve cooking fuel efficiency",
    detail: "Cooking fuel leads your recorded footprint. Batch cooking, pressure cooking, covered pots, and burner maintenance can reduce repeat fuel demand.",
    icon: Flame,
  },
};

export default function EcoCoach({ entries }: EcoCoachProps) {
  const top = highestCategory(entries);

  if (!top) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto max-w-7xl">
        <EmptyState
          title="No recommendations available yet."
          message="Add activities in Carbon Calculator to unlock personalized sustainability insights."
        />
      </motion.div>
    );
  }

  const recommendation = recommendationMap[top.category];
  const Icon = recommendation.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-lg bg-forest p-6 text-white shadow-glass">
        <p className="text-sm font-bold text-aquamarine">Eco Coach</p>
        <h1 className="mt-2 text-3xl font-black">Recommendations based on your highest-emission category.</h1>
      </section>

      <section className="rounded-lg border border-seafoam bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-mint/45 text-forest">
            <Icon size={28} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-moss">Highest source: {top.label} at {top.value} kg CO2</p>
            <h2 className="mt-2 text-2xl font-black text-forest">{recommendation.title}</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-moss">{recommendation.detail}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <CoachCard icon={Lightbulb} title="Next best step" detail="Record the same category again after a behavior change to see whether the score responds." />
        <CoachCard icon={Leaf} title="Impact principle" detail="CarbonWise only updates guidance when your own activity data changes." />
      </section>
    </motion.div>
  );
}

function CoachCard({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-seafoam bg-white p-5 shadow-sm">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-seafoam/55 text-forest">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-black text-forest">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-moss">{detail}</p>
    </div>
  );
}
