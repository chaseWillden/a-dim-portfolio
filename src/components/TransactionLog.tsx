import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../types/game";
import { TransactionChart } from "./TransactionChart";

interface TransactionLogProps {
  transactions: Transaction[];
  uniqueAccountTypes: Set<string>;
  activeFilters: Set<string>;
  onToggleFilter: (accountType: string) => void;
}

export const TransactionLog = ({
  transactions,
  uniqueAccountTypes,
  activeFilters,
  onToggleFilter,
}: TransactionLogProps) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [isChartVisible, setIsChartVisible] = useState(true);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      activeFilters.size === 0 || activeFilters.has(transaction.accountType)
  );

  // Auto-scroll to bottom when new transactions are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [transactions.length]); // Scroll when transaction count changes

  return (
    <div>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {Array.from(uniqueAccountTypes).map((accountType) => (
            <button
              key={accountType}
              onClick={() => onToggleFilter(accountType)}
              style={{
                backgroundColor: activeFilters.has(accountType)
                  ? "#555"
                  : "#333",
                color: "#eee",
                border: "1px solid #555",
                padding: "5px 10px",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                if (!activeFilters.has(accountType)) {
                  e.currentTarget.style.backgroundColor = "#444";
                }
              }}
              onMouseOut={(e) => {
                if (!activeFilters.has(accountType)) {
                  e.currentTarget.style.backgroundColor = "#333";
                }
              }}
            >
              {accountType}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsChartVisible(!isChartVisible)}
          style={{
            backgroundColor: isChartVisible ? "#555" : "#333",
            color: "#eee",
            border: "1px solid #555",
            padding: "5px 10px",
            cursor: "pointer",
            marginLeft: "auto",
          }}
          onMouseOver={(e) => {
            if (!isChartVisible) {
              e.currentTarget.style.backgroundColor = "#444";
            }
          }}
          onMouseOut={(e) => {
            if (!isChartVisible) {
              e.currentTarget.style.backgroundColor = "#333";
            }
          }}
        >
          {isChartVisible ? "Hide Chart" : "Show Chart"}
        </button>
      </div>

      <TransactionChart
        transactions={transactions}
        activeFilters={activeFilters}
        isVisible={isChartVisible}
      />

      <div
        ref={logContainerRef}
        style={{
          height: "200px",
          overflowY: "auto",
          border: "1px solid #444",
          marginBottom: "20px",
          backgroundColor: "#222",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "5px",
                  border: "1px solid #444",
                  textAlign: "left",
                  backgroundColor: "#333",
                }}
              >
                Transaction ID
              </th>
              <th
                style={{
                  padding: "5px",
                  border: "1px solid #444",
                  textAlign: "left",
                  backgroundColor: "#333",
                }}
              >
                Account Type
              </th>
              <th
                style={{
                  padding: "5px",
                  border: "1px solid #444",
                  textAlign: "left",
                  backgroundColor: "#333",
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: "5px",
                  border: "1px solid #444",
                  textAlign: "left",
                  backgroundColor: "#333",
                }}
              >
                Amount
              </th>
              <th
                style={{
                  padding: "5px",
                  border: "1px solid #444",
                  textAlign: "left",
                  backgroundColor: "#333",
                }}
              >
                Account Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td
                  style={{
                    padding: "5px",
                    border: "1px solid #444",
                    textAlign: "left",
                  }}
                >
                  {transaction.id}
                </td>
                <td
                  style={{
                    padding: "5px",
                    border: "1px solid #444",
                    textAlign: "left",
                  }}
                >
                  {transaction.accountType}
                </td>
                <td
                  style={{
                    padding: "5px",
                    border: "1px solid #444",
                    textAlign: "left",
                  }}
                >
                  {transaction.description}
                </td>
                <td
                  style={{
                    padding: "5px",
                    border: "1px solid #444",
                    textAlign: "left",
                    color:
                      transaction.amount !== null
                        ? transaction.amount >= 0
                          ? "green"
                          : "red"
                        : "",
                  }}
                >
                  {transaction.amount !== null
                    ? (transaction.amount >= 0 ? "+" : "") +
                      transaction.amount.toFixed(2)
                    : ""}
                </td>
                <td
                  style={{
                    padding: "5px",
                    border: "1px solid #444",
                    textAlign: "left",
                  }}
                >
                  {transaction.total !== null
                    ? transaction.total.toFixed(2)
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
