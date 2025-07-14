import { useEffect, useState } from "react";

interface CooldownButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  cooldownProgress: number;
  style?: React.CSSProperties;
}

export const CooldownButton = ({
  children,
  onClick,
  disabled,
  cooldownProgress,
  style,
}: CooldownButtonProps) => {
  const [progress, setProgress] = useState(cooldownProgress);

  useEffect(() => {
    setProgress(cooldownProgress);
  }, [cooldownProgress]);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
      {disabled && progress > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "5px",
            background: "#222",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              background: "#0f0",
              width: `${progress * 100}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
      )}
    </button>
  );
};
