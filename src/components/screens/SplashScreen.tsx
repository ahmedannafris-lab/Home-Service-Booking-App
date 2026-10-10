import { IOSStatusBar } from '../common/iOSStatusBar';
import { BrandLogo } from '../common/BrandLogo';
import splashImage from '../../assets/homemate-splash.png';

export function SplashScreen() {
  return (
    <section className="splash-screen" aria-label="Welcome to HomeMate">
      <IOSStatusBar showIsland={false} />
      <div className="splash-brand">
        <BrandLogo className="w-[56%] max-w-[210px]" />
        <p className="mt-6">Trusted services, right at your<br />doorstep.</p>
        <img className="splash-image" src={splashImage} alt="HomeMate Repair Services" />
        <p>Trusted services, right at your<br />doorstep.</p>
      </div>
      <div className="splash-home-indicator" aria-hidden="true" />
    </section>
  );
}
