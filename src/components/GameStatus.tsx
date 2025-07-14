import type { Portfolio } from "../types/game";

interface GameStatusProps {
  cash: number;
  totalPortfolioValue: number;
  portfolio: Portfolio;
}

export const GameStatus = ({
  cash,
  totalPortfolioValue,
  portfolio,
}: GameStatusProps) => {
  const getInvestmentsText = () => {
    let investmentsText = "";
    for (let key in portfolio) {
      const investment = portfolio[key as keyof Portfolio];
      const value = investment.amount * investment.valuePer;
      if (investment.amount > 0) {
        investmentsText += `${
          key.charAt(0).toUpperCase() + key.slice(1)
        }: $${value.toFixed(2)}, `;
      }
    }
    return investmentsText ? investmentsText.slice(0, -2) : "None";
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      Cash: ${cash.toFixed(2)}
      <br />
      Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}
      <br />
      Investments: {getInvestmentsText()}
    </div>
  );
};
