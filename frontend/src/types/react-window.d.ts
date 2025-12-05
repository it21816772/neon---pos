declare module 'react-window' {
  // Minimal type declarations used by this project. For full types, install
  // a proper @types package or rely on the package-provided types.
  import * as React from 'react';

  export interface GridChildComponentProps {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    data?: any;
  }

  export type FixedSizeGridProps = any;

  export const FixedSizeGrid: React.ComponentType<FixedSizeGridProps>;
  export default FixedSizeGrid;
}
