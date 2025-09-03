import * as React from "react";
import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        // Centering + spacing
        "mx-auto mt-14 w-full px-4 md:px-6 lg:px-8",
        // Max width constraints for responsiveness
        "max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
