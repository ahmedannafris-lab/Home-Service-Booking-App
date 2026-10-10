interface Props {
  className?: string;
}

// Frame the supplied square artwork without its large outer white margins.
export function BrandLogo({ className = '' }: Props) {
  return (
    <div className={`relative aspect-[29/20] shrink-0 overflow-hidden bg-white ${className}`}>
      <img
        src="/branding/homemate-logo.jpeg"
        alt="HomeMate Repair Services"
        className="absolute left-[-18.97%] top-[-53.75%] w-[137.93%] max-w-none"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
