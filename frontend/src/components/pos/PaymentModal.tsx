import { AnimatePresence, motion } from 'framer-motion';
import { LucideX, LucideShieldCheck, LucideMail, LucidePrinter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { useCreateOrderMutation } from '../../api/orders';
import { useSessionStore } from '../../store/sessionStore';
import { formatCurrency } from '../../utils/currency';
import { fetchEscPosPayload } from '../../api/printing';
import { printEscPos } from '../../lib/printing/qzClient';
import { usePrintersQuery } from '../../api/printers';
import { sendReceiptEmail } from '../../api/receipts';

const paymentOptions: Array<{ value: 'CASH' | 'CARD' | 'MOBILE'; label: string; hint: string }> = [
  { value: 'CASH', label: 'Cash', hint: 'Fast cash drawer workflow' },
  { value: 'CARD', label: 'Card', hint: 'Chip + tap ready' },
  { value: 'MOBILE', label: 'Mobile Pay', hint: 'QR / NFC wallet' },
];

export const PaymentModal = () => {
  const isOpen = useUIStore((state) => state.isPaymentOpen);
  const setPaymentOpen = useUIStore((state) => state.setPaymentOpen);
  const items = useCartStore((state) => state.items);
  const { subtotal, tax, total } = useCartStore((state) => state.getTotals());
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const clearCart = useCartStore((state) => state.clearCart);
  const customerEmail = useCartStore((state) => state.customerEmail);
  const selectedPrinterId = useSessionStore((state) => state.selectedPrinterId);
  const { data: printers } = usePrintersQuery();
  const selectedPrinter = printers?.find((printer) => printer.id === selectedPrinterId);

  const { mutateAsync: submitOrder, isPending } = useCreateOrderMutation();

  const handlePayment = async () => {
    if (!items.length) return;
    try {
      const order = await submitOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        customerEmail,
        paymentMethod,
      });

      toast.success('Order completed');
      
      // Print receipt if printer is available
      if (selectedPrinter) {
        try {
          const escposPayload = await fetchEscPosPayload(order.id);
          await printEscPos(escposPayload, selectedPrinter.name);
          toast.success('Receipt sent to printer');
        } catch (printerError) {
          // Printer error - already handled by toast notification
          if (process.env.NODE_ENV === 'development') {
            console.error('Printer error:', printerError);
          }
          toast.error('Order saved but printer is offline.');
        }
      }
      
      // Send email receipt if customer email is provided
      if (customerEmail) {
        try {
          await sendReceiptEmail(order.id);
          toast.success('Receipt emailed to customer');
        } catch (emailError) {
          // Email error - already handled by toast notification
          if (process.env.NODE_ENV === 'development') {
            console.error('Email error:', emailError);
          }
          toast.error('Order saved but email failed to send.');
        }
      }
      
      clearCart();
      setPaymentOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-panel relative w-full max-w-[95vw] sm:max-w-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-white/60 hover:text-white"
              onClick={() => setPaymentOpen(false)}
            >
              <LucideX size={16} />
            </button>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex-1 space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Method</p>
                <div className="grid gap-3">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPaymentMethod(option.value)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        paymentMethod === option.value
                          ? 'border-neon-cyan/60 bg-neon-cyan/10 shadow-glow'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <p className="text-lg font-semibold text-white">{option.label}</p>
                      <p className="text-xs text-white/50">{option.hint}</p>
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 p-4 text-sm text-white/60">
                  <div className="flex items-center gap-2 text-neon-cyan">
                    <LucideShieldCheck size={16} />
                    Encrypted transaction link established
                  </div>
                  <p className="mt-2 text-xs">
                    Customer email {customerEmail ? `(${customerEmail})` : 'not provided'} will receive the soft copy receipt.
                  </p>
                </div>
              </div>
              <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Review</p>
                <div className="mt-4 space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-semibold text-white">
                    <span>Total</span>
                    <span className="text-neon-purple">{formatCurrency(total)}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 p-3 text-xs uppercase tracking-[0.3em] text-white/50">
                    <LucidePrinter size={16} className="text-neon-cyan" />
                    {selectedPrinter ? selectedPrinter.name : 'No printer selected'}
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-6 w-full rounded-2xl border border-neon-purple/60 bg-neon-purple/20 py-4 text-lg font-semibold text-white shadow-glow-purple transition hover:bg-neon-purple/40 disabled:opacity-50"
                  onClick={handlePayment}
                  disabled={!items.length || isPending}
                >
                  {isPending ? 'Processing…' : 'Confirm & Print'}
                </button>
                <p className="mt-3 flex items-center gap-2 text-xs text-white/50">
                  <LucideMail size={14} className="text-neon-cyan" />
                  Soft-copy receipt email is queued automatically.
                </p>
              </div>
            </div>
            {/* Mobile sticky confirm button */}
            <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] z-50 px-4">
              <button
                type="button"
                className="w-full rounded-2xl border border-neon-purple/60 bg-neon-purple/20 py-3 text-lg font-semibold text-white shadow-glow-purple transition hover:bg-neon-purple/40 disabled:opacity-50"
                onClick={handlePayment}
                disabled={!items.length || isPending}
              >
                {isPending ? 'Processing…' : 'Confirm & Print'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

