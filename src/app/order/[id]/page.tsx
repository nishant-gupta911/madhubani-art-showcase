import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { getSiteSettings } from '@/lib/settings';
import { siteConfig } from '@/config/site';
import { ArrowLeft, CheckCircle2, Package, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PrintInvoiceButton } from '@/components/PrintInvoiceButton';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Receipt ${id} — ${siteConfig.name}`,
    description: `Official receipt and invoice for order ${id}`,
    robots: { index: false, follow: false },
  };
}

export default async function OrderInvoicePage({ params }: OrderPageProps) {
  const { id } = await params;
  await connectToDatabase();

  const cleanId = id.trim().toUpperCase();
  const order = await Order.findOne({ orderId: cleanId }).lean();
  if (!order) {
    notFound();
  }

  const settings = await getSiteSettings();
  const hasGstin = Boolean(settings.contact.gstin && settings.contact.gstin.trim().length > 0);
  const invoiceTitle = hasGstin ? 'Tax Invoice' : 'Bill of Supply / Order Receipt';

  const subtotalRs = Math.round(order.subtotalPaise / 100);
  const shippingRs = Math.round(order.shippingPaise / 100);
  const codFeeRs = Math.round((order.codFeePaise || 0) / 100);
  const giftWrapRs = Math.round((order.giftWrapPaise || 0) / 100);
  const totalRs = Math.round(order.totalPaise / 100);

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      {/* Top Toolbar (Hidden on print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/track?orderId=${order.orderId}`}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded px-3 py-1.5 bg-white shadow-sm"
          >
            Track Status
          </Link>
          <PrintInvoiceButton />
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-lg shadow-sm p-8 sm:p-12 print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between pb-8 border-b border-stone-200 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl tracking-wide text-stone-900">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">Madhubani Art Handpainted by {siteConfig.artist}</p>
            <p className="text-xs text-stone-500 mt-2">
              {settings.contact.sellerCity}, {settings.contact.state}, India
            </p>
            <p className="text-xs text-stone-500">Email: {settings.contact.email} • Ph: {settings.contact.phone}</p>
            {hasGstin && (
              <p className="text-xs font-mono font-semibold text-stone-700 mt-1">GSTIN: {settings.contact.gstin}</p>
            )}
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 rounded mb-2">
              {invoiceTitle}
            </span>
            <p className="text-sm font-mono font-bold text-stone-900">#{order.orderId}</p>
            <p className="text-xs text-stone-500 mt-1">
              Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-xs text-stone-500">
              Payment: <strong className="uppercase">{order.payment.method}</strong> ({order.payment.status})
            </p>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-stone-200 text-xs">
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-stone-400 mb-2">Customer Details</h4>
            <p className="font-medium text-stone-900">{order.customer.name}</p>
            <p className="text-stone-600">{order.customer.phone}</p>
            <p className="text-stone-600">{order.customer.email}</p>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-wider text-stone-400 mb-2">Delivery Address</h4>
            <p className="text-stone-900 font-medium">{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p className="text-stone-600">{order.shippingAddress.line2}</p>}
            <p className="text-stone-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-stone-600">India</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold">
                <th className="pb-3 w-1/2">Artwork / Item</th>
                <th className="pb-3 text-center">Ref</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Price (₹)</th>
                <th className="pb-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((item, idx) => {
                const itemUnitRs = Math.round(item.pricePaise / 100);
                const itemTotalRs = itemUnitRs * item.qty;
                return (
                  <tr key={idx} className="py-3">
                    <td className="py-3 pr-2">
                      <p className="font-medium text-stone-900">{item.name}</p>
                      {item.framing && (
                        <p className="text-[11px] text-stone-500 capitalize">Framing: {item.framing}</p>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono text-stone-600">{item.ref}</td>
                    <td className="py-3 text-center text-stone-900">{item.qty}</td>
                    <td className="py-3 text-right font-mono text-stone-700">₹{itemUnitRs.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-mono font-semibold text-stone-900">
                      ₹{itemTotalRs.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between gap-6 text-xs">
          <div className="sm:max-w-xs text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700">Artisan Guarantee & Returns</p>
            <p className="leading-relaxed">
              Every piece is handpainted individually by Natasha Gupta. In case of transit damage, please notify within 48 hours with unboxing photos for insured replacement or full refund.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-mono">₹{subtotalRs.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Insured Shipping:</span>
              <span className="font-mono">{shippingRs === 0 ? 'FREE' : `₹${shippingRs}`}</span>
            </div>
            {codFeeRs > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>COD Convenience Fee:</span>
                <span className="font-mono">₹{codFeeRs}</span>
              </div>
            )}
            {giftWrapRs > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Handmade Gift Wrap:</span>
                <span className="font-mono">₹{giftWrapRs}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
              <span>Grand Total:</span>
              <span className="font-mono">₹{totalRs.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-dashed border-stone-200 text-center text-[11px] text-stone-400">
          Thank you for supporting authentic Mithila art • Vernika Enterprises • Handpainted with devotion
        </div>
      </div>
    </div>
  );
}
