declare module 'react-day-picker' {
  import * as React from 'react';

  export interface DayPickerComponents {
    IconLeft?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    IconRight?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    [key: string]: React.ComponentType<any> | undefined;
  }

  export interface DayPickerProps extends React.HTMLAttributes<HTMLDivElement> {
    mode?: 'single' | 'multiple' | 'range';
    selected?: unknown;
    defaultMonth?: Date;
    month?: Date;
    onSelect?: (value: unknown) => void;
    showOutsideDays?: boolean;
    className?: string;
    classNames?: Record<string, string | undefined>;
    components?: DayPickerComponents;
    [key: string]: unknown;
  }

  export const DayPicker: React.ComponentType<DayPickerProps>;
}
