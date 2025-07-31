import React from "react";
import clsx from "clsx";
interface BreathingLightProps {
  isActive: boolean;
  className?: string;
}

const BreathingLight: React.FC<BreathingLightProps> = ({ isActive, className }) => {
  return (
    <div className={clsx("flex items-center space-x-2",className)}>
      <div
        className={`h-3 w-3 rounded-full ${
          isActive
            ? "bg-green-500 shadow-green-glow animate-breathing"
            : "bg-red-500 shadow-red-glow"
        }`}
      />
    </div>
  );
};

export default BreathingLight;