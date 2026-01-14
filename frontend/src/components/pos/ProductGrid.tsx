import { useMemo } from 'react';
import { FixedSizeGrid as Grid, type GridChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useProductsQuery } from '../../api/products';
import { ProductCard } from './ProductCard';

export const ProductGrid = () => {
  const { data: products, isLoading, isError } = useProductsQuery();

  const itemData = useMemo(() => products ?? [], [products]);
  const columnCount = 3;

  if (isLoading) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center text-white/60">Booting product catalog…</div>
    );
  }

  if (isError) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center text-rose-300">Unable to load products right now.</div>
    );
  }

  if (!itemData.length) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center text-white/70">
        No products yet. Add items from the manager dashboard.
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-4 shadow-glow-purple">
      <AutoSizer disableHeight>
        {({ width }) => {
          const columnCount = width < 640 ? 1 : width < 1024 ? 2 : 3;
          const columnWidth = Math.floor(width / columnCount - 16);
          const rowCount = Math.ceil(itemData.length / columnCount);
          const rowHeight = columnCount === 1 ? 240 : columnCount === 2 ? 220 : 200;
          const gridHeight = Math.max(Math.min(rowCount * rowHeight, 800), 300);
          return (
            <Grid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={gridHeight}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
              itemData={itemData}
            >
              {(props: GridChildComponentProps) => {
                const { columnIndex, rowIndex, style } = props;
                const itemIndex = rowIndex * columnCount + columnIndex;
                const product = itemData[itemIndex];
                if (!product) {
                  return null;
                }
                return (
                  <div style={{ ...style, padding: 8 }}>
                    <ProductCard product={product} />
                  </div>
                );
              }}
            </Grid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

