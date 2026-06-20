import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bus, Car, Flame, PlugZap, RotateCcw, Utensils } from "lucide-react";
import type { ReactNode } from "react";
import { createActivity, foodFactors, fuelFactors, stateFactors, transportFactors } from "../lib/calculations";
import type { ActivityEntry, Category } from "../types";

type CalculatorProps = {
  entries: ActivityEntry[];
  onAddEntry: (entry: ActivityEntry) => void;
  onClear: () => void;
};

const calculatorCards = [
  { category: "transport", title: "Transportation", icon: Car, description: "Distance-based vehicle emissions." },
  { category: "electricity", title: "Electricity", icon: PlugZap, description: "Monthly kWh by Indian state factor." },
  { category: "food", title: "Food", icon: Utensils, description: "Vegetarian or non-vegetarian meal impact." },
  { category: "fuel", title: "Cooking Fuel", icon: Flame, description: "LPG or PNG household fuel usage." },
] as const;

export default function Calculator({ entries, onAddEntry, onClear }: CalculatorProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("transport");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto max-w-7xl space-y-7">
      <section className="flex flex-col justify-between gap-4 rounded-lg bg-forest p-6 text-white shadow-glass md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold text-aquamarine">Carbon Calculator</p>
          <h1 className="mt-2 text-3xl font-black">Add real activities to unlock your planet profile.</h1>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={entries.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-aquamarine/40 px-4 py-3 text-sm font-bold text-aquamarine transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <RotateCcw size={18} aria-hidden="true" />
          Clear Entries
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {calculatorCards.map((card) => {
          const Icon = card.icon;
          const active = activeCategory === card.category;
          return (
            <button
              key={card.category}
              type="button"
              onClick={() => setActiveCategory(card.category)}
              className={`min-h-44 rounded-lg border p-5 text-left transition hover:-translate-y-1 hover:shadow-glow ${
                active ? "border-jade bg-forest text-white" : "border-seafoam bg-white text-forest"
              }`}
            >
              <div className={`mb-5 grid h-12 w-12 place-items-center rounded-lg ${active ? "bg-aquamarine text-forest" : "bg-mint/45 text-forest"}`}>
                <Icon size={24} aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black">{card.title}</h2>
              <p className={`mt-2 text-sm leading-6 ${active ? "text-seafoam" : "text-moss"}`}>{card.description}</p>
            </button>
          );
        })}
      </section>

      <motion.section
        key={activeCategory}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border border-seafoam bg-white p-6 shadow-sm"
      >
        {activeCategory === "transport" && <TransportForm onAddEntry={onAddEntry} />}
        {activeCategory === "electricity" && <ElectricityForm onAddEntry={onAddEntry} />}
        {activeCategory === "food" && <FoodForm onAddEntry={onAddEntry} />}
        {activeCategory === "fuel" && <FuelForm onAddEntry={onAddEntry} />}
      </motion.section>

      <section className="rounded-lg border border-seafoam bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-forest">Recent Entries</h2>
        {entries.length === 0 ? (
          <p className="mt-3 text-sm text-moss">No activities recorded yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[#effff7] text-forest">
                <tr>
                  <th className="px-4 py-3 font-black">Category</th>
                  <th className="px-4 py-3 font-black">Activity</th>
                  <th className="px-4 py-3 font-black">Quantity</th>
                  <th className="px-4 py-3 font-black">CO2</th>
                  <th className="px-4 py-3 font-black">Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.slice(0, 10).map((entry) => (
                  <tr key={entry.id} className="border-b border-seafoam/65">
                    <td className="px-4 py-3 font-bold capitalize text-forest">{entry.category}</td>
                    <td className="px-4 py-3 text-moss">{entry.label}</td>
                    <td className="px-4 py-3 text-moss">
                      {entry.quantity} {entry.unit}
                    </td>
                    <td className="px-4 py-3 font-black text-forest">{entry.co2Kg} kg</td>
                    <td className="px-4 py-3 text-moss">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </motion.div>
  );
}

function TransportForm({ onAddEntry }: { onAddEntry: (entry: ActivityEntry) => void }) {
  const [vehicle, setVehicle] = useState<string>(transportFactors[0].value);
  const [distance, setDistance] = useState("");
  const selected = useMemo(() => transportFactors.find((item) => item.value === vehicle) ?? transportFactors[0], [vehicle]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantity = Number(distance);
    if (quantity <= 0) return;
    onAddEntry(createActivity("transport", selected.label, quantity, "km", selected.factor));
    setDistance("");
  };

  return (
    <CalculatorForm title="Transportation" icon={<Bus size={22} aria-hidden="true" />} onSubmit={submit}>
      <SelectField label="Vehicle" value={vehicle} onChange={setVehicle} options={transportFactors.map((item) => ({ label: item.label, value: item.value }))} />
      <NumberField label="Distance (km)" value={distance} onChange={setDistance} />
      <ResultPreview value={Number(distance) * selected.factor} />
    </CalculatorForm>
  );
}

function ElectricityForm({ onAddEntry }: { onAddEntry: (entry: ActivityEntry) => void }) {
  const [state, setState] = useState<string>(stateFactors[0].label);
  const [kwh, setKwh] = useState("");
  const selected = useMemo(() => stateFactors.find((item) => item.label === state) ?? { label: "Fallback", factor: 0.71 }, [state]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantity = Number(kwh);
    if (quantity <= 0) return;
    onAddEntry(createActivity("electricity", selected.label, quantity, "kWh", selected.factor));
    setKwh("");
  };

  return (
    <CalculatorForm title="Electricity" icon={<PlugZap size={22} aria-hidden="true" />} onSubmit={submit}>
      <SelectField label="State" value={state} onChange={setState} options={stateFactors.map((item) => ({ label: item.label, value: item.label }))} />
      <NumberField label="Monthly Consumption (kWh)" value={kwh} onChange={setKwh} />
      <ResultPreview value={Number(kwh) * selected.factor} />
    </CalculatorForm>
  );
}

function FoodForm({ onAddEntry }: { onAddEntry: (entry: ActivityEntry) => void }) {
  const [diet, setDiet] = useState<string>(foodFactors[0].value);
  const [meals, setMeals] = useState("");
  const selected = useMemo(() => foodFactors.find((item) => item.value === diet) ?? foodFactors[0], [diet]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantity = Number(meals);
    if (quantity <= 0) return;
    onAddEntry(createActivity("food", selected.label, quantity, "meals", selected.factor));
    setMeals("");
  };

  return (
    <CalculatorForm title="Food" icon={<Utensils size={22} aria-hidden="true" />} onSubmit={submit}>
      <SelectField label="Meal Type" value={diet} onChange={setDiet} options={foodFactors.map((item) => ({ label: item.label, value: item.value }))} />
      <NumberField label="Number of meals" value={meals} onChange={setMeals} />
      <ResultPreview value={Number(meals) * selected.factor} />
    </CalculatorForm>
  );
}

function FuelForm({ onAddEntry }: { onAddEntry: (entry: ActivityEntry) => void }) {
  const [fuel, setFuel] = useState<string>(fuelFactors[0].value);
  const [quantityValue, setQuantityValue] = useState("");
  const selected = useMemo(() => fuelFactors.find((item) => item.value === fuel) ?? fuelFactors[0], [fuel]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantity = Number(quantityValue);
    if (quantity <= 0) return;
    onAddEntry(createActivity("fuel", selected.label, quantity, selected.unit, selected.factor));
    setQuantityValue("");
  };

  return (
    <CalculatorForm title="Cooking Fuel" icon={<Flame size={22} aria-hidden="true" />} onSubmit={submit}>
      <SelectField label="Fuel" value={fuel} onChange={setFuel} options={fuelFactors.map((item) => ({ label: item.label, value: item.value }))} />
      <NumberField label={`Quantity (${selected.unit})`} value={quantityValue} onChange={setQuantityValue} />
      <ResultPreview value={Number(quantityValue) * selected.factor} />
    </CalculatorForm>
  );
}

type CalculatorFormProps = {
  title: string;
  icon: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

function CalculatorForm({ title, icon, onSubmit, children }: CalculatorFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint/45 text-forest">{icon}</div>
        <h2 className="text-2xl font-black text-forest">{title}</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">{children}</div>
      <button type="submit" className="mt-6 rounded-lg bg-forest px-6 py-3 font-black text-aquamarine transition hover:bg-viridian hover:shadow-glow">
        Add Activity
      </button>
    </form>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
};

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-moss">{label}</span>
      <select className="field-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-moss">{label}</span>
      <input className="field-input" type="number" min="0" step="0.01" value={value} onChange={(event) => onChange(event.target.value)} required />
    </label>
  );
}

function ResultPreview({ value }: { value: number }) {
  const safeValue = Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;

  return (
    <div className="rounded-lg bg-[#effff7] p-4">
      <p className="text-sm font-bold text-moss">Estimated CO2</p>
      <p className="mt-2 text-3xl font-black text-forest">{safeValue} kg</p>
    </div>
  );
}
