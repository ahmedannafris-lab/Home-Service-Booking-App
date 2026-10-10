import { ArrowLeft, ArrowRight, CalendarCheck, ShieldCheck, Star } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function VerifiedProOnboardingScreen({ onNext, onBack, onSkip }: Props) {
  return (
    <section aria-label="Onboarding: Verified professionals" className="flex min-h-0 flex-1 flex-col bg-white text-[#10223e]">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="relative overflow-hidden rounded-br-[20px] bg-[#e4f0ff]">
          <img src="/onboarding/screen-2.png" alt="Top-rated home repair professional with ID and background verification, and an instantly confirmed booking slot" className="block h-auto w-full" />
          {/* The supplied artwork includes a Skip label; make it actionable. */}
          <button type="button" onClick={onSkip} aria-label="Skip onboarding" className="absolute left-[4.5%] top-[10.4%] h-[8.7%] w-[15.3%] rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" />
        </div>
        <div className="px-5 pb-5 pt-6 text-center">
          <h1 className="text-[22px] font-bold leading-tight tracking-tight">Book with Confidence</h1>
          <p className="mx-auto mt-2 max-w-80 text-xs leading-5 text-[#60708a]">Choose verified, top-rated professionals and find a booking slot that works for you.</p>
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {[
              { title: 'Verified Pros', detail: 'ID & background', Icon: ShieldCheck },
              { title: 'Top Rated', detail: 'Reviewed experts', Icon: Star },
              { title: 'Easy Booking', detail: 'Choose your slot', Icon: CalendarCheck },
            ].map(({ title, detail, Icon }) => <div key={title} className="flex flex-col items-center rounded-2xl bg-[#f3f4f6] px-2 py-4"><span className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-[#d4e5ff] text-[#0756c7]"><Icon size={16} /></span><h2 className="text-xs font-semibold">{title}</h2><p className="mt-1 text-[10px] leading-4 text-[#60708a]">{detail}</p></div>)}
          </div>
        </div>
      </div>
      <footer className="shrink-0 bg-white px-5 pb-5 pt-3">
        <div aria-label="Step 2 of 3" className="mb-5 flex items-center justify-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#d4e2fa]" /><span aria-current="step" className="h-1.5 w-6 rounded-full bg-[#1058bd]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d4e2fa]" /></div>
        <button type="button" onClick={onNext} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1058bd] px-4 py-3 text-sm font-semibold text-white shadow-[0_7px_16px_#1058bd30] hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Next<ArrowRight size={17} /></button>
        <div className="mt-3 flex items-center justify-between gap-3"><button type="button" onClick={onBack} className="flex items-center gap-1 px-2 py-2 text-xs text-[#365d92]"><ArrowLeft size={14} />Back</button><button type="button" onClick={onSkip} className="px-2 py-2 text-xs text-[#365d92]">Skip to exploring services</button></div>
      </footer>
    </section>
  );
}
