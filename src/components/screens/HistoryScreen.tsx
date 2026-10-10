import React, { useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ChevronRight, Clock3, FileText, RotateCcw, Trash2, X } from 'lucide-react';
import { IOSStatusBar } from '../common/iOSStatusBar';
import { Booking } from '../../types';

const escapePdfText = (text: string) => text
  .normalize('NFKD')
  .replace(/[^\x20-\x7E]/g, '')
  .replace(/([\\()])/g, '\\$1');

const wrapReceiptText = (label: string, value: string, maxLength = 72) => {
  const words = `${label}: ${value}`.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    if (line && `${line} ${word}`.length > maxLength) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const createReceiptPdf = (booking: Booking) => {
  const details = [
    ...wrapReceiptText('Booking ID', booking.id),
    ...wrapReceiptText('Issued', booking.createdAt),
    '',
    ...wrapReceiptText('Service', booking.serviceTitle),
    ...wrapReceiptText('Category', booking.categoryName),
    ...wrapReceiptText('Specialist', booking.specialist.name),
    ...wrapReceiptText('Appointment', `${booking.date}, ${booking.timeSlot}`),
    ...wrapReceiptText('Service address', booking.address),
    ...wrapReceiptText('Booking status', booking.status.replace('_', ' ')),
  ];
  const contentLines = [
    'BT /F2 22 Tf 50 742 Td (HOMEMATE) Tj ET',
    'BT /F1 12 Tf 50 720 Td (HOME SERVICE RECEIPT) Tj ET',
    'BT /F1 10 Tf 50 698 Td (Thank you for choosing HomeMate.) Tj ET',
    'BT /F1 10 Tf 50 674 Td (----------------------------------------------------------------) Tj ET',
  ];
  let y = 650;

  for (const line of details) {
    if (line) {
      contentLines.push(`BT /F1 11 Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`);
    }
    y -= 19;
  }

  contentLines.push(
    `BT /F2 14 Tf 50 ${y - 4} Td (Service total: LKR ${booking.price.toLocaleString('en-US')}) Tj ET`,
    `BT /F1 9 Tf 50 70 Td (Receipt for booking ${escapePdfText(booking.id)}.) Tj ET`,
  );
  const stream = contentLines.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};

interface HistoryScreenProps {
  bookings: Booking[];
  onDelete: (bookingId: string) => void;
  onRebook: (booking: Booking) => void;
  onBack?: () => void;
  showToast: (msg: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  bookings,
  onDelete,
  onRebook,
  onBack,
  showToast,
}) => {
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const completedCount = bookings.filter((booking) => booking.status === 'completed').length;

  const confirmDelete = () => {
    if (!bookingToDelete) return;
    onDelete(bookingToDelete.id);
    setBookingToDelete(null);
  };

  const downloadReceipt = (booking: Booking) => {
    try {
      const receiptUrl = URL.createObjectURL(createReceiptPdf(booking));
      const downloadLink = document.createElement('a');
      downloadLink.href = receiptUrl;
      downloadLink.download = `HomeMate-Receipt-${booking.id}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(receiptUrl), 1000);
      showToast(`Receipt for ${booking.serviceTitle} downloaded.`);
    } catch {
      showToast('Unable to download this receipt. Please try again.');
    }
  };

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-x-hidden overflow-y-auto bg-slate-50 pb-6 no-scrollbar scroll-y-only">
      <header className="sticky top-0 z-40 shrink-0 border-b border-slate-100 bg-white/95 shadow-xs backdrop-blur-xl">
        <IOSStatusBar />
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
                aria-label="Go Back"
              >
                <ArrowLeft size={22} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold text-slate-900">Service History</h1>
              <p className="text-[10px] text-slate-500">Your HomeMate service activity</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast('Preparing your service history export...')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100"
          >
            <ArrowDownToLine size={15} />
            Export
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-4 px-5 pb-8 pt-5">
        <section
          className="relative overflow-hidden rounded-2xl p-4 text-white shadow-md shadow-blue-900/10"
          style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #4338ca 100%)' }}
        >
          <div className="absolute -right-5 -top-8 h-32 w-32 rounded-full border-[18px] border-white/10" />
          <div className="relative flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold" style={{ color: '#dbeafe' }}>Your service journey</p>
              <p className="mt-1 text-2xl font-extrabold" style={{ color: '#ffffff' }}>
                {bookings.length} <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>services</span>
              </p>
              <p className="mt-1 text-[11px] font-medium" style={{ color: '#dbeafe' }}>
                {completedCount} completed · protected by HomeCare
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-white/30" style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}>
              <FileText size={24} color="#ffffff" />
            </div>
          </div>
        </section>

        <div className="flex items-end justify-between px-1">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Recent services</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">Invoices and quick re-booking in one place</p>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-xs">{bookings.length} total</span>
        </div>

        {bookings.length === 0 ? (
          <section className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Clock3 size={26} />
            </span>
            <h3 className="mt-4 text-sm font-bold text-slate-900">No service history yet</h3>
            <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-slate-500">Your booked services will appear here so you can find invoices and book again.</p>
          </section>
        ) : bookings.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-bold tracking-wide text-slate-400">{item.id}</span>
                <span className="text-[11px] text-slate-400">{item.createdAt}</span>
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold leading-snug text-slate-900">{item.serviceTitle}</h3>
                  <p className="mt-1 text-xs text-slate-500">{item.categoryName} <span className="px-0.5 text-slate-300">•</span> {item.specialist.name}</p>
                </div>
                <span className="shrink-0 text-sm font-extrabold text-slate-900">LKR {item.price.toLocaleString()}</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => downloadReceipt(item)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700"
                >
                  <FileText size={15} />
                  Invoice
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBookingToDelete(item)}
                    aria-label={`Delete ${item.serviceTitle} from history`}
                    title="Delete from history"
                    className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => onRebook(item)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:scale-95"
                  >
                    <RotateCcw size={14} />
                    Re-Book
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
      </main>

      {bookingToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm"
          onClick={() => setBookingToDelete(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-history-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Trash2 size={19} />
                </span>
                <div>
                  <h2 id="delete-history-title" className="text-sm font-bold text-slate-900">Remove from history?</h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    “{bookingToDelete.serviceTitle}” will be hidden from your history. This will not cancel the booking.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                aria-label="Close confirmation"
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="h-10 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
              >
                Delete history item
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
