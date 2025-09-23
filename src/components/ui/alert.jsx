import React from "react";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Alert = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`relative w-full rounded-lg border p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = "", ...props }) => {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = "", ...props }) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h5>
  );
};