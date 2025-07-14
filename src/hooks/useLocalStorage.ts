import { useState, useEffect } from "react";

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

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedValue = loadFromLocalStorage(key);
    if (savedValue !== null) {
      setValue(savedValue);
    }
    setIsLoaded(true);
  }, [key]);

  // Save to localStorage whenever value changes
  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage(key, value);
    }
  }, [key, value, isLoaded]);

  const removeFromStorage = () => {
    localStorage.removeItem(key);
  };

  return { value, setValue, isLoaded, removeFromStorage };
};
