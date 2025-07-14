import "./App.css";
import { useGameState } from "./hooks/useGameState";
import { TransactionLog } from "./components/TransactionLog";
import { GameStatus } from "./components/GameStatus";
import { GameActions } from "./components/GameActions";
import { SaveIndicator } from "./components/SaveIndicator";

function App() {
  const {
    gameState,
    transactions,
    buttonCooldowns,
    getCooldownProgress,
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
    toggleFilter,
    resetGame,
  } = useGameState();

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "#eee",
        fontFamily: "monospace",
        margin: 0,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <SaveIndicator onResetGame={resetGame} />

      <div style={{ maxWidth: "800px", width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          A Dim Portfolio
        </h1>

        <TransactionLog
          transactions={transactions}
          uniqueAccountTypes={gameState.uniqueAccountTypes}
          activeFilters={gameState.activeFilters}
          onToggleFilter={toggleFilter}
        />

        <GameStatus
          cash={gameState.cash}
          totalPortfolioValue={gameState.totalPortfolioValue}
          portfolio={gameState.portfolio}
        />

        <GameActions
          gameState={gameState}
          buttonCooldowns={buttonCooldowns}
          getCooldownProgress={getCooldownProgress}
          onEarnMoney={earnMoney}
          onBuyVehicle={buyVehicle}
          onWorkSecondJob={workSecondJob}
          onDepositHysa={depositHysa}
          onWithdrawSavings={withdrawSavings}
          onInvestEtfs={investEtfs}
          onEarnEquity={earnEquity}
          onInvestStocks={investStocks}
          onInvestBonds={investBonds}
          onInvestRealEstate={investRealEstate}
          onStartCompany={startCompany}
          onHireAdvisor={hireAdvisor}
          onManagePr={managePr}
          onCashoutStocks={cashoutStocks}
          onCashoutEtfs={cashoutEtfs}
          onCashoutEquity={cashoutEquity}
        />
      </div>
    </div>
  );
}

export default App;
