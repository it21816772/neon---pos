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
          const columnWidth = width / columnCount - 16;
          const rowCount = Math.ceil(itemData.length / columnCount);
          return (
            <Grid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={640}
              rowCount={rowCount}
              rowHeight={200}
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

