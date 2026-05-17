import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SimulationParams, SimulationResult } from "@/lib/simulation/engine";

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: number;
  params: SimulationParams;
  result: SimulationResult;
}

interface ScenarioStore {
  scenarios: SavedScenario[];
  save: (name: string, params: SimulationParams, result: SimulationResult) => SavedScenario;
  remove: (id: string) => void;
  clear: () => void;
}

export const useScenarios = create<ScenarioStore>()(
  persist(
    (set, get) => ({
      scenarios: [],
      save: (name, params, result) => {
        const s: SavedScenario = {
          id: crypto.randomUUID(),
          name,
          createdAt: Date.now(),
          params,
          result,
        };
        set({ scenarios: [s, ...get().scenarios] });
        return s;
      },
      remove: (id) => set({ scenarios: get().scenarios.filter((s) => s.id !== id) }),
      clear: () => set({ scenarios: [] }),
    }),
    { name: "mkt-sim-scenarios" },
  ),
);
