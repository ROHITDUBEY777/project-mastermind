// Agent-based market simulation engine (deterministic, seedable)

export type Strategy = "aggressive" | "balanced" | "premium";

export interface SimulationParams {
  basePrice: number;          // starting price reference
  priceElasticity: number;    // 0.5 - 3, how strongly demand responds to price
  initialDemand: number;      // baseline daily demand
  consumerAgents: number;     // # of consumer agents (50-2000)
  firms: { name: string; strategy: Strategy; initialPrice: number }[];
  competitorAggressiveness: number; // 0-1
  marketingSpend: number;     // 0-100, boosts effective demand
  steps: number;              // # of simulation ticks
  seed: number;
  noise: number;              // 0-1, market volatility
}

export interface TickResult {
  step: number;
  prices: number[];           // per firm
  shares: number[];           // per firm, sums to 1
  units: number[];            // per firm, units sold
  revenue: number[];          // per firm
  profit: number[];           // per firm (cumulative)
  totalDemand: number;
}

export interface SimulationResult {
  params: SimulationParams;
  ticks: TickResult[];
  summary: {
    finalProfit: number[];
    avgShare: number[];
    avgPrice: number[];
    volatility: number[];     // std of price per firm
    winner: string;
  };
}

// mulberry32 PRNG
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COST_RATIO = 0.6; // unit cost = 60% of base price

export function runSimulation(
  params: SimulationParams,
  onProgress?: (pct: number) => void,
): SimulationResult {
  const rand = rng(params.seed);
  const F = params.firms.length;
  const prices = params.firms.map((f) => f.initialPrice);
  const cumProfit = new Array(F).fill(0);
  const priceHistory: number[][] = Array.from({ length: F }, () => []);
  const ticks: TickResult[] = [];
  const unitCost = params.basePrice * COST_RATIO;

  for (let s = 0; s < params.steps; s++) {
    // Effective market demand with noise + marketing
    const marketingBoost = 1 + params.marketingSpend / 200;
    const noiseFactor = 1 + (rand() - 0.5) * 2 * params.noise;
    // seasonality
    const seasonal = 1 + 0.15 * Math.sin((s / params.steps) * Math.PI * 4);
    const D = params.initialDemand * marketingBoost * noiseFactor * seasonal;

    // Consumer choice: each consumer picks firm with highest utility
    const utilities = prices.map((p) => {
      const rel = p / params.basePrice;
      return Math.pow(1 / rel, params.priceElasticity) + rand() * 0.05;
    });
    const sumU = utilities.reduce((a, b) => a + b, 0);
    const shares = utilities.map((u) => u / sumU);
    const units = shares.map((sh) => Math.max(0, Math.round(sh * D)));
    const revenue = units.map((u, i) => u * prices[i]);
    const profit = units.map((u, i) => u * (prices[i] - unitCost));
    for (let i = 0; i < F; i++) cumProfit[i] += profit[i];

    ticks.push({
      step: s,
      prices: [...prices],
      shares,
      units,
      revenue,
      profit: [...cumProfit],
      totalDemand: D,
    });
    for (let i = 0; i < F; i++) priceHistory[i].push(prices[i]);

    // Adaptive pricing
    for (let i = 0; i < F; i++) {
      const strat = params.firms[i].strategy;
      const targetShare = strat === "aggressive" ? 0.45 : strat === "balanced" ? 0.33 : 0.22;
      const diff = targetShare - shares[i];
      // aggressiveness drives reaction magnitude
      const reaction =
        (strat === "aggressive" ? 0.04 : strat === "balanced" ? 0.02 : 0.01) *
        (1 + params.competitorAggressiveness);
      // if undershooting share, drop price; overshooting, raise
      prices[i] *= 1 - diff * reaction;
      // floor at unit cost * 1.05
      prices[i] = Math.max(unitCost * 1.05, Math.min(params.basePrice * 2, prices[i]));
    }

    if (onProgress && s % Math.max(1, Math.floor(params.steps / 20)) === 0) {
      onProgress(s / params.steps);
    }
  }

  // Summary
  const finalProfit = ticks[ticks.length - 1].profit;
  const avgShare = new Array(F).fill(0);
  const avgPrice = new Array(F).fill(0);
  for (const t of ticks) {
    for (let i = 0; i < F; i++) {
      avgShare[i] += t.shares[i] / ticks.length;
      avgPrice[i] += t.prices[i] / ticks.length;
    }
  }
  const volatility = priceHistory.map((arr) => {
    const m = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
  });
  const winnerIdx = finalProfit.indexOf(Math.max(...finalProfit));

  onProgress?.(1);
  return {
    params,
    ticks,
    summary: {
      finalProfit,
      avgShare,
      avgPrice,
      volatility,
      winner: params.firms[winnerIdx].name,
    },
  };
}

export const defaultParams = (): SimulationParams => ({
  basePrice: 100,
  priceElasticity: 1.5,
  initialDemand: 1000,
  consumerAgents: 500,
  firms: [
    { name: "Firm A", strategy: "aggressive", initialPrice: 95 },
    { name: "Firm B", strategy: "balanced", initialPrice: 100 },
    { name: "Firm C", strategy: "premium", initialPrice: 115 },
  ],
  competitorAggressiveness: 0.5,
  marketingSpend: 25,
  steps: 100,
  seed: 42,
  noise: 0.15,
});
