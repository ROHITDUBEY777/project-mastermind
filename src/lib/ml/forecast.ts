// Pure-TS forecasting utilities (linear regression, moving avg, exp. smoothing)

export interface ForecastPoint {
  step: number;
  actual?: number;
  predicted?: number;
  upper?: number;
  lower?: number;
}

export interface ForecastResult {
  series: ForecastPoint[];
  metrics: { rmse: number; mae: number; r2: number };
  slope: number;
  intercept: number;
  method: string;
}

function linearRegression(y: number[]): { slope: number; intercept: number; fitted: number[] } {
  const n = y.length;
  const xs = y.map((_, i) => i);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (y[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = my - slope * mx;
  const fitted = xs.map((x) => intercept + slope * x);
  return { slope, intercept, fitted };
}

function exponentialSmoothing(y: number[], alpha = 0.4): number[] {
  const out = [y[0]];
  for (let i = 1; i < y.length; i++) out.push(alpha * y[i] + (1 - alpha) * out[i - 1]);
  return out;
}

function metrics(actual: number[], predicted: number[]) {
  const n = actual.length;
  let se = 0, ae = 0, mean = 0;
  for (let i = 0; i < n; i++) mean += actual[i] / n;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const e = actual[i] - predicted[i];
    se += e * e;
    ae += Math.abs(e);
    ssTot += (actual[i] - mean) ** 2;
  }
  const rmse = Math.sqrt(se / n);
  const mae = ae / n;
  const r2 = ssTot === 0 ? 1 : 1 - se / ssTot;
  return { rmse, mae, r2 };
}

export function forecast(
  history: number[],
  horizon: number,
  method: "linear" | "exp_smoothing" | "hybrid" = "hybrid",
): ForecastResult {
  const { slope, intercept, fitted } = linearRegression(history);
  const smoothed = exponentialSmoothing(history, 0.3);
  const inSample =
    method === "linear"
      ? fitted
      : method === "exp_smoothing"
      ? smoothed
      : fitted.map((v, i) => 0.6 * v + 0.4 * smoothed[i]);

  const m = metrics(history, inSample);
  const series: ForecastPoint[] = history.map((a, i) => ({
    step: i,
    actual: a,
    predicted: inSample[i],
  }));

  // Future forecast
  const n = history.length;
  const lastSmoothed = smoothed[smoothed.length - 1];
  const stdErr = Math.sqrt(
    history.reduce((s, v, i) => s + (v - inSample[i]) ** 2, 0) / Math.max(1, n - 2),
  );
  for (let h = 1; h <= horizon; h++) {
    const trend = intercept + slope * (n - 1 + h);
    const expFlat = lastSmoothed;
    const pred =
      method === "linear" ? trend : method === "exp_smoothing" ? expFlat : 0.6 * trend + 0.4 * expFlat;
    const band = 1.96 * stdErr * Math.sqrt(1 + h / n);
    series.push({
      step: n - 1 + h,
      predicted: pred,
      upper: pred + band,
      lower: pred - band,
    });
  }

  return { series, metrics: m, slope, intercept, method };
}
