import type { GameState } from "../types/game";
import { CooldownButton } from "./CooldownButton";

interface GameActionsProps {
  gameState: GameState;
  buttonCooldowns: Record<
    string,
    { isDisabled: boolean; duration: number; startTime: number }
  >;
  getCooldownProgress: (buttonId: string) => number;
  onEarnMoney: () => void;
  onBuyVehicle: () => void;
  onWorkSecondJob: () => void;
  onDepositHysa: () => void;
  onWithdrawSavings: () => void;
  onInvestEtfs: () => void;
  onEarnEquity: () => void;
  onInvestStocks: () => void;
  onInvestBonds: () => void;
  onInvestRealEstate: () => void;
  onStartCompany: () => void;
  onHireAdvisor: () => void;
  onManagePr: () => void;
  onCashoutStocks: () => void;
  onCashoutEtfs: () => void;
  onCashoutEquity: () => void;
}

export const GameActions = ({
  gameState,
  buttonCooldowns,
  getCooldownProgress,
  onEarnMoney,
  onBuyVehicle,
  onWorkSecondJob,
  onDepositHysa,
  onWithdrawSavings,
  onInvestEtfs,
  onEarnEquity,
  onInvestStocks,
  onInvestBonds,
  onInvestRealEstate,
  onStartCompany,
  onHireAdvisor,
  onManagePr,
  onCashoutStocks,
  onCashoutEtfs,
  onCashoutEquity,
}: GameActionsProps) => {
  const buttonStyle = {
    backgroundColor: "#333",
    color: "#eee",
    border: "1px solid #555",
    padding: "10px",
    cursor: "pointer",
    margin: "5px",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#222",
    color: "#666",
    cursor: "not-allowed" as const,
  };

  const shouldShowButton = (condition: boolean) =>
    condition ? {} : { display: "none" };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <CooldownButton
        onClick={onEarnMoney}
        disabled={buttonCooldowns["earn-money"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("earn-money")}
        style={
          buttonCooldowns["earn-money"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle
        }
      >
        Work for Money (Earn $10)
      </CooldownButton>

      <CooldownButton
        onClick={onBuyVehicle}
        disabled={buttonCooldowns["buy-vehicle"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("buy-vehicle")}
        style={{
          ...(buttonCooldowns["buy-vehicle"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.cash >= 500),
        }}
      >
        Buy Vehicle ($500)
      </CooldownButton>

      <CooldownButton
        onClick={onWorkSecondJob}
        disabled={buttonCooldowns["work-second-job"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("work-second-job")}
        style={{
          ...(buttonCooldowns["work-second-job"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(
            gameState.workCount >= 5 && gameState.secondJobAvailable
          ),
        }}
      >
        Work Second Job (Earn $15)
      </CooldownButton>

      <CooldownButton
        onClick={onDepositHysa}
        disabled={buttonCooldowns["deposit-hysa"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("deposit-hysa")}
        style={{
          ...(buttonCooldowns["deposit-hysa"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.cash >= 100),
        }}
      >
        Deposit to HYSA ($100)
      </CooldownButton>

      <CooldownButton
        onClick={onWithdrawSavings}
        disabled={buttonCooldowns["withdraw-savings"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("withdraw-savings")}
        style={{
          ...(buttonCooldowns["withdraw-savings"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.portfolio.savings.amount >= 100),
        }}
      >
        Withdraw $100 from savings
      </CooldownButton>

      <CooldownButton
        onClick={onInvestEtfs}
        disabled={buttonCooldowns["invest-etfs"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("invest-etfs")}
        style={{
          ...(buttonCooldowns["invest-etfs"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.cash >= 100),
        }}
      >
        Invest in ETFs ($100)
      </CooldownButton>

      <CooldownButton
        onClick={onEarnEquity}
        disabled={buttonCooldowns["earn-equity"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("earn-equity")}
        style={{
          ...(buttonCooldowns["earn-equity"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.workCount >= 10),
        }}
      >
        Earn Company Equity (Gain $50 equity)
      </CooldownButton>

      <CooldownButton
        onClick={onInvestStocks}
        disabled={buttonCooldowns["invest-stocks"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("invest-stocks")}
        style={{
          ...(buttonCooldowns["invest-stocks"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.cash >= 50),
        }}
      >
        Invest in Stocks ($50)
      </CooldownButton>

      <CooldownButton
        onClick={onInvestBonds}
        disabled={buttonCooldowns["invest-bonds"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("invest-bonds")}
        style={{
          ...(buttonCooldowns["invest-bonds"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.cash >= 100),
        }}
      >
        Invest in Bonds ($100)
      </CooldownButton>

      <CooldownButton
        onClick={onInvestRealEstate}
        disabled={buttonCooldowns["invest-real-estate"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("invest-real-estate")}
        style={{
          ...(buttonCooldowns["invest-real-estate"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.cash >= 200),
        }}
      >
        Invest in Real Estate ($200)
      </CooldownButton>

      <CooldownButton
        onClick={onStartCompany}
        disabled={buttonCooldowns["start-company"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("start-company")}
        style={{
          ...(buttonCooldowns["start-company"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.cash >= 1000),
        }}
      >
        Start Company ($1000)
      </CooldownButton>

      <CooldownButton
        onClick={onHireAdvisor}
        disabled={buttonCooldowns["hire-advisor"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("hire-advisor")}
        style={{
          ...(buttonCooldowns["hire-advisor"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(
            gameState.cash >= 50 && gameState.totalPortfolioValue >= 100
          ),
        }}
      >
        Hire Financial Advisor ($50)
      </CooldownButton>

      <CooldownButton
        onClick={onManagePr}
        disabled={buttonCooldowns["manage-pr"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("manage-pr")}
        style={{
          ...(buttonCooldowns["manage-pr"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(
            gameState.advisorHired && gameState.totalPortfolioValue >= 200
          ),
        }}
      >
        Manage PR ($20)
      </CooldownButton>

      <CooldownButton
        onClick={onCashoutStocks}
        disabled={buttonCooldowns["cashout-stocks"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("cashout-stocks")}
        style={{
          ...(buttonCooldowns["cashout-stocks"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.portfolio.stocks.amount > 0),
        }}
      >
        Cash Out Stocks
      </CooldownButton>

      <CooldownButton
        onClick={onCashoutEtfs}
        disabled={buttonCooldowns["cashout-etfs"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("cashout-etfs")}
        style={{
          ...(buttonCooldowns["cashout-etfs"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.portfolio.etfs.amount > 0),
        }}
      >
        Cash Out ETFs
      </CooldownButton>

      <CooldownButton
        onClick={onCashoutEquity}
        disabled={buttonCooldowns["cashout-equity"]?.isDisabled || false}
        cooldownProgress={getCooldownProgress("cashout-equity")}
        style={{
          ...(buttonCooldowns["cashout-equity"]?.isDisabled
            ? disabledButtonStyle
            : buttonStyle),
          ...shouldShowButton(gameState.portfolio.equity.amount > 0),
        }}
      >
        Cash Out Equity
      </CooldownButton>
    </div>
  );
};
