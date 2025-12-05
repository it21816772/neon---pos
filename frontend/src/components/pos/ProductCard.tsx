import { LucidePackageOpen } from 'lucide-react';
import { Product } from '../../api/types';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const inStock = product.inventory?.quantity ?? 0;
  const isLowStock = inStock > 0 && inStock <= (product.inventory?.minStock ?? 3);

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="group relative flex h-44 flex-col justify-between rounded-3xl border border-white/5 bg-white/5 p-4 text-left shadow-lg backdrop-blur-md transition hover:border-neon-cyan/60 hover:shadow-glow"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{product.category?.name ?? 'General'}</p>
        <p className="mt-1 text-lg font-semibold text-white group-hover:text-neon-cyan">{product.name}</p>
      </div>

      <div className="flex items-end justify-between text-sm text-white/70">
        <div>
          <p className="text-2xl font-semibold text-neon-cyan">{formatCurrency(product.priceCents)}</p>
          <p className="text-xs text-white/50">Tap to add</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-1">
          <LucidePackageOpen size={16} />
          <span className={isLowStock ? 'text-amber-300' : 'text-white'}>
            {inStock > 0 ? `${inStock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </button>
  );
};

