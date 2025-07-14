import { useState, useEffect } from "react";
import type { GameState, Transaction } from "../types/game";
import {
  initialState,
  serializeGameState,
  deserializeGameState,
} from "../utils/gameStateUtils";

// LocalStorage keys
const GAME_STATE_KEY = "finance-game-state";
const TRANSACTIONS_KEY = "finance-game-transactions";

// Helper functions for localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

const loadFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
};

// Serialize transactions with Date objects
const serializeTransactions = (transactions: Transaction[]) => {
  return transactions.map((transaction) => ({
    ...transaction,
    timestamp: transaction.timestamp.toISOString(),
  }));
};

// Deserialize transactions with Date objects
const deserializeTransactions = (data: any[]): Transaction[] => {
  return data.map((transaction) => {
    // Handle both string timestamps and Date objects
    let timestamp: Date;
    if (typeof transaction.timestamp === "string") {
      timestamp = new Date(transaction.timestamp);
    } else if (transaction.timestamp instanceof Date) {
      timestamp = transaction.timestamp;
    } else {
      // Fallback: create a new timestamp if the data is corrupted
      timestamp = new Date();
    }

    return {
      ...transaction,
      timestamp,
    };
  });
};

export const useGameStateStorage = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isGameStateLoaded, setIsGameStateLoaded] = useState(false);
  const [isTransactionsLoaded, setIsTransactionsLoaded] = useState(false);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedGameState = loadFromLocalStorage(GAME_STATE_KEY);
    if (savedGameState) {
      setGameState(deserializeGameState(savedGameState));
    }
    setIsGameStateLoaded(true);
  }, []);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = loadFromLocalStorage(TRANSACTIONS_KEY);
    if (savedTransactions) {
      setTransactions(deserializeTransactions(savedTransactions));
    }
    setIsTransactionsLoaded(true);
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (isGameStateLoaded) {
      saveToLocalStorage(GAME_STATE_KEY, serializeGameState(gameState));
    }
  }, [gameState, isGameStateLoaded]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (isTransactionsLoaded) {
      saveToLocalStorage(TRANSACTIONS_KEY, serializeTransactions(transactions));
    }
  }, [transactions, isTransactionsLoaded]);

  const removeGameState = () => {
    localStorage.removeItem(GAME_STATE_KEY);
  };

  const removeTransactions = () => {
    localStorage.removeItem(TRANSACTIONS_KEY);
  };

  const isLoaded = isGameStateLoaded && isTransactionsLoaded;

  return {
    gameState,
    setGameState,
    transactions,
    setTransactions,
    isLoaded,
    removeGameState,
    removeTransactions,
  };
};
