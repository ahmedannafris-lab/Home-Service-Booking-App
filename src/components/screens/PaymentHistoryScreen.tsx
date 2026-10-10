import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Receipt } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { PaymentScreen } from './PaymentScreen';
import { SERVICES, SPECIALISTS } from '../../data/mockData';
import type { Booking } from '../../types';

interface PaymentRecord {
  _id: string;
  bookingId: { _id: string; serviceTitle: string; date: string; timeSlot: string; status: Booking['status'] } | null;
  method: 'cash' | 'card' | 'online';
  status: string;
  amountMinor: number;
  currency: string;
  createdAt: string;
  paidAt?: string;
  cardLastFour?: string;
  onlineProvider?: string;
  demo: boolean;
}

async function request(path = '', method = 'GET', body?: object) {
  const token = localStorage.getItem('homemate_token') || sessionStorage.getItem('homemate_token');
  if (!token) throw new Error('Please sign in to view your payments.');
  const response = await fetch(`http://localhost:5000/api/payments${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Unable to process payment request');
  return data;
}

const amount = (payment: PaymentRecord) => `${payment.currency} ${(payment.amountMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const statusLabel = (payment: PaymentRecord) => payment.status === 'due' ? 'Payment due' : payment.status === 'demo_paid' ? 'Demo paid' : payment.status;

export function PaymentHistoryScreen({ onBack }: { onBack: () => void }) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [receipt, setReceipt] = useState<PaymentRecord | null>(null);
  const [editing, setEditing] = useState<PaymentRecord | null>(null);
  const [deleting, setDeleting] = useState<PaymentRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  async function load() {
    setLoading(true); setError('');
    try { setPayments((await request()).payments); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load payments'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function view(payment: PaymentRecord) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { setReceipt((await request(`/${payment._id}`)).payment); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load receipt'); }
    finally { lock.current = false; setBusy(false); }
  }

  if (editing?.bookingId) {
    const booking: Booking = {
      id: editing.bookingId._id, serviceId: '', serviceTitle: editing.bookingId.serviceTitle,
      categoryName: '', date: editing.bookingId.date, timeSlot: editing.bookingId.timeSlot,
      address: '', price: editing.amountMinor / 100, status: editing.bookingId.status,
      specialist: SPECIALISTS.alex, createdAt: editing.createdAt,
    };
    return <PaymentScreen booking={booking} service={{ ...SERVICES[0], title: booking.serviceTitle, price: booking.price }}
      onBack={() => setEditing(null)} onHelp={() => window.alert('This is demo checkout. No money is charged.')}
      onEdit={() => window.alert('Booking details cannot be changed from payment history.')}
      onPay={async (method, card, online) => {
        const result = await request(`/${editing._id}`, 'PATCH', { method,
          ...(method === 'card' ? { cardLastFour: card } : {}),
          ...(method === 'online' ? { onlineProvider: online?.provider, mobileNumber: online?.mobileNumber } : {}),
        });
        setPayments(previous => previous.map(payment => payment._id === editing._id ? { ...result.payment, bookingId: editing.bookingId } : payment));
        setNotice('Payment updated successfully.'); setEditing(null);
      }} />;
  }

  return <div className="flex-1 min-h-0 flex flex-col bg-slate-50 text-slate-900">
    <header className="bg-white shrink-0 border-b border-slate-100"><IOSStatusBar />
      <div className="flex items-center gap-3 px-5 py-4"><button aria-label="Go back" onClick={receipt ? () => setReceipt(null) : onBack} className="p-2 rounded-full bg-slate-50"><ArrowLeft size={22} /></button>
        <h1 className="text-lg font-bold">{receipt ? 'Payment Receipt' : 'Payment History'}</h1></div>
    </header>
    <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
      {error && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}<button onClick={() => void load()} className="block mt-2 font-bold underline">Retry</button></div>}
      {notice && <p role="status" className="text-sm text-emerald-700">{notice}</p>}
      {receipt ? <article className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
        <Receipt className="text-blue-600" size={32} /><h2 className="font-bold text-xl">{amount(receipt)}</h2>
        <p>{receipt.bookingId?.serviceTitle || 'Booking unavailable'}</p>
        <dl className="text-sm space-y-3">
          {Object.entries({ 'Payment ID': receipt._id, 'Booking ID': receipt.bookingId?._id || 'Unavailable', Status: statusLabel(receipt), Method: receipt.method,
            ...(receipt.onlineProvider ? { Provider: receipt.onlineProvider } : {}), ...(receipt.cardLastFour ? { Card: `•••• ${receipt.cardLastFour}` } : {}),
            Created: new Date(receipt.createdAt).toLocaleString(), ...(receipt.paidAt ? { Paid: new Date(receipt.paidAt).toLocaleString() } : {}) }).map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="break-all">{value}</dd></div>)}
        </dl>{receipt.demo && <p className="text-xs text-blue-700 bg-blue-50 p-3 rounded-xl">Demo payment record. No money was charged.</p>}
      </article> : <>
        <p className="text-sm text-slate-500">Your payments and receipts. Pending demo payments can be edited or deleted.</p>
        {loading ? <p role="status">Loading payments…</p> : !error && payments.length === 0 ? <div className="bg-white rounded-2xl p-6 text-center"><Receipt className="mx-auto mb-3 text-blue-600" /><h2 className="font-semibold">No payments yet</h2><p className="text-sm text-slate-500 mt-2">Payments appear here after checkout.</p></div> : payments.map(payment => <article key={payment._id} className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
          <div className="flex justify-between gap-3"><h2 className="font-semibold">{payment.bookingId?.serviceTitle || 'Booking unavailable'}</h2><span className="font-bold whitespace-nowrap">{amount(payment)}</span></div>
          <p className="text-xs text-slate-500">{new Date(payment.createdAt).toLocaleDateString()} · {payment.method}</p>
          <span className={`inline-block text-xs px-3 py-1 rounded-full ${payment.status === 'due' ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-700'}`}>{statusLabel(payment)}</span>
          <div className="flex gap-4 text-sm font-semibold"><button disabled={busy} onClick={() => void view(payment)} className="text-blue-700 disabled:opacity-50">View receipt</button>
            {payment.status === 'due' && payment.demo && <><button disabled={busy || payment.bookingId?.status !== 'scheduled'} onClick={() => { setNotice(''); setEditing(payment); }} className="text-blue-700 disabled:opacity-40">Edit</button><button disabled={busy} onClick={() => { setError(''); setDeleting(payment); }} className="text-rose-600">Delete</button></>}
          </div>
        </article>)}
      </>}
    </div>
    {deleting && <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="absolute inset-0 z-50 bg-slate-950/40 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl p-5 space-y-4 w-full"><h2 id="delete-title" className="font-bold">Delete pending payment?</h2><p className="text-sm text-slate-600">This removes the payment record. Your booking stays unpaid and is not cancelled.</p>
        <div className="flex gap-4"><button disabled={busy} onClick={() => setDeleting(null)}>Keep payment</button><button disabled={busy} className="text-rose-600 font-bold" onClick={async () => {
          if (lock.current) return;
          lock.current = true; setBusy(true);
          try { await request(`/${deleting._id}`, 'DELETE'); setPayments(previous => previous.filter(payment => payment._id !== deleting._id)); setNotice('Pending payment deleted.'); }
          catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete payment'); }
          finally { lock.current = false; setBusy(false); setDeleting(null); }
        }}>{busy ? 'Deleting…' : 'Delete payment'}</button></div>
      </div>
    </div>}
  </div>;
}
