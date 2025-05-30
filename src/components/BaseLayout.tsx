import React from "react";
import { fontClasses } from "../lib/fonts";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseLayout({
  children,
  className = "",
}: Readonly<BaseLayoutProps>) {
  return (
    <html lang="en">
      <body className={`${fontClasses} ${className}`}>{children}</body>
    </html>
  );
}
