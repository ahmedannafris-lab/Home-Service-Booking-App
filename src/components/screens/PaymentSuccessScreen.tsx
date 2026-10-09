import { Check, ChevronLeft, Mail, Sparkles } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { Booking } from '../../types';
import type { PaymentMethod } from './PaymentScreen';

interface Props {
  booking: Booking;
  method: PaymentMethod;
  card: string;
  paymentId?: string;
  onViewBooking: () => void;
  onBackToHome: () => void;
}

export function PaymentSuccessScreen({ booking, method, card, paymentId, onViewBooking, onBackToHome }: Props) {
  const title = !paymentId ? 'No Payment Recorded' : method === 'cash' ? 'Booking Confirmed' : 'Demo Payment Successful';
  return (
    <section className="payment-success-screen flex flex-1 min-h-0 flex-col bg-[#f6f8fa] text-[#183553]">
      <IOSStatusBar showIsland={false} />
      <header className="relative flex h-14 shrink-0 items-center justify-center px-6">
        <button onClick={onBackToHome} aria-label="Back to home" className="absolute left-5 rounded-lg p-2 hover:bg-slate-100 cursor-pointer"><ChevronLeft size={20} /></button>
        <h1 className="text-base font-bold">{title}</h1>
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
        <div className="flex flex-col items-center pt-8 pb-5 text-center">
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-full border border-emerald-100 bg-[#e7f8f1] text-[#18a878] shadow-[0_0_30px_#e7f8f1]" aria-hidden="true"><Check size={36} strokeWidth={3} /></div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 text-[12px] text-[#7c8eaa]">{!paymentId ? 'Create a booking and complete demo checkout first.' : method === 'cash' ? 'Pay your specialist after service completion.' : 'Simulated payment recorded. No money was charged.'}</p>
        </div>
        <dl className="rounded-[18px] border border-[#e2e8f0] bg-white px-4 py-3 text-[11px] shadow-[0_5px_12px_#18355305]">
          {[
            [method === 'cash' ? 'Payment Status' : 'Payment ID', paymentId ? method === 'cash' ? 'Due after service' : paymentId : 'Not recorded'],
            ['Booking ID', booking.id],
            ['Service', <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-blue-500" />{booking.serviceTitle}</span>],
            ['Date', booking.date],
            ['Time', booking.timeSlot],
            ['Amount', <strong className="text-[13px]">LKR {booking.price.toLocaleString('en-US')}</strong>],
            ['Payment Method', method === 'card' ? <span className="flex items-center gap-1.5"><span className="rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold italic text-blue-700">VISA</span>•••• {card}</span> : method === 'online' ? 'Online Payment' : 'Cash on Service'],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex min-h-9 items-center justify-between gap-3 border-b border-slate-100 last:border-0">
              <dt className="text-[#7c8eaa]">{label}</dt><dd className="text-right">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-[#f1f7ff] px-3 py-3 text-[10px] text-[#607e9e]">
          <span className="rounded-md bg-white p-1 text-blue-500"><Mail size={16} /></span>
          Demo checkout does not send email receipts.
        </div>
      </div>
      <footer className="shrink-0 px-6 pt-3 pb-7 space-y-3">
        <button onClick={onViewBooking} className="w-full rounded-[16px] bg-[#0860c9] py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 hover:bg-blue-700 active:scale-[0.99] transition cursor-pointer">View Booking</button>
        <button onClick={onBackToHome} className="w-full rounded-[16px] border border-slate-200 bg-white py-4 text-sm font-semibold hover:bg-slate-50 cursor-pointer">Back to Home</button>
      </footer>
    </section>
  );
}
