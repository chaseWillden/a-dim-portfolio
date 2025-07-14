import type { GameState, Portfolio } from "../types/game";

export const initialPortfolio: Portfolio = {
  savings: { amount: 0, valuePer: 1.005, risk: 0 },
  etfs: { amount: 0, valuePer: 1.04, risk: 0.08 },
  stocks: { amount: 0, valuePer: 1.05, risk: 0.1 },
  bonds: { amount: 0, valuePer: 1.02, risk: 0.05 },
  realEstate: { amount: 0, valuePer: 1.08, risk: 0.15 },
  equity: { amount: 0, valuePer: 1.06, risk: 0.12 },
  company: { amount: 0, valuePer: 1.0, risk: 0.2 },
};

export const initialState: GameState = {
  cash: 100,
  portfolio: initialPortfolio,
  advisorHired: false,
  prProtection: 0,
  totalPortfolioValue: 0,
  hasVehicle: false,
  workCooldown: 4000,
  workCount: 0,
  secondJobAvailable: true,
  companyOwned: false,
  companyAge: 0,
  transactionCounter: 0,
  uniqueAccountTypes: new Set(),
  activeFilters: new Set(),
};

// Convert Set objects to/from arrays for JSON serialization
export const serializeGameState = (gameState: GameState) => ({
  ...gameState,
  uniqueAccountTypes: Array.from(gameState.uniqueAccountTypes),
  activeFilters: Array.from(gameState.activeFilters),
});

export const deserializeGameState = (data: any): GameState => ({
  ...data,
  uniqueAccountTypes: new Set(data.uniqueAccountTypes || []),
  activeFilters: new Set(data.activeFilters || []),
});

export const calculateTotalPortfolioValue = (portfolio: Portfolio): number => {
  let total = 0;
  for (let key in portfolio) {
    const investment = portfolio[key as keyof Portfolio];
    total += investment.amount * investment.valuePer;
  }
  return total;
};
