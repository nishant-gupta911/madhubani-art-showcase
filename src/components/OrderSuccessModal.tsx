import React from 'react';
import { CheckCircle, Package, Truck, Star, ArrowRight } from 'lucide-react';
import { MithilaMotif } from './MithilaMotif';

interface OrderSuccessModalProps {
  orderNumber: string;
  total: number;
  onClose: () => void;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  orderNumber, total, onClose, onContinueShopping, onViewOrders,
}) => {
  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center p-4"
      style={{ background: 'rgba(16,11,4,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="max-w-md w-full p-8 space-y-6 text-center animate-fade-up relative"
        style={{
          background: 'var(--ivory)',
          border: '1px solid var(--hairline)',
          borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(16,11,4,0.25)',
        }}
      >
        <MithilaMotif type="four-corners" color="var(--vermilion)" />

        {/* Success Icon */}
        <div className="flex justify-center">
          <div
            className="relative h-20 w-20 rounded-full flex items-center justify-center border"
            style={{ background: 'rgba(58,107,58,0.1)', borderColor: 'rgba(58,107,58,0.3)' }}
          >
            <CheckCircle className="h-10 w-10 text-leaf" style={{ color: 'var(--leaf)' }} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-display font-bold text-headline" style={{ color: 'var(--ink)' }}>Order Confirmed!</h2>
          <p className="text-body-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Your handpainted artwork is being carefully prepared for archival packaging. Thank you for supporting Natasha Gupta's authentic Mithila craft.
          </p>
        </div>

        {/* Order Summary */}
        <div
          className="p-4 space-y-3 text-left"
          style={{ background: 'var(--ivory-deep)', border: '1px solid var(--hairline-soft)', borderRadius: '3px' }}
        >
          <div className="flex justify-between text-body-sm">
            <span style={{ color: 'var(--ink-muted)' }}>Order Reference</span>
            <span className="font-mono font-bold" style={{ color: 'var(--ink)' }}>{orderNumber}</span>
          </div>
          <div className="flex justify-between text-body-sm">
            <span style={{ color: 'var(--ink-muted)' }}>Amount Paid</span>
            <span className="font-bold" style={{ color: 'var(--ink)' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-body-sm">
            <span style={{ color: 'var(--ink-muted)' }}>Estimated Delivery</span>
            <span className="font-bold" style={{ color: 'var(--leaf)' }}>3–5 Business Days</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex justify-center gap-4 text-[10px]">
          {[
            { icon: CheckCircle, label: 'Confirmed',  active: true },
            { icon: Package,     label: 'Packing',    active: false },
            { icon: Truck,       label: 'In Transit',  active: false },
            { icon: Star,        label: 'Delivered',   active: false },
          ].map(({ icon: Icon, label, active }, i) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center border"
                style={{
                  background: active ? 'var(--leaf)' : 'var(--ivory-deep)',
                  borderColor: active ? 'var(--leaf)' : 'var(--hairline)',
                  color: active ? 'var(--ivory)' : 'var(--ink-dim)',
                }}
              >
                <Icon size={14} />
              </div>
              <span className={active ? 'font-semibold' : ''} style={{ color: active ? 'var(--ink)' : 'var(--ink-dim)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onViewOrders}
            className="btn btn-primary w-full justify-center"
          >
            <Package size={14} /> View My Orders
          </button>
          <button
            onClick={onContinueShopping}
            className="btn btn-outline w-full justify-center"
          >
            Continue Browsing <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
