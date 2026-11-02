import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { getSiteSettings } from '@/lib/settings';
import { siteConfig } from '@/config/site';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PrintInvoiceButton } from '@/components/PrintInvoiceButton';
import { Footer } from '@/components/Footer';

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
    <div className="min-h-screen bg-paper text-ink py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 flex flex-col justify-between">
      <div>
        {/* Top Toolbar (Hidden on print) */}
        <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/track?orderId=${order.orderId}`}
              className="font-mono text-xs uppercase tracking-wider text-ink border border-ink px-3 py-1.5 bg-paper hover:bg-paper-2 shadow-[2px_2px_0_var(--ink)]"
            >
              Track Status
            </Link>
            <PrintInvoiceButton />
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="max-w-3xl mx-auto bg-paper-2 border-2 border-ink shadow-[4px_4px_0_var(--ink)] p-8 sm:p-12 print:border-none print:shadow-none print:p-0 mb-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between pb-8 border-b border-line gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-3xl tracking-tight text-ink uppercase">
                  {siteConfig.name}
                </span>
              </div>
              <p className="font-mono text-xs text-accent mt-0.5 uppercase tracking-wider">
                Original Madhubani Art Handpainted by {siteConfig.artist}
              </p>
              <p className="text-xs text-ink/70 mt-2">
                {settings.contact.sellerCity}, {settings.contact.state}, India
              </p>
              <p className="text-xs text-ink/70">Email: {settings.contact.email} • Ph: {settings.contact.phone}</p>
              {hasGstin && (
                <p className="text-xs font-mono font-semibold text-ink mt-1">GSTIN: {settings.contact.gstin}</p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider border border-ink bg-paper text-ink mb-2">
                {invoiceTitle}
              </span>
              <p className="text-base font-mono font-bold text-accent">#{order.orderId}</p>
              <p className="text-xs font-mono text-ink/70 mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs font-mono text-ink/70">
                Payment: <strong className="uppercase text-ink">{order.payment.method}</strong> ({order.payment.status})
              </p>
            </div>
          </div>

          {/* Bill To & Ship To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-line text-xs font-mono">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-ink/50 mb-2">Customer Details</h4>
              <p className="font-bold text-ink">{order.customer.name}</p>
              <p className="text-ink/80">{order.customer.phone}</p>
              <p className="text-ink/80">{order.customer.email}</p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-ink/50 mb-2">Delivery Address</h4>
              <p className="text-ink font-bold">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p className="text-ink/80">{order.shippingAddress.line2}</p>}
              <p className="text-ink/80">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-ink/80">India</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line font-mono text-ink/60 uppercase font-semibold text-[11px]">
                  <th className="pb-3 w-1/2">Artwork / Plate</th>
                  <th className="pb-3 text-center">Ref</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Price (₹)</th>
                  <th className="pb-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {order.items.map((item, idx) => {
                  const itemUnitRs = Math.round(item.pricePaise / 100);
                  const itemTotalRs = itemUnitRs * item.qty;
                  return (
                    <tr key={idx} className="py-3">
                      <td className="py-3 pr-2">
                        <p className="font-semibold text-ink">{item.name}</p>
                        {item.framing && (
                          <p className="font-mono text-[10px] text-accent uppercase">Framing: {item.framing}</p>
                        )}
                      </td>
                      <td className="py-3 text-center font-mono text-ink/70">{item.ref}</td>
                      <td className="py-3 text-center font-mono text-ink">{item.qty}</td>
                      <td className="py-3 text-right font-mono text-ink/80">₹{itemUnitRs.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right font-mono font-bold text-ink">
                        ₹{itemTotalRs.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-line flex flex-col sm:flex-row justify-between gap-6 text-xs">
            <div className="sm:max-w-xs text-ink/70 space-y-1">
              <p className="font-mono font-bold text-ink uppercase tracking-wider text-[11px]">Artisan Guarantee & Returns</p>
              <p className="leading-relaxed text-[11px]">
                Every piece is handpainted individually by Natasha Gupta. In case of transit damage, please notify within 48 hours with unboxing photos for insured replacement or full refund.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 font-mono">
              <div className="flex justify-between text-ink/80">
                <span>Subtotal:</span>
                <span>₹{subtotalRs.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-ink/80">
                <span>Insured Shipping:</span>
                <span>{shippingRs === 0 ? 'FREE' : `₹${shippingRs}`}</span>
              </div>
              {codFeeRs > 0 && (
                <div className="flex justify-between text-ink/80">
                  <span>COD Fee:</span>
                  <span>₹{codFeeRs}</span>
                </div>
              )}
              {giftWrapRs > 0 && (
                <div className="flex justify-between text-ink/80">
                  <span>Handmade Wrap:</span>
                  <span>₹{giftWrapRs}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-ink text-sm font-bold text-accent">
                <span>Grand Total:</span>
                <span>₹{totalRs.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-dashed border-line text-center font-mono text-[10px] text-ink/60 uppercase tracking-widest">
            AUTHENTIC MITHILA FOLK ART • VERNIKA ENTERPRISES • NATASHA GUPTA STUDIO
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <Footer variant="compact" />
      </div>
    </div>
  );
}
