import { useEffect } from "react";
import type { GameState, Portfolio } from "../types/game";

interface UseGameEventsProps {
  gameState: GameState;
  setGameState: (updater: (prev: GameState) => GameState) => void;
  log: (
    accountType: string,
    description: string,
    amount?: number | null,
    total?: number | null
  ) => void;
  updateStatus: () => void;
}

export const useGameEvents = ({
  gameState,
  setGameState,
  log,
  updateStatus,
}: UseGameEventsProps) => {
  useEffect(() => {
    const passiveIncomeInterval = setInterval(() => {
      setGameState((prev) => {
        let newCash = prev.cash;
        let newPortfolio = { ...prev.portfolio };
        let newCompanyAge = prev.companyAge;

        // Passive growth for non-company investments
        for (let key in newPortfolio) {
          const investment = newPortfolio[key as keyof Portfolio];
          if (investment.amount > 0 && key !== "company") {
            const growth = investment.amount * (investment.valuePer - 1) * 0.1;
            newCash += growth;
            log(
              "Cash",
              `Yield from ${key.charAt(0).toUpperCase() + key.slice(1)}`,
              growth,
              newCash
            );
          }
        }

        // Company logic
        if (prev.companyOwned) {
          newCompanyAge++;
          let factor = 1;
          let cost = 0;
          if (newCompanyAge < 5) {
            factor = 0.95;
            cost = 100;
          } else if (newCompanyAge < 10) {
            factor = 0.98;
            cost = 50;
          } else {
            factor = 1.1 + (newCompanyAge - 10) * 0.05;
          }
          if (cost > 0 && newCash >= cost) {
            newCash -= cost;
            log("Cash", "Company operating costs", -cost, newCash);
          } else if (cost > 0) {
            log("Event", "Company operating costs due, but insufficient cash.");
          }
          const oldCompanyValue =
            newPortfolio.company.amount * newPortfolio.company.valuePer;
          newPortfolio.company.valuePer *= factor;
          const newCompanyValue =
            newPortfolio.company.amount * newPortfolio.company.valuePer;
          const growth = newCompanyValue - oldCompanyValue;
          log("Company", "Value Change", growth, newCompanyValue);
          if (growth > 0) {
            newCash += growth;
            log("Cash", "Company Profit", growth, newCash);
          }
        }

        return {
          ...prev,
          cash: newCash,
          portfolio: newPortfolio,
          companyAge: newCompanyAge,
        };
      });
      updateStatus();
    }, 10000);

    const eventsInterval = setInterval(() => {
      setGameState((prev) => {
        let newPortfolio = { ...prev.portfolio };
        let newSecondJobAvailable = prev.secondJobAvailable;

        // Random PR Attack
        if (Math.random() < 0.2 && prev.totalPortfolioValue > 0) {
          const attackImpact =
            (Math.random() * 0.3 + 0.1) * (1 - prev.prProtection);
          for (let key in newPortfolio) {
            const investment = newPortfolio[key as keyof Portfolio];
            if (investment.amount > 0 && investment.risk > 0) {
              const indivImpact = attackImpact * investment.risk;
              const oldValue = investment.amount * investment.valuePer;
              const indivLoss = oldValue * indivImpact;
              newPortfolio[key as keyof Portfolio].valuePer *= 1 - indivImpact;
              const newValue =
                investment.amount *
                newPortfolio[key as keyof Portfolio].valuePer;
              log(
                key.charAt(0).toUpperCase() + key.slice(1),
                "PR Attack - Scandal",
                -indivLoss,
                newValue
              );
            }
          }
        }

        // Random Life Event: Layoff from second job
        if (
          Math.random() < 0.05 &&
          prev.secondJobAvailable &&
          prev.workCount >= 5
        ) {
          newSecondJobAvailable = false;
          log(
            "Event",
            "Life event: Layoffs at your second job. You were one of them. Second job no longer available."
          );
        }

        return {
          ...prev,
          portfolio: newPortfolio,
          secondJobAvailable: newSecondJobAvailable,
        };
      });
      updateStatus();
    }, 15000);

    return () => {
      clearInterval(passiveIncomeInterval);
      clearInterval(eventsInterval);
    };
  }, [log, updateStatus, setGameState]);
};
