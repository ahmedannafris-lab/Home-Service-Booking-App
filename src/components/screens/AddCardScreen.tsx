import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, ChevronLeft, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';

interface Props {
  amount: number;
  onBack: () => void;
  onHelp: () => void;
  onPay: (lastFour: string) => void | Promise<void>;
}

export function AddCardScreen({ amount, onBack, onHelp, onPay }: Props) {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const total = `LKR ${amount.toLocaleString('en-US')}`;
  const formattedExpiry = expiry.length > 2 ? `${expiry.slice(0, 2)}/${expiry.slice(2)}` : expiry;
  const inputClass = 'h-12 w-full rounded-xl border border-[#d7e3f4] bg-white px-3 text-base text-[#183553] placeholder:text-[#9aaecb] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  function fillDemoCard() {
    const now = new Date();
    setNumber('4242424242424242');
    setName('Demo Customer');
    setExpiry(`${String(now.getMonth() + 1).padStart(2, '0')}${String((now.getFullYear() + 1) % 100).padStart(2, '0')}`);
    setCvv('123');
    setError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    setError('');
    const month = Number(expiry.slice(0, 2));
    const year = 2000 + Number(expiry.slice(2));
    const now = new Date();
    if (number !== '4242424242424242') return setError('Use the complete demo card number: 4242 4242 4242 4242.');
    if (name.trim().length < 2) return setError('Enter a cardholder name.');
    if (expiry.length !== 4 || month < 1 || month > 12 || year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return setError('Enter the complete expiry as MM/YY, with a future date.');
    if (!/^\d{3}$/.test(cvv)) return setError('Enter a three-digit demo CVV.');
    busy.current = true;
    setPaying(true);
    try {
      await onPay(number.slice(-4));
      setNumber(''); setName(''); setExpiry(''); setCvv('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to record demo payment. Please try again.');
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
        <h1 className="text-base font-bold">Add Card</h1>
        <button type="button" onClick={onHelp} disabled={paying} className="absolute right-4 rounded-full bg-[#e9f0ff] px-3 py-2.5 text-xs font-semibold text-blue-700 disabled:opacity-50">Need Help?</button>
      </header>
      <form noValidate onSubmit={submit} aria-describedby={error ? 'card-payment-error' : undefined} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <div aria-hidden="true" className="relative mb-5 overflow-hidden rounded-[22px] bg-[#1053bd] p-5 text-white shadow-[0_12px_24px_rgba(16,83,189,0.22)]">
            <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full bg-white/5" /><div className="absolute -bottom-24 right-0 h-44 w-44 rounded-full bg-white/5" />
            <div className="relative flex items-center justify-between"><span className="text-xs font-semibold tracking-wide">CREDIT / DEBIT</span><span className="rounded bg-white/20 px-2 py-1 text-[10px] font-semibold">Demo</span></div>
            <div className="my-5 h-6 w-8 rounded-md bg-[#f0d477]" />
            <p className="relative font-mono text-lg tracking-widest">•••• •••• •••• {number.slice(-4).padStart(4, '•')}</p>
            <div className="relative mt-4 flex items-end justify-between gap-4"><div className="min-w-0"><p className="text-[10px] text-blue-100">CARDHOLDER</p><p className="truncate text-xs font-bold uppercase">{name.trim() || 'YOUR NAME'}</p></div><div className="shrink-0 text-right"><p className="text-[10px] text-blue-100">EXPIRES</p><p className="text-xs font-bold">{formattedExpiry || 'MM/YY'}</p></div></div>
          </div>
          <div className="mb-4 rounded-xl bg-blue-50 px-3 py-2.5 text-xs leading-5 text-blue-800"><p>Demo checkout: use 4242 4242 4242 4242, a future expiry, and any three-digit CVV. No money is charged.</p><button type="button" onClick={fillDemoCard} disabled={paying} className="mt-2 rounded-lg border border-blue-200 bg-white px-3 py-2 font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50">Use demo card</button></div>
          <fieldset disabled={paying} className="space-y-4">
            <legend className="sr-only">Demo card details</legend>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#526681]">Card Number</span><span className="relative block"><input required type="text" inputMode="numeric" autoComplete="off" value={number.replace(/(.{4})/g, '$1 ').trim()} maxLength={19} placeholder="0000 0000 0000 0000" onChange={event => setNumber(event.target.value.replace(/\D/g, '').slice(0, 16))} className={`${inputClass} pr-11`} /><CreditCard aria-hidden="true" size={18} className="pointer-events-none absolute right-3 top-4 text-[#879bb9]" /></span></label>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#526681]">Name on Card</span><input required type="text" autoComplete="off" maxLength={60} value={name} placeholder="As shown on your card" onChange={event => setName(event.target.value)} className={inputClass} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#526681]">Expiry Date</span><input required type="text" inputMode="numeric" autoComplete="off" maxLength={5} value={formattedExpiry} placeholder="MM/YY" onChange={event => setExpiry(event.target.value.replace(/\D/g, '').slice(0, 4))} className={inputClass} /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#526681]">CVV</span><span className="relative block"><input required type="password" inputMode="numeric" autoComplete="off" maxLength={3} value={cvv} placeholder="•••" onChange={event => setCvv(event.target.value.replace(/\D/g, '').slice(0, 3))} className={`${inputClass} pr-10`} /><LockKeyhole aria-hidden="true" size={16} className="pointer-events-none absolute right-3 top-4 text-[#879bb9]" /></span></label>
            </div>
          </fieldset>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#ccebdc] bg-[#e4f5ec] p-3"><span className="rounded-full bg-[#ccebdc] p-2 text-emerald-700"><ShieldCheck size={17} aria-hidden="true" /></span><p className="text-xs leading-5 text-[#367552]"><strong>Demo payment protection.</strong> Only the last four digits are passed to checkout. Card details are not saved.</p></div>
        </div>
        <footer className="shrink-0 border-t border-[#e4ebf5] bg-[#f5f8fd] px-4 pb-5 pt-3">
          {error && <p id="card-payment-error" role="alert" className="mb-3 rounded-xl bg-rose-50 p-3 text-sm leading-5 text-rose-700">{error}</p>}
          <div className="mb-3 flex items-center justify-between gap-3"><span className="text-xs text-[#7386a1]">Total Amount</span><strong className="text-xl">{total}</strong></div><button type="submit" disabled={paying} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#1053bd] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">{paying ? 'Processing…' : `Demo Pay ${total}`}{!paying && <ArrowRight size={18} aria-hidden="true" />}</button>
        </footer>
      </form>
    </section>
  );
}
