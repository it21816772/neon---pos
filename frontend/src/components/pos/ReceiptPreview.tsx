import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/currency';

export const ReceiptPreview = () => {
  const items = useCartStore((state) => state.items);
  const customerEmail = useCartStore((state) => state.customerEmail);
  const setCustomerEmail = useCartStore((state) => state.setCustomerEmail);
  const { subtotal, tax, total } = useCartStore((state) => state.getTotals());

  return (
    <section className="glass-panel rounded-3xl p-4 sm:p-6 shadow-inner shadow-black/60">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Receipt</p>
          <h2 className="text-white">Digital Preview</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">Soft copy ready</span>
      </header>
      <div className="mt-4 space-y-3 rounded-2xl border border-white/5 p-4 text-sm text-white/70">
        {items.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm sm:text-base">
              <span>
                {item.quantity} × {item.product.name}
              </span>
              <span>{formatCurrency(item.product.priceCents * item.quantity)}</span>
            </div>
          ))
        )}
        <hr className="border-white/5" />
        <div className="flex justify-between text-white/60">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold text-white">
          <span>Total</span>
          <span className="text-neon-purple">{formatCurrency(total)}</span>
        </div>
      </div>
      <label className="mt-4 block text-xs uppercase tracking-[0.3em] text-white/50">
        Customer Email
        <input
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-neon-cyan focus:outline-none"
          type="email"
          placeholder="customer@domain.com"
          value={customerEmail ?? ''}
          onChange={(event) => setCustomerEmail(event.target.value)}
        />
      </label>
    </section>
  );
};

