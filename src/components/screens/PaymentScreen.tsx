import { useState } from 'react';
import { ArrowRight, Banknote, CalendarDays, ChevronLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { Booking, ServiceItem } from '../../types';
import { AddCardScreen } from './AddCardScreen';
import { OnlinePaymentScreen } from './OnlinePaymentScreen';
import type { OnlinePaymentDetails } from './OnlinePaymentScreen';

export type PaymentMethod = 'card' | 'online' | 'cash';
interface Props {
  booking: Booking;
  service: ServiceItem;
  onBack: () => void;
  onEdit: () => void;
  onHelp: () => void;
  onPay: (method: PaymentMethod, card: string, online?: OnlinePaymentDetails) => void | Promise<void>;
}

export function PaymentScreen({ booking, service, onBack, onEdit, onHelp, onPay }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [card, setCard] = useState('4321');
  const [addingCard, setAddingCard] = useState(false);
  const [payingOnline, setPayingOnline] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const handlePay = async () => {
    if (paying) return;
    if (method === 'card') {
      setAddingCard(true);
      return;
    }
    if (method === 'online') {
      setPayingOnline(true);
      return;
    }
    setPaying(true); setError('');
    try { await onPay(method, card); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to save payment'); }
    finally { setPaying(false); }
  };
  const amount = `LKR ${booking.price.toLocaleString('en-US')}`;
  if (payingOnline) {
    return <OnlinePaymentScreen booking={booking} onBack={() => setPayingOnline(false)} onHelp={onHelp} onPay={details => onPay('online', '', details)} />;
  }
  if (addingCard) {
    return (
      <AddCardScreen
        amount={booking.price}
        onBack={() => setAddingCard(false)}
        onHelp={onHelp}
        onPay={async (lastFour) => {
          await onPay('card', lastFour);
          setCard(lastFour);
        }}
      />
    );
  }
  return (
    <section className="flex flex-1 min-h-0 flex-col bg-[#f6f8fb] text-[#213e60]">
      <IOSStatusBar showIsland={false} />
      <header className="relative flex h-16 shrink-0 items-center justify-center px-5">
        <button onClick={onBack} aria-label="Back" className="absolute left-5 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white cursor-pointer"><ChevronLeft size={18} /></button>
        <h1 className="text-lg font-bold">Payment</h1>
        <button onClick={onHelp} className="absolute right-5 rounded-full bg-blue-50 px-3 py-2 text-[10px] font-semibold text-blue-500 cursor-pointer">Need Help?</button>
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-3">
        <p className="mb-3 text-xs text-amber-700">Demo checkout: card and online payments are simulated. No money is charged.</p>
        {error && <p role="alert" className="mb-3 text-xs text-rose-700">{error}</p>}
        <div className="mb-2 flex items-center justify-between"><h2 className="text-[11px] font-bold tracking-wider text-[#95a7bd]">BOOKING SUMMARY</h2><button onClick={onEdit} className="text-xs font-semibold text-blue-500 cursor-pointer">Edit</button></div>
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_8px_#18355308]">
          <img src={service.image} alt={booking.serviceTitle} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="text-[13px] font-bold">{booking.serviceTitle}</h3><span className="shrink-0 text-[10px] font-bold text-blue-500">{amount}</span></div><p className="mt-1 flex items-center gap-1 text-[10px] text-[#8b9db5]"><CalendarDays size={12} />{booking.date} · {booking.timeSlot}</p><p className="mt-1 text-[10px] text-[#a4b2c6]">{service.categoryId === 'cleaning' ? 'Deep Clean Standard • 2 Cleaners' : `${service.categoryName} • ${service.duration}`}</p></div>
        </div>
        <h2 className="mt-4 text-[13px] font-bold">Choose Payment Method</h2><p className="mb-3 text-[10px] text-[#9baabd]">Select how you want to complete your order</p>
        <div role="radiogroup" aria-label="Payment method" className="space-y-3">
          {([
            { id: 'card', title: 'Credit / Debit Card', description: 'Pay securely with your card', badge: 'Instant' },
            { id: 'online', title: 'Online Payment', description: 'Bank transfer / Genie / eZ Cash', badge: '' },
            { id: 'cash', title: 'Cash on Service', description: 'Pay cash after service completion with receipt', badge: 'Post-pay' },
          ] as const).map((option) => (
            <div key={option.id} className={`overflow-hidden rounded-2xl border transition-colors ${method === option.id ? 'border-blue-500 bg-[#e8f1ff] ring-1 ring-blue-400' : 'border-slate-200 bg-white shadow-[0_2px_6px_#18355306]'}`}>
              <button role="radio" aria-checked={method === option.id} onClick={() => setMethod(option.id)} className="flex w-full items-start gap-2.5 p-3 text-left cursor-pointer">
                <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${method === option.id ? 'border-blue-500' : 'border-slate-300'}`}>{method === option.id && <span className="h-2 w-2 rounded-full bg-blue-500" />}</span>
                <span className="flex-1"><span className="flex items-center gap-2 text-[12px] font-bold">{option.title}{option.badge && <span className={`rounded px-1.5 py-0.5 text-[8px] ${option.id === 'cash' ? 'bg-amber-50 text-amber-600' : 'bg-blue-100 text-blue-500'}`}>{option.badge}</span>}</span><span className="mt-1 block text-[10px] text-[#90a0b6]">{option.description}</span></span>
                {option.id === 'card' ? <span className="flex gap-1"><span className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[8px] font-bold italic text-blue-800">VISA</span><span className="relative h-4 w-6 rounded bg-white"><span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-red-500" /><span className="absolute left-2.5 top-1 h-2 w-2 rounded-full bg-amber-400" /></span></span> : option.id === 'online' ? <span className="flex gap-1 text-[8px]"><span className="rounded bg-slate-50 px-1 py-1">UPI</span><span className="rounded bg-emerald-50 px-1 py-1 text-emerald-600">eZ Cash</span></span> : <span className="rounded-lg bg-emerald-50 p-1.5 text-emerald-500"><Banknote size={15} /></span>}
              </button>
              {option.id === 'card' && method === 'card' && <div className="flex items-center gap-2 border-t border-blue-100 px-3 py-2 text-xs"><CreditCard size={14} className="text-blue-500" /><span className="flex-1">Enter card details at checkout</span><button onClick={() => setAddingCard(true)} className="font-semibold text-blue-500 cursor-pointer">Add Card</button></div>}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-[#e6f7f1] p-3"><span className="rounded-full bg-emerald-100 p-2 text-emerald-600"><ShieldCheck size={17} /></span><div><h3 className="text-xs font-bold">Demo Checkout</h3><p className="mt-1 text-xs leading-relaxed text-[#7a91a4]">Card and online payments are simulated. No money is charged and full card details are not saved.</p></div></div>
      </div>
      <footer className="shrink-0 px-5 pb-3 pt-1"><div className="mb-4 flex items-center justify-between"><div><p className="text-[11px] text-[#91a1b8]">Total Amount</p><p className="mt-1 text-[8px] text-emerald-600">Includes taxes & service fees</p></div><strong className="text-xl">{amount}</strong></div><button onClick={handlePay} disabled={paying} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0860c9] py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{paying ? 'Saving...' : method === 'card' ? 'Continue to Card' : method === 'online' ? 'Continue to Online Payment' : method === 'cash' ? 'Confirm Booking' : `Demo Pay ${amount}`}<ArrowRight size={18} /></button></footer>
    </section>
  );
}
