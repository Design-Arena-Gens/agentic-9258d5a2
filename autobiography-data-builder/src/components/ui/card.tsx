import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl", className)}>
      {children}
    </div>
  );
}
