import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, LogIn, UserPlus } from "lucide-react";
import type { AuthMode } from "../types";

type AuthPageProps = {
  onAuthenticate: () => void;
};

export default function AuthPage({ onAuthenticate }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAuthenticate();
  };

  return (
    <main className="auth-bg min-h-screen overflow-hidden text-white">
      <div className="auth-overlay min-h-screen">
        <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_minmax(420px,560px)]">
          <div className="hidden items-end p-10 lg:flex">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              <p className="mb-4 inline-flex rounded-lg border border-aquamarine/40 bg-forest/35 px-4 py-2 text-sm font-semibold text-aquamarine backdrop-blur">
                Fresh natural intelligence
              </p>
              <h1 className="text-5xl font-black leading-tight text-white">Measure today. Reduce tomorrow. Protect forever.</h1>
            </motion.div>
          </div>

          <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="w-full max-w-md rounded-lg border border-white/24 bg-white/14 p-7 shadow-glass backdrop-blur-2xl sm:p-8"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-aquamarine text-forest">
                  <Leaf size={26} aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-black">CarbonWise</h1>
                  <p className="text-sm text-seafoam">Measure today. Reduce tomorrow. Protect forever.</p>
                </div>
              </div>

              <blockquote className="mb-7 rounded-lg border border-aquamarine/30 bg-forest/28 p-4 text-sm leading-6 text-white/90">
                "The greatest threat to our planet is the belief that someone else will save it."
              </blockquote>

              <div className="mb-6 grid grid-cols-2 rounded-lg bg-forest/35 p-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-lg px-4 py-3 text-sm font-bold transition ${mode === "login" ? "bg-aquamarine text-forest" : "text-white hover:bg-white/12"}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-lg px-4 py-3 text-sm font-bold transition ${mode === "signup" ? "bg-aquamarine text-forest" : "text-white hover:bg-white/12"}`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-seafoam">Name</span>
                    <input className="auth-input" type="text" required autoComplete="name" />
                  </label>
                )}
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-seafoam">Email</span>
                  <input className="auth-input" type="email" required autoComplete="email" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-seafoam">Password</span>
                  <input className="auth-input" type="password" required autoComplete={mode === "login" ? "current-password" : "new-password"} />
                </label>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-aquamarine px-5 py-4 font-black text-forest transition hover:bg-cyanAccent hover:shadow-glow"
                >
                  {mode === "login" ? <LogIn size={19} aria-hidden="true" /> : <UserPlus size={19} aria-hidden="true" />}
                  {mode === "login" ? "Login" : "Create Account"}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
