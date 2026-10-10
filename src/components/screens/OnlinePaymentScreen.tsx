import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, ChevronLeft, House, Landmark, ShieldCheck } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import type { Booking } from '../../types';

export type OnlineProvider = 'genie' | 'ezcash' | 'bank';
export interface OnlinePaymentDetails {
  provider: OnlineProvider;
  mobileNumber?: string;
}
interface Props {
  booking: Booking;
  onBack: () => void;
  onHelp: () => void;
  onPay: (details: OnlinePaymentDetails) => void | Promise<void>;
}
const options = [
  { id: 'genie', title: 'Genie', description: 'Pay from your Genie wallet', mark: 'G' },
  { id: 'ezcash', title: 'eZ Cash', description: 'Pay from your mobile wallet', mark: 'eZ' },
  { id: 'bank', title: 'Bank Transfer', description: 'Pay from your bank account', mark: '' },
] as const;

export function OnlinePaymentScreen({ booking, onBack, onHelp, onPay }: Props) {
  const [provider, setProvider] = useState<OnlineProvider>('genie');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const busy = useRef(false);
  const amount = `LKR ${booking.price.toLocaleString('en-US')}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    setError('');
    if (provider !== 'bank' && !/^7\d{8}$/.test(mobile)) {
      setError('Enter nine digits starting with 7, for example 771234567.');
      return;
    }
    busy.current = true;
    setPaying(true);
    try {
      await onPay({ provider, ...(provider !== 'bank' ? { mobileNumber: `+94${mobile}` } : {}) });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to record demo payment. Please retry.');
    } finally {
      busy.current = false;
      setPaying(false);
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#f5f8fd] text-[#172744]">
      <IOSStatusBar showIsland={false} />
      <header className="relative flex h-16 shrink-0 items-center justify-center px-4">
        <button type="button" onClick={onBack} disabled={paying} aria-label="Back to payment methods" className="absolute left-4 grid h-10 w-10 place-items-center rounded-full border border-slate-100 bg-white shadow-sm disabled:opacity-50"><ChevronLeft size={20} /></button>
        <h1 className="text-base font-bold">Online Payment</h1>
        <button type="button" onClick={onHelp} disabled={paying} className="absolute right-4 rounded-full bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 disabled:opacity-50">Need Help?</button>
      </header>
      <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600"><House size={21} /></span>
            <div className="min-w-0 flex-1"><h2 className="text-sm font-bold">{booking.serviceTitle}</h2><p className="mt-1 text-xs text-[#7c8eaa]">{booking.date} · {booking.timeSlot}</p></div>
            <strong className="shrink-0 text-xs text-blue-600">{amount}</strong>
          </div>
          <fieldset disabled={paying} className="mt-5">
            <legend className="text-base font-bold">Pay with</legend>
            <p className="mb-3 text-xs text-[#7c8eaa]">Choose your preferred online method</p>
            <div className="space-y-3">
              {options.map(option => (
                <label key={option.id} className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-2xl border p-3 shadow-sm transition ${provider === option.id ? 'border-blue-500 bg-[#eaf1ff] ring-1 ring-blue-400' : 'border-slate-200 bg-white'}`}>
                  <input type="radio" name="online-provider" value={option.id} checked={provider === option.id} onChange={() => { setProvider(option.id); setError(''); }} className="h-4 w-4 shrink-0 accent-blue-600" />
                  <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-sm font-bold ${option.id === 'ezcash' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : option.id === 'bank' ? 'border-slate-200 bg-slate-100 text-slate-600' : 'border-blue-100 bg-white text-blue-600'}`}>{option.id === 'bank' ? <Landmark size={19} /> : option.mark}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{option.title}</span><span className="mt-1 block text-xs text-[#7c8eaa]">{option.description}</span></span>
                  {option.id !== 'bank' && <span className="rounded bg-blue-100 px-1.5 py-1 text-[10px] font-semibold text-blue-700">Instant</span>}
                </label>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
              {provider === 'bank' ? <><h3 className="text-xs font-semibold">Demo bank transfer</h3><p className="mt-2 text-xs leading-5 text-[#7c8eaa]">Continue to record a simulated bank transfer. No bank account details or transfer receipt are needed. Do not send money.</p></> : <>
                <label htmlFor="online-mobile" className="mb-2 block text-xs font-semibold text-[#526681]">Mobile number</label>
                <div className="flex items-center gap-2"><span className="grid h-12 place-items-center rounded-xl bg-blue-50 px-3 text-sm font-bold text-blue-700">+94</span><input id="online-mobile" type="tel" inputMode="numeric" autoComplete="off" maxLength={9} value={mobile} onChange={event => setMobile(event.target.value.replace(/\D/g, '').slice(0, 9))} placeholder="7XXXXXXXX" aria-describedby="online-mobile-hint" className="h-12 min-w-0 flex-1 rounded-xl border border-[#d7e3f4] px-3 text-base outline-none placeholder:text-[#9aaecb] focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>
                <p id="online-mobile-hint" className="mt-3 text-xs leading-5 text-[#7c8eaa]">Demo only. No request will be sent to your {provider === 'genie' ? 'Genie' : 'eZ Cash'} app. Use a test number such as 771234567.</p>
              </>}
            </div>
          </fieldset>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-[#e4f5ec] p-3"><span className="rounded-full bg-emerald-100 p-2 text-emerald-700"><ShieldCheck size={17} /></span><p className="text-xs leading-5 text-emerald-800"><strong>Demo checkout.</strong> No money is charged. Only your provider and the last four digits of your test number are saved.</p></div>
        </div>
        <footer className="shrink-0 border-t border-slate-200 bg-[#f5f8fd] px-4 pb-5 pt-3">
          {error && <p role="alert" className="mb-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <div className="mb-3 flex items-center justify-between"><span className="text-xs text-[#7c8eaa]">Total Amount</span><strong className="text-xl">{amount}</strong></div>
          <button type="submit" disabled={paying} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#1053bd] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">{paying ? 'Processing…' : `Demo Pay ${amount}`}{!paying && <ArrowRight size={18} />}</button>
        </footer>
      </form>
    </section>
  );
}
