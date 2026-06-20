import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Insights from "./pages/Insights";
import EcoCoach from "./pages/EcoCoach";
import Achievements from "./pages/Achievements";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { ActivityEntry } from "./types";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>("carbonwise-authenticated", false);
  const [entries, setEntries] = useLocalStorage<ActivityEntry[]>("carbonwise-activities", []);

  const addEntry = (entry: ActivityEntry) => {
    setEntries([entry, ...entries]);
  };

  const clearEntries = () => {
    setEntries([]);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage onAuthenticate={() => setIsAuthenticated(true)} />} />
      </Routes>
    );
  }

  return (
    <Layout onLogout={() => setIsAuthenticated(false)}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard entries={entries} />} />
        <Route path="/calculator" element={<Calculator entries={entries} onAddEntry={addEntry} onClear={clearEntries} />} />
        <Route path="/insights" element={<Insights entries={entries} />} />
        <Route path="/coach" element={<EcoCoach entries={entries} />} />
        <Route path="/achievements" element={<Achievements entries={entries} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}
