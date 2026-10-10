import { ArrowRight, Droplet, Grid2X2, MapPin, PaintRoller, Search, Snowflake, Sparkles, Star, Wrench, Zap } from 'lucide-react';

interface Props {
  onNext: () => void;
  onSkip: () => void;
  illustration?: string;
}

const services = [
  { label: 'Plumbing', Icon: Droplet },
  { label: 'Electrical', Icon: Zap },
  { label: 'Cleaning', Icon: Sparkles },
  { label: 'AC Repair', Icon: Snowflake },
  { label: 'Painting', Icon: PaintRoller },
  { label: 'Handyman', Icon: Wrench },
];
const features = [
  { title: 'Every Service', detail: 'Home Repairs', Icon: Grid2X2 },
  { title: 'Top Rated', detail: 'Reviewed Pros', Icon: Star },
  { title: 'Near You', detail: 'Local Experts', Icon: MapPin },
];

export function FindProOnboardingScreen({ onNext, onSkip, illustration }: Props) {
  return (
    <section aria-label="Onboarding: Find the Right Pro" className="flex min-h-0 flex-1 flex-col bg-white text-[#10223e]">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={`relative overflow-hidden rounded-br-[20px] bg-gradient-to-b from-[#e3eeff] to-[#f3f7fe] ${illustration ? 'h-[min(45svh,360px)] min-h-[240px]' : 'px-5 pb-9 pt-16'}`}>
          <button type="button" onClick={onSkip} className="absolute left-5 top-4 z-10 rounded-full bg-white px-4 py-2.5 text-xs font-medium shadow-sm transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600">Skip</button>
          {illustration ? (
            <img src={illustration} alt="Home service professionals handling electrical work, AC repair, plumbing, painting and cleaning" className="h-full w-full object-cover object-[center_45%]" />
          ) : (
            <div aria-hidden="true" className="mx-auto max-w-64">
              <div className="mb-4 flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-xs text-[#526b8f] shadow-[0_5px_18px_#1b58b510]"><Search size={16} className="text-[#0756c7]" />Search services</div>
              <div className="grid grid-cols-3 gap-2.5">
                {services.map(({ label, Icon }) => <div key={label} className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl bg-white p-2 shadow-[0_3px_10px_#173c7110]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e6efff] text-[#0756c7]"><Icon size={17} strokeWidth={1.8} /></span><span className="text-[10px] font-medium">{label}</span></div>)}
              </div>
            </div>
          )}
        </div>
        <div className="px-5 pb-5 pt-6 text-center">
          <h1 className="text-[22px] font-bold leading-tight tracking-tight">Find the Right Pro</h1>
          <p className="mx-auto mt-2 max-w-80 text-xs leading-5 text-[#60708a]">Browse plumbing, electrical, cleaning, AC repair and more, all from rated professionals near you.</p>
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {features.map(({ title, detail, Icon }, index) => <div key={title} className="flex flex-col items-center rounded-2xl bg-[#f3f4f6] px-2 py-4"><span className={`mb-2 grid h-8 w-8 place-items-center rounded-full ${index === 1 ? 'bg-[#d4e5ff] text-[#0756c7]' : 'bg-[#e6e9ee] text-[#526078]'}`}><Icon size={16} strokeWidth={1.8} /></span><h2 className="text-xs font-semibold">{title}</h2><p className="mt-1 text-[10px] leading-4 text-[#60708a]">{detail}</p></div>)}
          </div>
        </div>
      </div>
      <footer className="shrink-0 bg-white px-5 pb-5 pt-3">
        <div aria-label="Step 1 of 3" className="mb-5 flex items-center justify-center gap-1.5"><span aria-current="step" className="h-1.5 w-6 rounded-full bg-[#1058bd]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d4e2fa]" /><span className="h-1.5 w-1.5 rounded-full bg-[#d4e2fa]" /></div>
        <button type="button" onClick={onNext} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1058bd] px-4 py-3 text-sm font-semibold text-white shadow-[0_7px_16px_#1058bd30] transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Next<ArrowRight size={17} /></button>
        <button type="button" onClick={onSkip} className="mx-auto mt-3 block px-3 py-2 text-xs text-[#365d92] hover:text-blue-800">Skip to exploring services</button>
      </footer>
    </section>
  );
}
