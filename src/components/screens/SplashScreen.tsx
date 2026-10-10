import { IOSStatusBar } from '../common/iOSStatusBar';
import splashImage from '../../assets/homemate-splash.png';

export function SplashScreen() {
  return (
    <section className="splash-screen" aria-label="Welcome to HomeMate">
      <IOSStatusBar showIsland={false} />
      <div className="splash-brand">
        <img className="splash-image" src={splashImage} alt="HomeMate Repair Services" />
        <p>Trusted services, right at your<br />doorstep.</p>
      </div>
      <div className="splash-home-indicator" aria-hidden="true" />
    </section>
  );
}
