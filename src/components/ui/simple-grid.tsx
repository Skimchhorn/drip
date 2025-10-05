"use client";

import { cn } from "./utils";
import * as React from "react";

interface SimpleGridProps extends React.HTMLAttributes<HTMLDivElement> {
  minItemWidth?: number;
  gap?: number;
}

/**
 * Responsive grid that uses CSS Grid auto-fill behavior to create masonry-like layout without JS.
 */
export const SimpleGrid = React.forwardRef<HTMLDivElement, SimpleGridProps>(
  ({ children, className, minItemWidth = 280, gap = 16, ...props }, ref) => {
    const styleProps: React.CSSProperties = {
      gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
      gap,
    };

    return (
      <div
        ref={ref}
        className={cn("grid", className)}
        style={styleProps}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SimpleGrid.displayName = "SimpleGrid";
