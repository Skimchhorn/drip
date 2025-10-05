declare module 'react-responsive-masonry' {
  import { ReactNode } from 'react';

  export interface MasonryProps {
    columnsCount?: number;
    gutter?: string;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  export interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: { [key: number]: number };
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  export default function Masonry(props: MasonryProps): JSX.Element;
  export function ResponsiveMasonry(props: ResponsiveMasonryProps): JSX.Element;
}
