import { ProductGrid } from '../components/pos/ProductGrid';
import { CartPanel } from '../components/pos/CartPanel';
import { ReceiptPreview } from '../components/pos/ReceiptPreview';
import { PaymentModal } from '../components/pos/PaymentModal';

const POSPage = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:flex-row">
      <div className="lg:w-2/3">
        <ProductGrid />
      </div>
      <div className="lg:w-1/3 space-y-6">
        <CartPanel />
        <ReceiptPreview />
      </div>
      <PaymentModal />
    </div>
  );
};

export default POSPage;

