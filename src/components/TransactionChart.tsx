import { useMemo } from "react";
import type { Transaction } from "../types/game";

interface TransactionChartProps {
  transactions: Transaction[];
  activeFilters: Set<string>;
  isVisible: boolean;
}

interface ChartDataPoint {
  timestamp: number;
  value: number;
  label: string;
}

export const TransactionChart = ({
  transactions,
  activeFilters,
  isVisible,
}: TransactionChartProps) => {
  const chartData = useMemo(() => {
    if (!isVisible) return [];

    // Filter transactions based on active filters
    const filteredTransactions = transactions.filter(
      (transaction) =>
        activeFilters.size === 0 || activeFilters.has(transaction.accountType)
    );

    // Group transactions by account type and calculate cumulative values
    const accountData: Record<string, ChartDataPoint[]> = {};

    filteredTransactions.forEach((transaction) => {
      if (!accountData[transaction.accountType]) {
        accountData[transaction.accountType] = [];
      }

      // Ensure timestamp is a valid Date object
      let timestamp: number;
      if (transaction.timestamp instanceof Date) {
        timestamp = transaction.timestamp.getTime();
      } else if (typeof transaction.timestamp === "string") {
        timestamp = new Date(transaction.timestamp).getTime();
      } else {
        // Fallback to current time if timestamp is invalid
        timestamp = Date.now();
      }

      const lastValue =
        accountData[transaction.accountType].length > 0
          ? accountData[transaction.accountType][
              accountData[transaction.accountType].length - 1
            ].value
          : 0;

      const newValue = lastValue + (transaction.amount || 0);

      accountData[transaction.accountType].push({
        timestamp,
        value: newValue,
        label: transaction.description,
      });
    });

    return accountData;
  }, [transactions, activeFilters, isVisible]);

  if (!isVisible || Object.keys(chartData).length === 0) {
    return null;
  }

  // Calculate chart dimensions and scales
  const chartWidth = 700;
  const chartHeight = 300;
  const padding = 40;

  const allTimestamps = Object.values(chartData)
    .flat()
    .map((point) => point.timestamp);
  const allValues = Object.values(chartData)
    .flat()
    .map((point) => point.value);

  const minTime = Math.min(...allTimestamps.filter((t) => !isNaN(t)));
  const maxTime = Math.max(...allTimestamps.filter((t) => !isNaN(t)));

  // Calculate the nice upper bound for the Y-axis scale
  const actualMax = Math.max(...allValues.filter((v) => !isNaN(v)), 0);
  const niceUpperBound = (() => {
    if (actualMax <= 0) return 100;

    // For small numbers, round up to nearest 10
    if (actualMax <= 100) {
      return Math.ceil(actualMax / 10) * 10;
    }

    // For medium numbers, round up to nearest 50
    if (actualMax <= 500) {
      return Math.ceil(actualMax / 50) * 50;
    }

    // For large numbers, round up to nearest 100
    if (actualMax <= 1000) {
      return Math.ceil(actualMax / 100) * 100;
    }

    // For very large numbers, round up to nearest 500
    return Math.ceil(actualMax / 500) * 500;
  })();

  // Generate dynamic Y-axis labels based on the actual data range
  const generateYAxisLabels = () => {
    // Generate 5-6 evenly spaced labels from 0 to the nice upper bound
    const step = niceUpperBound / 5;
    const labels = [];
    for (let i = 0; i <= 5; i++) {
      const value = step * i;
      labels.push(Math.round(value * 100) / 100); // Round to 2 decimal places
    }
    return labels;
  };

  const yAxisLabels = generateYAxisLabels();

  const timeScale = (timestamp: number) => {
    if (maxTime === minTime) return padding + (chartWidth - 2 * padding) / 2;
    return (
      padding +
      ((timestamp - minTime) / (maxTime - minTime)) * (chartWidth - 2 * padding)
    );
  };

  const valueScale = (value: number) => {
    if (niceUpperBound === 0)
      return chartHeight - padding - (chartHeight - 2 * padding) / 2;
    return (
      chartHeight -
      padding -
      (value / niceUpperBound) * (chartHeight - 2 * padding)
    );
  };

  // Generate SVG path for each account type
  const generatePath = (dataPoints: ChartDataPoint[]) => {
    if (dataPoints.length === 0) return "";

    return dataPoints
      .map((point, index) => {
        const x = timeScale(point.timestamp);
        const y = valueScale(point.value);
        // Ensure we have valid numbers for SVG
        if (isNaN(x) || isNaN(y)) return "";
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .filter((segment) => segment !== "")
      .join(" ");
  };

  // Color palette for different account types
  const colors = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#9C27B0",
    "#F44336",
    "#00BCD4",
    "#795548",
  ];

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#222",
        borderRadius: "5px",
        border: "1px solid #444",
      }}
    >
      <h3 style={{ margin: "0 0 20px 0", textAlign: "center" }}>
        Transaction History
      </h3>

      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ display: "block", margin: "0 auto" }}
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#333"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke="#666"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="#666"
          strokeWidth="2"
        />

        {/* Y-axis labels */}
        {yAxisLabels.map((value) => (
          <g key={value}>
            <line
              x1={padding - 5}
              y1={valueScale(value)}
              x2={padding}
              y2={valueScale(value)}
              stroke="#666"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={valueScale(value) + 4}
              textAnchor="end"
              fill="#999"
              fontSize="12"
            >
              ${value}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const timestamp = minTime + (maxTime - minTime) * (percent / 100);
          const x = timeScale(timestamp);
          // Skip rendering if x coordinate is invalid
          if (isNaN(x)) return null;

          return (
            <g key={percent}>
              <line
                x1={x}
                y1={chartHeight - padding}
                x2={x}
                y2={chartHeight - padding + 5}
                stroke="#666"
                strokeWidth="1"
              />
              <text
                x={x}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                fill="#999"
                fontSize="12"
              >
                {new Date(timestamp).toLocaleTimeString()}
              </text>
            </g>
          );
        })}

        {/* Data lines */}
        {Object.entries(chartData).map(([accountType, dataPoints], index) => (
          <g key={accountType}>
            <path
              d={generatePath(dataPoints)}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth="2"
            />
            {/* Data points */}
            {dataPoints.map((point, pointIndex) => {
              const cx = timeScale(point.timestamp);
              const cy = valueScale(point.value);
              // Skip rendering if coordinates are invalid
              if (isNaN(cx) || isNaN(cy)) return null;

              return (
                <circle
                  key={`${accountType}-${pointIndex}`}
                  cx={cx}
                  cy={cy}
                  r="3"
                  fill={colors[index % colors.length]}
                  style={{ cursor: "pointer" }}
                >
                  <title>{`${accountType}: $${point.value.toFixed(2)} - ${
                    point.label
                  }`}</title>
                </circle>
              );
            })}
          </g>
        ))}

        {/* Legend */}
        <g transform={`translate(${chartWidth - 150}, 20)`}>
          {Object.keys(chartData).map((accountType, index) => (
            <g key={accountType} transform={`translate(0, ${index * 20})`}>
              <rect
                width="12"
                height="12"
                fill={colors[index % colors.length]}
                rx="2"
              />
              <text
                x="20"
                y="10"
                fill="#eee"
                fontSize="12"
                style={{ textTransform: "capitalize" }}
              >
                {accountType}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
