export interface Investment {
  amount: number;
  valuePer: number;
  risk: number;
}

export interface Portfolio {
  savings: Investment;
  etfs: Investment;
  stocks: Investment;
  bonds: Investment;
  realEstate: Investment;
  equity: Investment;
  company: Investment;
}

export interface GameState {
  cash: number;
  portfolio: Portfolio;
  advisorHired: boolean;
  prProtection: number;
  totalPortfolioValue: number;
  hasVehicle: boolean;
  workCooldown: number;
  workCount: number;
  secondJobAvailable: boolean;
  companyOwned: boolean;
  companyAge: number;
  transactionCounter: number;
  uniqueAccountTypes: Set<string>;
  activeFilters: Set<string>;
}

export interface Transaction {
  id: number;
  accountType: string;
  description: string;
  amount: number | null;
  total: number | null;
  timestamp: Date;
}

export const CAPITAL_GAINS_TAX_RATE = 0.2;
