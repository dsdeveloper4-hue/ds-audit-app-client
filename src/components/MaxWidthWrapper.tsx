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
    <div className={`mx-auto mt-14 w-full  px-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
