import React from "react";

interface MaxWidthWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`mx-auto mt-14 w-full max-w-screen-xl px-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
