import { motion } from "framer-motion";
import { BarChart, Bar, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReactNode } from "react";
import EmptyState from "../components/EmptyState";
import { categoryColors, getCategoryTotals, getTrend, highestCategory } from "../lib/calculations";
import type { ActivityEntry } from "../types";

type InsightsProps = {
  entries: ActivityEntry[];
};

export default function Insights({ entries }: InsightsProps) {
  const categoryTotals = getCategoryTotals(entries);
  const weeklyTrend = getTrend(entries, "week");
  const monthlyTrend = getTrend(entries, "month");
  const topSource = highestCategory(entries);

  if (entries.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto max-w-7xl">
        <EmptyState title="No Data Available" message="Add activities in Carbon Calculator to unlock emission trends, category breakdowns, and top source analysis." />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-lg bg-forest p-6 text-white shadow-glass">
        <p className="text-sm font-bold text-aquamarine">Insights</p>
        <h1 className="mt-2 text-3xl font-black">Your carbon patterns, generated from recorded activity.</h1>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartPanel title="Weekly Emission Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid stroke="#9FE2BF" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#355E3B" />
              <YAxis stroke="#355E3B" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="emissions" stroke="#00A36C" strokeWidth={3} animationDuration={600} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Monthly Emission Trend">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid stroke="#9FE2BF" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#355E3B" />
              <YAxis stroke="#355E3B" />
              <Tooltip />
              <Legend />
              <Bar dataKey="emissions" fill="#40B5AD" animationDuration={600} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Category Breakdown">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={categoryTotals} dataKey="value" nameKey="label" innerRadius={72} outerRadius={120} paddingAngle={4} animationDuration={600}>
                {categoryTotals.map((entry) => (
                  <Cell key={entry.category} fill={categoryColors[entry.category]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Top Emission Sources">
          <div className="space-y-4">
            {categoryTotals
              .slice()
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <div key={item.category} className="rounded-lg bg-[#effff7] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-black text-forest">{item.label}</p>
                    <p className="font-black text-forest">{item.value} kg CO2</p>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-lg bg-seafoam">
                    <div className={`h-full rounded-lg bg-jade transition-all ${getWidthClass(topSource && topSource.value > 0 ? (item.value / topSource.value) * 100 : 0)}`} />
                  </div>
                </div>
              ))}
          </div>
        </ChartPanel>
      </section>
    </motion.div>
  );
}

function ChartPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-seafoam bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-xl font-black text-forest">{title}</h2>
      {children}
    </div>
  );
}

function getWidthClass(value: number): string {
  if (value >= 90) return "w-full";
  if (value >= 75) return "w-10/12";
  if (value >= 60) return "w-8/12";
  if (value >= 45) return "w-6/12";
  if (value >= 30) return "w-4/12";
  if (value >= 15) return "w-2/12";
  return "w-1/12";
}
