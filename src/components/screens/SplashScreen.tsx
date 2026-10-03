import { IOSStatusBar } from '../common/iOSStatusBar';

export function SplashScreen() {
  return (
    <section className="splash-screen" aria-label="Welcome to HomeMate">
      <IOSStatusBar showIsland={false} />
      <div className="splash-brand">
        <div className="splash-logo" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
            <path d="M10 23 24 10l14 13M14 20v16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V20" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m20 27 4 4 8-9" stroke="#72edac" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M35 12v5" stroke="#72edac" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1>HomeMate</h1>
        <p>Trusted services, right at your<br />doorstep.</p>
      </div>
      <div className="splash-home-indicator" aria-hidden="true" />
    </section>
  );
}
