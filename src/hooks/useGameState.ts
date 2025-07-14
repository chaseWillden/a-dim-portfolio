import { useCallback, useEffect, useRef } from "react";
import type { GameState, Transaction } from "../types/game";
import { useGameStateStorage } from "./useGameStateStorage";
import { useCooldowns } from "./useCooldowns";
import { useGameActions } from "./useGameActions";
import { useGameEvents } from "./useGameEvents";
import {
  initialState,
  calculateTotalPortfolioValue,
} from "../utils/gameStateUtils";

export const useGameState = () => {
  // Core state management with proper Set serialization
  const {
    gameState,
    setGameState,
    transactions,
    setTransactions,
    isLoaded,
    removeGameState,
    removeTransactions,
  } = useGameStateStorage();

  // Ref to track the next transaction ID to ensure uniqueness
  const nextTransactionIdRef = useRef(1);

  // Cooldown management
  const { cooldowns, disableButton, getCooldownProgress, resetCooldowns } =
    useCooldowns();

  // Utility functions
  const updateStatus = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      totalPortfolioValue: calculateTotalPortfolioValue(prev.portfolio),
    }));
  }, [setGameState]);

  const log = useCallback(
    (
      accountType: string,
      description: string,
      amount: number | null = null,
      total: number | null = null
    ) => {
      // Get the next unique transaction ID
      const newTransactionId = nextTransactionIdRef.current;
      nextTransactionIdRef.current += 1;

      // Create the transaction with the new ID
      const newTransaction = {
        id: newTransactionId,
        accountType,
        description,
        amount,
        total,
        timestamp: new Date(),
      };

      // Update both state and transactions atomically
      setGameState((prev) => {
        const newUniqueAccountTypes = new Set(prev.uniqueAccountTypes);
        newUniqueAccountTypes.add(accountType);
        return {
          ...prev,
          transactionCounter: newTransactionId,
          uniqueAccountTypes: newUniqueAccountTypes,
        };
      });

      setTransactions((prev) => [...prev, newTransaction]);
    },
    [setGameState, setTransactions]
  );

  // Game actions
  const gameActions = useGameActions({
    gameState,
    setGameState,
    log,
    updateStatus,
    disableButton,
  });

  // Game events (passive income and random events)
  useGameEvents({
    gameState,
    setGameState,
    log,
    updateStatus,
  });

  // Filter management
  const toggleFilter = useCallback(
    (accountType: string) => {
      setGameState((prev) => {
        const newActiveFilters = new Set(prev.activeFilters);
        if (newActiveFilters.has(accountType)) {
          newActiveFilters.delete(accountType);
        } else {
          newActiveFilters.add(accountType);
        }
        return { ...prev, activeFilters: newActiveFilters };
      });
    },
    [setGameState]
  );

  // Reset functionality
  const resetGame = useCallback(() => {
    setGameState(initialState);
    setTransactions([]);
    resetCooldowns();
    removeGameState();
    removeTransactions();
    nextTransactionIdRef.current = 1; // Reset the transaction ID counter
  }, [
    setGameState,
    setTransactions,
    resetCooldowns,
    removeGameState,
    removeTransactions,
  ]);

  // Initialize the transaction ID ref when data is loaded
  useEffect(() => {
    if (isLoaded) {
      // Set the next transaction ID to be one more than the highest existing ID
      const maxId =
        transactions.length > 0
          ? Math.max(...transactions.map((t) => t.id))
          : 0;
      nextTransactionIdRef.current = maxId + 1;
    }
  }, [isLoaded, transactions]);

  // Initial log - only if no saved data exists
  useEffect(() => {
    if (isLoaded && transactions.length === 0) {
      log(
        "Cash",
        "You awaken with $100 in your pocket. The world of finance is dark and uncertain. Start by earning more money.",
        100,
        100
      );
      updateStatus();
    }
  }, [isLoaded, transactions.length, log, updateStatus]);

  return {
    gameState,
    transactions,
    buttonCooldowns: cooldowns,
    getCooldownProgress,
    toggleFilter,
    resetGame,
    ...gameActions,
  };
};
