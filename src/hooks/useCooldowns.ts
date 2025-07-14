import { useState, useCallback, useEffect } from "react";

interface CooldownInfo {
  isDisabled: boolean;
  duration: number;
  startTime: number;
}

export const useCooldowns = () => {
  const [cooldowns, setCooldowns] = useState<Record<string, CooldownInfo>>({});

  const disableButton = useCallback((buttonId: string, time: number) => {
    const startTime = Date.now();
    setCooldowns((prev) => ({
      ...prev,
      [buttonId]: {
        isDisabled: true,
        duration: time,
        startTime,
      },
    }));

    if (time !== Infinity) {
      setTimeout(() => {
        setCooldowns((prev) => ({
          ...prev,
          [buttonId]: {
            isDisabled: false,
            duration: 0,
            startTime: 0,
          },
        }));
      }, time);
    }
  }, []);

  const getCooldownProgress = useCallback(
    (buttonId: string): number => {
      const cooldown = cooldowns[buttonId];
      if (!cooldown || !cooldown.isDisabled || cooldown.duration === Infinity) {
        return 0;
      }

      const elapsed = Date.now() - cooldown.startTime;
      const progress = Math.min(elapsed / cooldown.duration, 1);
      return 1 - progress; // Return remaining progress (1 = full, 0 = empty)
    },
    [cooldowns]
  );

  const resetCooldowns = useCallback(() => {
    setCooldowns({});
  }, []);

  // Progress update timer
  useEffect(() => {
    const progressInterval = setInterval(() => {
      // Force re-render to update progress bars
      setCooldowns((prev) => ({ ...prev }));
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  return {
    cooldowns,
    disableButton,
    getCooldownProgress,
    resetCooldowns,
  };
};
