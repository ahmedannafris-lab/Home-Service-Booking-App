import { useEffect, useState } from 'react';
import { SplashScreen } from './components/screens/SplashScreen';
import { PaymentSuccessScreen } from './components/screens/PaymentSuccessScreen';
import { PaymentScreen, PaymentMethod } from './components/screens/PaymentScreen';
import type { OnlineProvider } from './components/screens/OnlinePaymentScreen';
import { ScreenId, ServiceItem, Specialist, UserRole, Booking } from './types';
import { SERVICES, CATEGORIES, SPECIALISTS, INITIAL_BOOKINGS, HERO_FEMALE_PRO, HERO_MALE_TRANSIT } from './data/mockData';
import { WalkthroughScreen } from './components/screens/WalkthroughScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { FindProOnboardingScreen } from './components/screens/FindProOnboardingScreen';
import { VerifiedProOnboardingScreen } from './components/screens/VerifiedProOnboardingScreen';
import { RoleSelectionScreen } from './components/screens/RoleSelectionScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { ForgotPasswordScreen } from './components/screens/ForgotPasswordScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoryListScreen } from './components/screens/CategoryListScreen';
import { CategoryDetailScreen } from './components/screens/CategoryDetailScreen';
import { ServiceDetailScreen } from './components/screens/ServiceDetailScreen';
import { BookingScheduleModal } from './components/screens/BookingScheduleModal';
import { BookingsScreen } from './components/screens/BookingsScreen';
import { AdminBookingsScreen } from './components/screens/AdminBookingsScreen';  // 👈 අලුතෙන්
import { MessagesScreen } from './components/screens/MessagesScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminProfileScreen } from './components/screens/AdminProfileScreen';
import { AdminCategoriesScreen } from './components/screens/AdminCategoriesScreen';
import { AdminCategoryServicesScreen } from './components/screens/AdminCategoryServicesScreen';
import { AdminServiceFormValues } from './components/screens/AdminCategoryServicesScreen';
import { SpecialistProfileModal } from './components/screens/SpecialistProfileModal';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { nextNavigationHistory, getNextOnboardingScreen, getPreviousOnboardingScreen } from './navigation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => new URLSearchParams(window.location.search).get('screen') === 'payment' ? 'payment' : 'splash');
  useEffect(() => {
    if (currentScreen !== 'splash') return;
    const timer = window.setTimeout(() => setCurrentScreen((screen) => screen === 'splash' ? 'onboarding-1' : screen), 3000);
    return () => window.clearTimeout(timer);
  }, [currentScreen]);
  const [navigationHistory, setNavigationHistory] = useState<ScreenId[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('plumbing');
  const [selectedService, setSelectedService] = useState<ServiceItem>(SERVICES[0]);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [checkoutBooking, setCheckoutBooking] = useState<Booking>({
    id: 'BK-10234', serviceId: 'deep-home-cleaning', serviceTitle: 'Home Cleaning',
    categoryName: 'Cleaning', date: '12 Aug 2026', timeSlot: '10:00 AM',
    address: '14/2 Alfred House Gardens, Colombo 03', price: 3500,
    status: 'scheduled', specialist: SPECIALISTS.alex, createdAt: '12 Aug 2026',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentCard, setPaymentCard] = useState('1234');
  const [onlineProvider, setOnlineProvider] = useState<OnlineProvider | undefined>();
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const storedServices = window.localStorage.getItem('homemate-services');
      return storedServices ? JSON.parse(storedServices) as ServiceItem[] : SERVICES;
    } catch {
      return SERVICES;
    }
  });

  useEffect(() => {
    window.localStorage.setItem('homemate-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    const migrationKey = 'homemate-service-catalog-v2';
    if (window.localStorage.getItem(migrationKey)) return;

    const newServiceIds = new Set(['interior-wall-painting', 'exterior-weatherproof-painting', 'washing-machine-repair', 'refrigerator-cooling-repair']);
    setServices((currentServices) => {
      const existingIds = new Set(currentServices.map((service) => service.id));
      const missingServices = SERVICES.filter((service) => newServiceIds.has(service.id) && !existingIds.has(service.id));
      return missingServices.length > 0 ? [...currentServices, ...missingServices] : currentServices;
    });
    window.localStorage.setItem(migrationKey, 'complete');
  }, []);
  const [paymentId, setPaymentId] = useState('');
  const [pendingBooking, setPendingBooking] = useState<{
    serviceId: string; serviceTitle: string; categoryName: string;
    date: string; timeSlot: string; address: string; price: number; promoCode?: string;
  } | null>(null);

  // Modals & States
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [serviceToSchedule, setServiceToSchedule] = useState<ServiceItem | null>(null);
  const [activeSpecialistModal, setActiveSpecialistModal] = useState<Specialist | null>(null);
  const [activeChatSpecialist, setActiveChatSpecialist] = useState<Specialist | null>(null);

  // App container framing (Mobile iPhone Frame vs Responsive Full-Width vs Full Screen)
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'expanded' | 'full'>('mobile');

  // Interactive Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => setToastMessage(msg);

  // Forward navigation
  const navigateTo = (screen: ScreenId) => {
    if (screen !== currentScreen) {
      setNavigationHistory((prev) => nextNavigationHistory(prev, currentScreen, screen));
      setCurrentScreen(screen);
    }
  };

  // Back navigation matching prior screen
  const handleBack = () => {
    if (currentScreen === 'home') {
      setNavigationHistory([]);
      return;
    }
    if (navigationHistory.length > 0) {
      const prevScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      setCurrentScreen(prevScreen);
    } else {
      switch (currentScreen) {
        case 'onboarding-3':
          setCurrentScreen('onboarding-2');
          break;
        case 'onboarding-2':
          setCurrentScreen('onboarding-1');
          break;
        case 'onboarding-1':
          setCurrentScreen('home');
          break;
        case 'role-selection':
          setCurrentScreen('onboarding-3');
          break;
        case 'admin-login':
        case 'login':
          setCurrentScreen('role-selection');
          break;
        case 'register':
        case 'forgot-password':
          setCurrentScreen('login');
          break;
        case 'categories':
          setCurrentScreen('home');
          break;
        case 'category-detail':
          setCurrentScreen('categories');
          break;
        case 'service-detail':
          setCurrentScreen('category-detail');
          break;
        case 'bookings':
        case 'messages':
        case 'history':
        case 'profile':
        case 'admin-bookings':   // 👈 අලුතෙන්
          setCurrentScreen('home');
          break;
        case 'admin-profile':
          setCurrentScreen('admin-login');
          break;
        case 'admin-categories':
          setCurrentScreen('admin-profile');
          break;
        case 'admin-category-services':
          setCurrentScreen('admin-categories');
          break;
        default:
          setCurrentScreen('home');
      }
    }
  };

  // Bottom Navigation visibility (only for main app tabs)
  const isMainTab = ['home', 'bookings', 'messages', 'history', 'profile', 'categories', 'category-detail'].includes(currentScreen);

  // Handler to create a new booking
  const handleConfirmBooking = async (details: {
    serviceId: string;
    serviceTitle: string;
    categoryName: string;
    date: string;
    timeSlot: string;
    address: string;
    price: number;
    promoCode?: string;
  }) => {
    const token = localStorage.getItem('homemate_token') || sessionStorage.getItem('homemate_token');
    if (!token) { setPendingBooking(details); showToast('Sign in to continue with this booking.'); setIsScheduleOpen(false); navigateTo('login'); return; }
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST', headers: {'Content-Type':'application/json', Authorization:`Bearer ${token}`},
      body: JSON.stringify({serviceId:details.serviceId,date:details.date,timeSlot:details.timeSlot,address:details.address,promoCode:details.promoCode || ''}),
    });
    const result = await response.json();
    if (response.status === 401) {
      localStorage.removeItem('homemate_token');
      sessionStorage.removeItem('homemate_token');
      setPendingBooking(details);
      setIsScheduleOpen(false);
      showToast('Your session expired. Sign in to continue with this booking.');
      navigateTo('login');
      return;
    }
    if (!response.ok) throw new Error(result.message || 'Unable to save booking');
    const specialist = SPECIALISTS[selectedService?.specialistId || 'kamal'] || SPECIALISTS.kamal;
    const newBooking: Booking = {
      id: result.booking._id,
      serviceId: details.serviceId,
      serviceTitle: details.serviceTitle,
      categoryName: details.categoryName,
      date: details.date,
      timeSlot: details.timeSlot,
      address: details.address,
      price: result.booking.amountMinor / 100,
      status: 'scheduled',
      specialist,
      createdAt: result.booking.createdAt,
    };

    setCheckoutBooking(newBooking);
    setPendingBooking(null);
    setPaymentId('');
    setIsScheduleOpen(false);
    navigateTo('payment');
  };

  const [isToolbarOpen, setIsToolbarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-800 flex flex-col items-center justify-center p-0 sm:py-3 sm:px-4 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Top Floating Mini Toolbar for Prototype Control */}
      <div className={`w-full max-w-xl px-3 mb-2 flex items-center justify-between gap-2 z-50 ${['splash', 'payment', 'payment-success'].includes(currentScreen) ? 'hidden' : ''}`}>
        <button
          onClick={() => setIsToolbarOpen(!isToolbarOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold shadow-md backdrop-blur-md border border-slate-700 transition cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>HomeMate Mobile</span>
          <span className="material-symbols-outlined text-[16px] text-slate-400">
            {isToolbarOpen ? 'expand_less' : 'tune'}
          </span>
        </button>

        {isToolbarOpen && (
          <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-md text-xs">
            <span className="text-slate-400 hidden md:inline">Screen:</span>
            <select
              value={currentScreen}
              onChange={(e) => {
                const screen = e.target.value as ScreenId;
                navigateTo(screen);
                if (screen === 'category-detail') setSelectedCategoryId('plumbing');
              }}
              className="bg-slate-700 text-white rounded-md px-2 py-1 text-xs border border-slate-600 focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="splash">0. HomeMate Splash</option>
              <option value="payment-success">Payment Successful</option>
              <option value="payment">Payment</option>
              <option value="onboarding-1">1. Walkthrough - Confident Booking</option>
              <option value="onboarding-2">2. Walkthrough - Live GPS & Support</option>
              <option value="onboarding-3">3. Walkthrough - Ready to Book</option>
              <option value="role-selection">4. Role Selection</option>
              <option value="login">4. Welcome Back Login</option>
              <option value="register">5. Create Account</option>
              <option value="forgot-password">6. Reset Password</option>
              <option value="home">7. Home Screen</option>
              <option value="categories">8. Service Categories</option>
              <option value="category-detail">9. Plumbing Category Detail</option>
              <option value="service-detail">10. Pipe Installation Detail</option>
              <option value="bookings">11. Bookings & Live GPS</option>
              <option value="messages">12. Direct Dispatch Chat</option>
              <option value="history">13. Service History</option>
              <option value="profile">14. Account Profile</option>
              <option value="admin-bookings">15. Admin - All Bookings</option>   {/* 👈 අලුතෙන් */}
              <option value="admin-login">16. Admin - Login</option>
              <option value="admin-profile">17. Admin - Profile</option>
              <option value="admin-categories">18. Admin - Manage Categories</option>
              <option value="admin-category-services">19. Admin - Category Services</option>
            </select>

            <button
              onClick={() => setDeviceFrame(deviceFrame === 'mobile' ? 'expanded' : 'mobile')}
              className="text-[11px] px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 cursor-pointer hidden sm:block"
              title="Toggle Chassis Scale"
            >
              {deviceFrame === 'mobile' ? 'Expand' : 'Phone'}
            </button>
          </div>
        )}
      </div>

      {/* Real iPhone Mobile Shell */}
      <div className="relative my-auto flex items-center justify-center w-full max-w-[420px]">
        {/* Physical Side Buttons (Left: Action, Volume Up, Volume Down) */}
        {deviceFrame === 'mobile' && (
          <>
            <div className="hidden sm:block absolute -left-[5px] top-[115px] w-[5px] h-[28px] bg-gradient-to-r from-slate-600 to-slate-500 rounded-l-md shadow-xs pointer-events-none z-0"></div>
            <div className="hidden sm:block absolute -left-[5px] top-[158px] w-[5px] h-[52px] bg-gradient-to-r from-slate-600 to-slate-500 rounded-l-md shadow-xs pointer-events-none z-0"></div>
            <div className="hidden sm:block absolute -left-[5px] top-[220px] w-[5px] h-[52px] bg-gradient-to-r from-slate-600 to-slate-500 rounded-l-md shadow-xs pointer-events-none z-0"></div>
            {/* Physical Side Button (Right: Power) */}
            <div className="hidden sm:block absolute -right-[5px] top-[175px] w-[5px] h-[75px] bg-gradient-to-l from-slate-600 to-slate-500 rounded-r-md shadow-xs pointer-events-none z-0"></div>
          </>
        )}

        {/* Outer Titanium Chassis */}
        <div
          className={`w-full relative transition-all duration-300 overflow-hidden flex flex-col justify-between ${
            deviceFrame === 'mobile'
              ? 'h-screen sm:h-[852px] sm:max-h-[94vh] bg-[#1a1f2c] sm:rounded-[56px] p-0 sm:p-[10px] sm:shadow-[0_0_0_2px_#334155,0_30px_70px_-10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.25)]'
              : 'min-h-[880px] bg-[#1a1f2c] sm:rounded-[44px] p-0 sm:p-2 sm:shadow-2xl'
          }`}
        >
          {/* Top Micro Ear Speaker Slit */}
          {deviceFrame === 'mobile' && (
            <div className="hidden sm:block absolute top-[5px] left-1/2 -translate-x-1/2 w-14 h-[4px] bg-[#0c0e14] rounded-full z-50 pointer-events-none"></div>
          )}

          {/* Main Mobile Screen Area */}
          <main className="w-full h-full bg-white sm:rounded-[46px] overflow-hidden flex flex-col justify-between relative shadow-inner">
            {/* Render Active Screen container with zero scrollbar */}
            <div className="flex-1 w-full flex flex-col overflow-hidden relative">

          {currentScreen === 'splash' && <SplashScreen />}
          {currentScreen === 'payment' && (
            <PaymentScreen
              key={checkoutBooking.id}
              booking={checkoutBooking}
              service={services.find((service) => service.id === checkoutBooking.serviceId) || services[0] || SERVICES[0]}
              onBack={() => navigateTo('home')}
              onHelp={() => { setActiveChatSpecialist(checkoutBooking.specialist); navigateTo('messages'); }}
              onEdit={() => {
                const service = services.find((item) => item.id === checkoutBooking.serviceId) || services[0] || SERVICES[0];
                setSelectedService(service); setServiceToSchedule(service); setIsScheduleOpen(true);
              }}
              onPay={async (method, card, online) => {
                const token = localStorage.getItem('homemate_token') || sessionStorage.getItem('homemate_token');
                if (!token) throw new Error('Please log in before payment.');
                if (!/^[a-f\d]{24}$/i.test(checkoutBooking.id)) {
                  throw new Error('This is a preview booking. Create a new booking from Home before paying.');
                }
                let response: Response;
                try {
                  response = await fetch('http://localhost:5000/api/payments', {
                  method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
                  body:JSON.stringify({bookingId:checkoutBooking.id,method,...(method === 'card' ? {cardLastFour:card} : {}),...(method === 'online' ? {onlineProvider:online?.provider,mobileNumber:online?.mobileNumber} : {})}),
                  signal: AbortSignal.timeout(15000),
                  });
                } catch {
                  throw new Error('Cannot reach the payment server. Check that the backend is running and MongoDB is connected, then retry.');
                }
                const result = await response.json().catch(() => {
                  throw new Error('The payment server returned an invalid response. Please retry.');
                });
                if (!response.ok) throw new Error(result.message || 'Unable to save payment');
                if (!result.success || !result.payment?._id || result.payment.method !== method || result.payment.status !== (method === 'cash' ? 'due' : 'demo_paid')) {
                  throw new Error('Payment was not confirmed. Please try again.');
                }
                setPaymentId(result.payment._id);
                setOnlineProvider(result.payment.onlineProvider);
                setPaymentMethod(result.payment.method); setPaymentCard(result.payment.cardLastFour || card);
                setBookings((previous) => [checkoutBooking, ...previous.filter((booking) => booking.id !== checkoutBooking.id)]);
                navigateTo('payment-success');
              }}
            />
          )}
          {currentScreen === 'payment-success' && (
            <PaymentSuccessScreen
              booking={checkoutBooking}
              method={paymentMethod}
              card={paymentCard}
              paymentId={paymentId}
              onlineProvider={onlineProvider}
              onViewBooking={() => {
                setBookings((previous) => previous.some((booking) => booking.id === checkoutBooking.id) ? previous : [checkoutBooking, ...previous]);
                navigateTo('bookings');
              }}
              onBackToHome={() => navigateTo('home')}
            />
          )}

          {currentScreen === 'onboarding-1' && (
            <FindProOnboardingScreen
              key="onboarding-1"
              illustration="/onboarding/screen-1.png"
              onNext={() => navigateTo(getNextOnboardingScreen(currentScreen) ?? 'role-selection')}
              onSkip={() => navigateTo('home')}
            />
          )}

          {currentScreen === 'onboarding-2' && (
            <VerifiedProOnboardingScreen
              key="onboarding-2"
              onNext={() => navigateTo(getNextOnboardingScreen(currentScreen) ?? 'role-selection')}
              onSkip={() => navigateTo('home')}
              onBack={handleBack}
            />
          )}

          {currentScreen === 'onboarding-3' && (
            <OnboardingScreen
              key="onboarding-3"
              pageNumber={3}
              totalPages={3}
              title="Ready when your home needs it"
              subtitle="From emergency fixes to planned upgrades, manage appointments, chat with experts, and pay securely after the work is done."
              image={HERO_FEMALE_PRO}
              badge="3 of 3"
              accentLabel="Simple & Secure"
              features={['Secure payment after work is completed', 'Direct chat with your assigned specialist', 'Manage bookings and service updates in one place']}
              onNext={() => navigateTo('role-selection')}
              onSkip={() => navigateTo('home')}
              onSignIn={() => navigateTo('login')}
              onBack={handleBack}
            />
          )}

          {currentScreen === 'role-selection' && (
            <RoleSelectionScreen
              onBack={handleBack}
              onContinue={(role) => {
                setUserRole(role);
                navigateTo(role === 'admin' ? 'admin-login' : 'login');
              }}
              onPartnerClick={() => {
                showToast('Opening HomeMate Enterprise Partnership program...');
              }}
            />
          )}

          {currentScreen === 'admin-login' && (
            <LoginScreen
              defaultRole="admin"
              onBack={handleBack}
              onLoginSuccess={(role) => {
                setUserRole(role);
                showToast(`Welcome back, Admin! Logged in as ${role}.`);
                navigateTo('admin-profile');
              }}
              onForgotPassword={() => navigateTo('forgot-password')}
              onSignUp={() => navigateTo('register')}
            />
          )}

          {currentScreen === 'login' && (
            <LoginScreen
              key={userRole}
              defaultRole={userRole}
              onBack={handleBack}
              onLoginSuccess={(role) => {
                setUserRole(role);
                showToast(`Welcome back! Logged in as ${role}.`);
                if (role === 'admin') { navigateTo('admin-profile'); return; }
                if (pendingBooking) {
                  void handleConfirmBooking(pendingBooking).catch((error) => {
                    showToast(error instanceof Error ? error.message : 'Unable to save booking');
                    navigateTo('home');
                  });
                  return;
                }
                navigateTo('home');
              }}
              onForgotPassword={() => navigateTo('forgot-password')}
              onSignUp={() => navigateTo('register')}
            />
          )}

          {currentScreen === 'register' && (
            <RegisterScreen
              onBack={handleBack}
              onRegisterSuccess={() => {
                setUserRole('customer');
                showToast('Account created successfully. Please log in.');
                setNavigationHistory(['role-selection']);
                setCurrentScreen('login');
              }}
              onLogIn={() => navigateTo('login')}
            />
          )}

          {currentScreen === 'forgot-password' && (
            <ForgotPasswordScreen
              onBack={handleBack}
              onCodeSent={(channel, target) => {
                showToast(`Verification code sent via ${channel} to ${target}!`);
                navigateTo('login');
              }}
              onBackToLogin={() => navigateTo('login')}
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              services={services}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                navigateTo('category-detail');
              }}
              onViewAllCategories={() => navigateTo('categories')}
              onSelectService={(serv) => {
                setSelectedService(serv);
                navigateTo('service-detail');
              }}
              onUrgentHelp={() => {
                setSelectedCategoryId('plumbing');
                navigateTo('category-detail');
                showToast('Urgent dispatch: 16 plumbers ready nearby in Colombo!');
              }}
              onOpenNotifications={() => {
                showToast('Notification: 20% off coupon HOMECOOL20 expires in 3 days');
              }}
              onOpenProfile={() => navigateTo('profile')}
              showToast={showToast}
            />
          )}

          {currentScreen === 'categories' && (
            <CategoryListScreen
              services={services}
              onBack={handleBack}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                navigateTo('category-detail');
              }}
              onCustomQuote={() => {
                showToast('Connecting you to our Commercial Contracts Team...');
              }}
            />
          )}

          {currentScreen === 'category-detail' && (
            <CategoryDetailScreen
              categoryId={selectedCategoryId}
              services={services}
              onBack={handleBack}
              onSelectService={(serv) => {
                setSelectedService(serv);
                navigateTo('service-detail');
              }}
              onBookService={(serv) => {
                setSelectedService(serv);
                setServiceToSchedule(serv);
                setIsScheduleOpen(true);
              }}
              onMessageSpecialist={(spec) => {
                setActiveChatSpecialist(spec);
                navigateTo('messages');
              }}
              onViewSpecialistProfile={(spec) => {
                setActiveSpecialistModal(spec);
              }}
              showToast={showToast}
            />
          )}

          {currentScreen === 'service-detail' && (
            <ServiceDetailScreen
              service={selectedService}
              onBack={handleBack}
              onScheduleBooking={(serv) => {
                setServiceToSchedule(serv);
                setIsScheduleOpen(true);
              }}
              onViewSpecialist={(spec) => {
                setActiveSpecialistModal(spec);
              }}
              showToast={showToast}
            />
          )}

          {currentScreen === 'bookings' && (
            <BookingsScreen
              bookings={bookings}
              onOpenChat={(spec) => {
                setActiveChatSpecialist(spec);
                navigateTo('messages');
              }}
              onCancelBooking={(id) => {
                setBookings((prev) => prev.filter((b) => b.id !== id));
                showToast(`Booking ${id} cancelled. 100% refund initiated.`);
              }}
              onRebook={(booking) => {
                const foundService = services.find((s) => s.id === booking.serviceId) || services[0] || SERVICES[0];
                setSelectedService(foundService);
                setServiceToSchedule(foundService);
                setIsScheduleOpen(true);
              }}
              onBack={handleBack}
              showToast={showToast}
            />
          )}

          {/* 👈 අලුතෙන් එකතු කරන්න */}
          {currentScreen === 'admin-bookings' && (
            <AdminBookingsScreen
              onBack={handleBack}
              showToast={showToast}
            />
          )}

          {currentScreen === 'messages' && (
            <MessagesScreen
              activeSpecialist={activeChatSpecialist || SPECIALISTS.alex}
              onBack={handleBack}
              showToast={showToast}
            />
          )}

          {currentScreen === 'history' && (
            <HistoryScreen
              bookings={bookings}
              onRebook={(b) => {
                const s = services.find((item) => item.id === b.serviceId) || services[0] || SERVICES[0];
                setSelectedService(s);
                setServiceToSchedule(s);
                setIsScheduleOpen(true);
              }}
              onBack={handleBack}
              showToast={showToast}
            />
          )}

          {currentScreen === 'admin-profile' && (
            <AdminProfileScreen
              onBack={handleBack}
              onManageCategories={() => navigateTo('admin-categories')}
              onLogout={() => {
                showToast('Signed out successfully.');
                navigateTo('admin-login');
              }}
              showToast={showToast}
            />
          )}

          {currentScreen === 'admin-categories' && (
            <AdminCategoriesScreen
              onBack={handleBack}
              onSelectCategory={(categoryId) => {
                setSelectedCategoryId(categoryId);
                navigateTo('admin-category-services');
              }}
            />
          )}

          {currentScreen === 'admin-category-services' && (
            <AdminCategoryServicesScreen
              categoryId={selectedCategoryId}
              services={services}
              onBack={handleBack}
              onCreateService={(values: AdminServiceFormValues) => {
                const category = CATEGORIES.find((item) => item.id === selectedCategoryId) || CATEGORIES[0];
                const newService: ServiceItem = {
                  id: `admin-service-${Date.now()}`,
                  categoryId: category.id,
                  categoryName: category.name,
                  title: values.title,
                  description: values.description,
                  price: values.price,
                  rating: 0,
                  reviewCount: 0,
                  duration: values.duration,
                  features: [],
                  image: category.heroImage,
                  specialistId: category.specialistId,
                };
                setServices((currentServices) => [...currentServices, newService]);
                showToast(`${newService.title} created successfully.`);
              }}
              onUpdateService={(serviceId, values) => {
                setServices((currentServices) => currentServices.map((service) =>
                  service.id === serviceId ? { ...service, ...values, originalPrice: undefined } : service
                ));
                showToast('Service updated successfully.');
              }}
              onDeleteService={(serviceId) => {
                const removedService = services.find((service) => service.id === serviceId);
                setServices((currentServices) => currentServices.filter((service) => service.id !== serviceId));
                if (removedService) showToast(`${removedService.title} deleted.`);
              }}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              currentRole={userRole}
              onSwitchRole={(newRole) => setUserRole(newRole)}
              onLogout={() => {
                localStorage.removeItem('homemate_token');
                localStorage.removeItem('homemate_user');
                sessionStorage.removeItem('homemate_token');
                sessionStorage.removeItem('homemate_user');
                showToast('Signed out successfully.');
                navigateTo('login');
              }}
              onBack={handleBack}
              showToast={showToast}
            />
          )}
        </div>

        {/* Global Bottom Navigation for Main Tabs */}
        {isMainTab && (
          <BottomNav
            currentScreen={currentScreen === 'payment' ? 'bookings' : currentScreen}
            onNavigate={(screen) => navigateTo(screen)}
            activeBookingsCount={bookings.filter((b) => b.status === 'transit' || b.status === 'scheduled').length}
            unreadMessagesCount={1}
          />
        )}
          </main>
        </div>
      </div>

      {/* Global Booking Modal */}
      <BookingScheduleModal
        service={serviceToSchedule}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onConfirm={handleConfirmBooking}
        showToast={showToast}
      />

      {/* Global Specialist Profile Modal */}
      <SpecialistProfileModal
        specialist={activeSpecialistModal}
        isOpen={Boolean(activeSpecialistModal)}
        onClose={() => setActiveSpecialistModal(null)}
        onSendMessage={(spec) => {
          setActiveSpecialistModal(null);
          setActiveChatSpecialist(spec);
          navigateTo('messages');
        }}
        showToast={showToast}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
