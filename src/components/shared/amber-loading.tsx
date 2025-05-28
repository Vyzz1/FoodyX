import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AmberLoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function AmberLoading({
  size = "md",
  text,
  className,
}: AmberLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const textSizeClasses = {
    sm: "text-xs mt-2",
    md: "text-sm mt-3",
    lg: "text-base mt-4",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        {/* Spinner */}
        <motion.div
          className={cn(
            "rounded-full border-amber-200 border-t-amber-500",
            sizeClasses[size]
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />

        {/* Pulsing background */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full bg-amber-400/20",
            sizeClasses[size]
          )}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </div>

      {text && (
        <motion.p
          className={cn("text-amber-700 font-medium", textSizeClasses[size])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
