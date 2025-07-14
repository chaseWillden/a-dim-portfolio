import { useCallback } from "react";
import type { GameState, Portfolio } from "../types/game";
import { CAPITAL_GAINS_TAX_RATE } from "../types/game";

interface UseGameActionsProps {
  gameState: GameState;
  setGameState: (updater: (prev: GameState) => GameState) => void;
  log: (
    accountType: string,
    description: string,
    amount?: number | null,
    total?: number | null
  ) => void;
  updateStatus: () => void;
  disableButton: (buttonId: string, time: number) => void;
}

export const useGameActions = ({
  gameState,
  setGameState,
  log,
  updateStatus,
  disableButton,
}: UseGameActionsProps) => {
  const cashOutInvestment = useCallback(
    (type: keyof Portfolio) => {
      const inv = gameState.portfolio[type];
      if (inv.amount > 0) {
        const currentValue = inv.amount * inv.valuePer;
        const gain = inv.amount * (inv.valuePer - 1);
        const tax = gain * CAPITAL_GAINS_TAX_RATE;
        const netProceeds = currentValue - tax;

        setGameState((prev) => ({
          ...prev,
          cash: prev.cash + netProceeds,
          portfolio: {
            ...prev.portfolio,
            [type]: { ...prev.portfolio[type], amount: 0 },
          },
        }));

        log(
          type.charAt(0).toUpperCase() + type.slice(1),
          "Cashed out",
          -currentValue,
          0
        );
        log(
          "Cash",
          "Net proceeds from " + type + " sale (after tax)",
          netProceeds,
          gameState.cash + netProceeds
        );
        updateStatus();
      }
    },
    [gameState.portfolio, gameState.cash, log, updateStatus, setGameState]
  );

  const earnMoney = useCallback(() => {
    disableButton("earn-money", gameState.workCooldown);
    setGameState((prev) => ({
      ...prev,
      cash: prev.cash + 10,
      workCount: prev.workCount + 1,
    }));
    log("Cash", "Worked for Money", 10, gameState.cash + 10);
    updateStatus();
  }, [
    gameState.workCooldown,
    gameState.cash,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const buyVehicle = useCallback(() => {
    if (gameState.cash >= 500 && !gameState.hasVehicle) {
      disableButton("buy-vehicle", Infinity);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 500,
        hasVehicle: true,
        workCooldown: 2000,
      }));
      log(
        "Cash",
        "Bought Vehicle - Work time reduced",
        -500,
        gameState.cash - 500
      );
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.hasVehicle,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const workSecondJob = useCallback(() => {
    disableButton("work-second-job", 8000);
    setGameState((prev) => ({
      ...prev,
      cash: prev.cash + 15,
      workCount: prev.workCount + 1,
    }));
    log("Cash", "Worked Second Job", 15, gameState.cash + 15);
    updateStatus();
  }, [gameState.cash, log, updateStatus, disableButton, setGameState]);

  const depositHysa = useCallback(() => {
    if (gameState.cash >= 100) {
      disableButton("deposit-hysa", 5000);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 100,
        portfolio: {
          ...prev.portfolio,
          savings: {
            ...prev.portfolio.savings,
            amount: prev.portfolio.savings.amount + 100,
          },
        },
      }));
      log("Cash", "Deposited to HYSA", -100, gameState.cash - 100);
      const savingsValue =
        (gameState.portfolio.savings.amount + 100) *
        gameState.portfolio.savings.valuePer;
      log("Savings", "Deposit", 100, savingsValue);
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.portfolio.savings,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const withdrawSavings = useCallback(() => {
    if (gameState.portfolio.savings.amount >= 100) {
      disableButton("withdraw-savings", 5000);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash + 100,
        portfolio: {
          ...prev.portfolio,
          savings: {
            ...prev.portfolio.savings,
            amount: prev.portfolio.savings.amount - 100,
          },
        },
      }));
      log("Cash", "Withdrew from HYSA", 100, gameState.cash + 100);
      const savingsValue =
        (gameState.portfolio.savings.amount - 100) *
        gameState.portfolio.savings.valuePer;
      log("Savings", "Withdrawal", -100, savingsValue);
      updateStatus();
    }
  }, [
    gameState.portfolio.savings,
    gameState.cash,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const investEtfs = useCallback(() => {
    if (gameState.cash >= 100) {
      disableButton("invest-etfs", 15000);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 100,
        portfolio: {
          ...prev.portfolio,
          etfs: {
            ...prev.portfolio.etfs,
            amount: prev.portfolio.etfs.amount + 100,
          },
        },
      }));
      log("Cash", "Invested in ETFs", -100, gameState.cash - 100);
      const etfsValue =
        (gameState.portfolio.etfs.amount + 100) *
        gameState.portfolio.etfs.valuePer;
      log("Etfs", "Investment", 100, etfsValue);
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.portfolio.etfs,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const earnEquity = useCallback(() => {
    disableButton("earn-equity", 20000);
    setGameState((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        equity: {
          ...prev.portfolio.equity,
          amount: prev.portfolio.equity.amount + 50,
        },
      },
    }));
    const equityValue =
      (gameState.portfolio.equity.amount + 50) *
      gameState.portfolio.equity.valuePer;
    log("Equity", "Earned Company Equity", 50, equityValue);
    updateStatus();
  }, [
    gameState.portfolio.equity,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const investStocks = useCallback(() => {
    if (gameState.cash >= 50) {
      disableButton("invest-stocks", 10000);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 50,
        portfolio: {
          ...prev.portfolio,
          stocks: {
            ...prev.portfolio.stocks,
            amount: prev.portfolio.stocks.amount + 50,
          },
        },
      }));
      log("Cash", "Invested in Stocks", -50, gameState.cash - 50);
      const stocksValue =
        (gameState.portfolio.stocks.amount + 50) *
        gameState.portfolio.stocks.valuePer;
      log("Stocks", "Investment", 50, stocksValue);
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.portfolio.stocks,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const investBonds = useCallback(() => {
    if (gameState.cash >= 100) {
      disableButton("invest-bonds", 20000);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 100,
        portfolio: {
          ...prev.portfolio,
          bonds: {
            ...prev.portfolio.bonds,
            amount: prev.portfolio.bonds.amount + 100,
          },
        },
      }));
      log("Cash", "Invested in Bonds", -100, gameState.cash - 100);
      const bondsValue =
        (gameState.portfolio.bonds.amount + 100) *
        gameState.portfolio.bonds.valuePer;
      log("Bonds", "Investment", 100, bondsValue);
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.portfolio.bonds,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const investRealEstate = useCallback(() => {
    if (gameState.cash >= 200) {
      disableButton("invest-real-estate", 40000);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 200,
        portfolio: {
          ...prev.portfolio,
          realEstate: {
            ...prev.portfolio.realEstate,
            amount: prev.portfolio.realEstate.amount + 200,
          },
        },
      }));
      log("Cash", "Invested in Real Estate", -200, gameState.cash - 200);
      const realEstateValue =
        (gameState.portfolio.realEstate.amount + 200) *
        gameState.portfolio.realEstate.valuePer;
      log("RealEstate", "Investment", 200, realEstateValue);
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.portfolio.realEstate,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const startCompany = useCallback(() => {
    if (gameState.cash >= 1000 && !gameState.companyOwned) {
      disableButton("start-company", Infinity);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 1000,
        companyOwned: true,
        companyAge: 0,
        portfolio: {
          ...prev.portfolio,
          company: { ...prev.portfolio.company, amount: 1000 },
        },
      }));
      log("Cash", "Started Company", -1000, gameState.cash - 1000);
      log("Company", "Initial Investment", 1000, 1000);
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.companyOwned,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const hireAdvisor = useCallback(() => {
    if (gameState.cash >= 50 && !gameState.advisorHired) {
      disableButton("hire-advisor", Infinity);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 50,
        advisorHired: true,
        portfolio: {
          savings: {
            ...prev.portfolio.savings,
            valuePer: prev.portfolio.savings.valuePer + 0.01,
          },
          etfs: {
            ...prev.portfolio.etfs,
            valuePer: prev.portfolio.etfs.valuePer + 0.01,
          },
          stocks: {
            ...prev.portfolio.stocks,
            valuePer: prev.portfolio.stocks.valuePer + 0.01,
          },
          bonds: {
            ...prev.portfolio.bonds,
            valuePer: prev.portfolio.bonds.valuePer + 0.01,
          },
          realEstate: {
            ...prev.portfolio.realEstate,
            valuePer: prev.portfolio.realEstate.valuePer + 0.01,
          },
          equity: {
            ...prev.portfolio.equity,
            valuePer: prev.portfolio.equity.valuePer + 0.01,
          },
          company: {
            ...prev.portfolio.company,
            valuePer: prev.portfolio.company.valuePer + 0.01,
          },
        },
      }));
      log(
        "Cash",
        "Hired a financial advisor. Investment returns improved.",
        -50,
        gameState.cash - 50
      );
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.advisorHired,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const managePr = useCallback(() => {
    if (gameState.cash >= 20) {
      disableButton("manage-pr", 4000);
      setGameState((prev) => ({
        ...prev,
        cash: prev.cash - 20,
        prProtection: prev.prProtection + 0.1,
      }));
      log(
        "Cash",
        "Spent on PR management. Protection increased.",
        -20,
        gameState.cash - 20
      );
      updateStatus();
    }
  }, [
    gameState.cash,
    gameState.prProtection,
    log,
    updateStatus,
    disableButton,
    setGameState,
  ]);

  const cashoutStocks = useCallback(() => {
    disableButton("cashout-stocks", 5000);
    cashOutInvestment("stocks");
  }, [cashOutInvestment, disableButton]);

  const cashoutEtfs = useCallback(() => {
    disableButton("cashout-etfs", 5000);
    cashOutInvestment("etfs");
  }, [cashOutInvestment, disableButton]);

  const cashoutEquity = useCallback(() => {
    disableButton("cashout-equity", 5000);
    cashOutInvestment("equity");
  }, [cashOutInvestment, disableButton]);

  return {
    earnMoney,
    buyVehicle,
    workSecondJob,
    depositHysa,
    withdrawSavings,
    investEtfs,
    earnEquity,
    investStocks,
    investBonds,
    investRealEstate,
    startCompany,
    hireAdvisor,
    managePr,
    cashoutStocks,
    cashoutEtfs,
    cashoutEquity,
  };
};
