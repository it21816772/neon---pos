import { LucideMinus, LucidePlus, LucideTrash2, LucideCreditCard } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/currency';
import { NeonButton } from '../ui/NeonButton';

export const CartPanel = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { subtotal, tax, total } = useCartStore((state) => state.getTotals());
  const setPaymentOpen = useUIStore((state) => state.setPaymentOpen);

  return (
    <section className="glass-panel flex flex-col rounded-3xl p-6 shadow-2xl shadow-neon-purple/20">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Active Cart</p>
          <h2 className="text-2xl font-semibold text-white">Order Draft</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/60">
          {items.length} items
        </span>
      </header>
      <div className="my-6 space-y-4 overflow-y-auto pr-2" style={{ maxHeight: 320 }}>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/5 p-6 text-center text-white/60">
            Tap products to build the cart.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div>
                <p className="text-lg font-semibold text-white">{item.product.name}</p>
                <p className="text-sm text-white/50">{formatCurrency(item.product.priceCents)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-white/10 p-1 text-white/80 hover:text-neon-cyan"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  <LucideMinus size={16} />
                </button>
                <span className="w-8 text-center text-lg font-semibold text-white">{item.quantity}</span>
                <button
                  type="button"
                  className="rounded-full border border-white/10 p-1 text-white/80 hover:text-neon-cyan"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <LucidePlus size={16} />
                </button>
                <button
                  type="button"
                  className="rounded-full border border-rose-500/30 p-1 text-rose-300 hover:text-rose-200"
                  onClick={() => removeItem(item.product.id)}
                >
                  <LucideTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <footer className="space-y-4 border-t border-white/5 pt-4">
        <div className="flex justify-between text-sm text-white/60">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-white/60">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-xl font-semibold text-white">
          <span>Total</span>
          <span className="text-neon-cyan">{formatCurrency(total)}</span>
        </div>
        <NeonButton
          variant="purple"
          density="spacious"
          icon={LucideCreditCard}
          disabled={!items.length}
          onClick={() => setPaymentOpen(true)}
        >
          Proceed to Payment
        </NeonButton>
      </footer>
    </section>
  );
};

