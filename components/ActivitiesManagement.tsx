

import React, { useState, useMemo } from 'react';
import type { Activity, SpeedBoatTrip, Staff, Booking, Extra, PaymentMethod, TaxiBoatOption } from '../types';
import Modal from './Modal';
import { EyeIcon } from '../constants';


// --- SVG Icons for UI Enhancement ---
const TicketIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-1.5m2.25-9h.01M7.5 15h3m-3 0h-1.5m-1.5 0h5.25m0 0h1.5m-5.25 0h-3m-1.5-9H5.25m0 0h1.5M5.25 6H7.5M5.25 6H3M7.5 6H5.25m6.75 0h1.5m-1.5 0h-3m1.5 0h-1.5m-1.5 0H9M12 6h3.75m-3.75 0h-1.5m-1.5 0h-3.75" />
    </svg>
);
const CurrencyDollarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11c-.77 0-1.536.21-2.121.659L9 12.25m6-3.25l-2.121.659-2.121-.659m0 0l2.121-.659 2.121.659M9 12.25l2.121.659 2.121-.659M15 12.25l-2.121.659-2.121-.659" />
    </svg>
);
const UserGroupIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 011.88-3.762A4.5 4.5 0 0112 6c1.243 0 2.39.52 3.181 1.398a4.5 4.5 0 011.88 3.762" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18.72a9.094 9.094 0 01-3.741-.479 3 3 0 01-4.682-2.72m7.5-2.952a4.5 4.5 0 00-1.88-3.762A4.5 4.5 0 0012 6c-1.243 0-2.39.52-3.181 1.398a4.5 4.5 0 00-1.88 3.762" />
    </svg>
);
const BuildingOfficeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);
const RocketLaunchIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.18a14.98 14.98 0 00-1.34 2.18m11.39 10.12a14.98 14.98 0 00-6.16-12.12" />
    </svg>
);
const ShipIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18.75h16.5m-16.5 0a3 3 0 013-3h10.5a3 3 0 013 3m-13.5 0V15m10.5 3.75V15m-10.5-9L12 3m0 0l3.75 5.25M12 3v12.75" />
    </svg>
);
const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);
const TrendingUpIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625V3.375" />
    </svg>
);
const FireIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797A8.333 8.333 0 0112 5.85a8.333 8.333 0 013.362-3.797z" />
    </svg>
);
const TagIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);


const TOUR_EXTRAS_LIST: Extra[] = [
    { id: 'fruits', name: 'Fruits set', price: 100 },
    { id: 'veggie', name: 'Veggie option', price: 150 },
    { id: 'lunch', name: 'Lunch set', price: 150 },
    { id: 'musli', name: 'Musli', price: 50 },
    { id: 'snorkel', name: 'Snorkel', price: 50 },
    { id: 'gopro', name: 'Go pro (per day)', price: 600 },
    { id: 'paddle_hour', name: 'Paddle board (per hour)', price: 200 },
    { id: 'paddle_day', name: 'Paddle board (per day)', price: 600 },
];

const TOUR_EXTRAS = {
    simple: TOUR_EXTRAS_LIST.filter(e => !e.id.startsWith('paddle')),
    special: {
        paddleboard: {
            hour: TOUR_EXTRAS_LIST.find(e => e.id === 'paddle_hour')!,
            day: TOUR_EXTRAS_LIST.find(e => e.id === 'paddle_day')!,
        },
    },
};


interface ActivitiesManagementProps {
  activities: Activity[];
  speedBoatTrips: SpeedBoatTrip[];
  taxiBoatOptions: TaxiBoatOption[];
  staff: Staff[];
  bookings: Booking[];
  onBookActivity: (activityId: string, staffId: string, discount: number, extras: Omit<Extra, 'id'>[], paymentMethod: PaymentMethod, receiptImage?: string, fuelCost?: number, captainCost?: number) => void;
  onBookSpeedBoat: (tripId: string, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, receiptImage?: string) => void;
  onBookExternalActivity: (activityId: string, staffId: string, totalCommission: number, discount: number, extras: Omit<Extra, 'id'>[], paymentMethod: PaymentMethod, receiptImage?: string) => void;
  onBookPrivateTour: (tourType: 'Half Day' | 'Full Day', price: number, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, receiptImage?: string, fuelCost?: number, captainCost?: number) => void;
  onBookStandaloneExtra: (extra: Extra, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, receiptImage?: string) => void;
  onBookTaxiBoat: (taxiOptionId: string, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, receiptImage?: string) => void;
}

const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <h4 className="text-sm font-medium text-slate-500 truncate">{title}</h4>
            <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
        </div>
    </div>
);

type SubView = 'tours' | 'boats' | 'extras' | 'report';
type PrivateTourType = 'Half Day' | 'Full Day';

const initialExtrasState = {
    ...TOUR_EXTRAS.simple.reduce((acc, extra) => ({ ...acc, [extra.id]: false }), {}),
    paddleboardType: 'none',
    paddleboardHours: 1,
};

const initialPaymentState = {
    method: 'Cash' as PaymentMethod,
    receiptImage: undefined as string | undefined,
};

const initialPrivateTourState = {
    type: 'Half Day' as PrivateTourType,
    price: '',
};

export const ActivitiesManagement: React.FC<ActivitiesManagementProps> = (props) => {
  const { activities, speedBoatTrips, taxiBoatOptions, staff, bookings, onBookActivity, onBookSpeedBoat, onBookExternalActivity, onBookPrivateTour, onBookStandaloneExtra, onBookTaxiBoat } = props;
  const [activeTab, setActiveTab] = useState<SubView>('tours');
  
  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  const [isSpeedBoatModalOpen, setIsSpeedBoatModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<SpeedBoatTrip | null>(null);
  
  const [isExternalBookingModalOpen, setIsExternalBookingModalOpen] = useState(false);
  const [selectedExternalActivity, setSelectedExternalActivity] = useState<Activity | null>(null);

  const [isPrivateTourModalOpen, setIsPrivateTourModalOpen] = useState(false);

  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);

  const [isTaxiModalOpen, setIsTaxiModalOpen] = useState(false);
  const [selectedTaxiOption, setSelectedTaxiOption] = useState<TaxiBoatOption | null>(null);
  
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  // Common form states
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [commission, setCommission] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<any>(initialExtrasState);
  const [paymentDetails, setPaymentDetails] = useState(initialPaymentState);
  const [privateTourDetails, setPrivateTourDetails] = useState(initialPrivateTourState);
  const [fuelCost, setFuelCost] = useState('');
  const [captainCost, setCaptainCost] = useState('');

  const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s.name])), [staff]);

  const calculateExtras = (currentExtras: any): { list: Omit<Extra, 'id'>[], total: number } => {
    const list: Omit<Extra, 'id'>[] = [];
    let total = 0;

    TOUR_EXTRAS.simple.forEach(extra => {
        if (currentExtras[extra.id]) {
            list.push({ name: extra.name, price: extra.price });
            total += extra.price;
        }
    });

    if (currentExtras.paddleboardType === 'hour') {
        const hours = Math.max(1, Number(currentExtras.paddleboardHours) || 1);
        const price = TOUR_EXTRAS.special.paddleboard.hour.price * hours;
        list.push({ name: `${TOUR_EXTRAS.special.paddleboard.hour.name} x${hours}`, price });
        total += price;
    } else if (currentExtras.paddleboardType === 'day') {
        list.push({ name: TOUR_EXTRAS.special.paddleboard.day.name, price: TOUR_EXTRAS.special.paddleboard.day.price });
        total += TOUR_EXTRAS.special.paddleboard.day.price;
    }

    return { list, total };
  };

  const resetCommonStates = () => {
    setSelectedStaffId('');
    setCommission('');
    setDiscount('');
    setSelectedExtras(initialExtrasState);
    setPaymentDetails(initialPaymentState);
    setPrivateTourDetails(initialPrivateTourState);
    setFuelCost('');
    setCaptainCost('');
  };

  // Internal Activity Booking Handlers
  const handleOpenBookingModal = (activity: Activity) => {
    resetCommonStates();
    setSelectedActivity(activity);
    setIsBookingModalOpen(true);
  };
  const handleCloseBookingModal = () => setIsBookingModalOpen(false);
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !selectedStaffId) return;
    const { list: extrasList } = calculateExtras(selectedExtras);
    onBookActivity(selectedActivity.id, selectedStaffId, Number(discount || 0), extrasList, paymentDetails.method, paymentDetails.receiptImage, Number(fuelCost || 0), Number(captainCost || 0));
    handleCloseBookingModal();
  };

  // External Activity Booking Handlers
  const handleOpenExternalBookingModal = (activity: Activity) => {
    resetCommonStates();
    setSelectedExternalActivity(activity);
    setIsExternalBookingModalOpen(true);
  };
  const handleCloseExternalBookingModal = () => setIsExternalBookingModalOpen(false);
  const handleConfirmExternalBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExternalActivity || !selectedStaffId || !commission) return;
    const { list: extrasList } = calculateExtras(selectedExtras);
    onBookExternalActivity(selectedExternalActivity.id, selectedStaffId, Number(commission), Number(discount || 0), extrasList, paymentDetails.method, paymentDetails.receiptImage);
    handleCloseExternalBookingModal();
  };

  // Speed Boat Booking Handlers
  const handleOpenSpeedBoatModal = (trip: SpeedBoatTrip) => {
    resetCommonStates();
    setSelectedTrip(trip);
    setIsSpeedBoatModalOpen(true);
  };
  const handleCloseSpeedBoatModal = () => setIsSpeedBoatModalOpen(false);
  const handleConfirmSpeedBoatBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !selectedStaffId || !commission) return;
    onBookSpeedBoat(selectedTrip.id, selectedStaffId, Number(commission), paymentDetails.method, paymentDetails.receiptImage);
    handleCloseSpeedBoatModal();
  };

  // Private Tour Booking Handlers
  const handleOpenPrivateTourModal = () => {
      resetCommonStates();
      setIsPrivateTourModalOpen(true);
  };
  const handleClosePrivateTourModal = () => setIsPrivateTourModalOpen(false);
  const handleConfirmPrivateTourBooking = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedStaffId || !commission || !privateTourDetails.price) return;
      onBookPrivateTour(
          privateTourDetails.type,
          Number(privateTourDetails.price),
          selectedStaffId,
          Number(commission),
          paymentDetails.method,
          paymentDetails.receiptImage,
          Number(fuelCost || 0),
          Number(captainCost || 0)
      );
      handleClosePrivateTourModal();
  };

  // Standalone Extra/Taxi Handlers
  const handleOpenExtraModal = (extra: Extra) => {
    resetCommonStates();
    setSelectedExtra(extra);
    setIsExtraModalOpen(true);
  };
  const handleCloseExtraModal = () => setIsExtraModalOpen(false);
  const handleConfirmExtraSale = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedExtra || !selectedStaffId || !commission) return;
      onBookStandaloneExtra(selectedExtra, selectedStaffId, Number(commission), paymentDetails.method, paymentDetails.receiptImage);
      handleCloseExtraModal();
  };

  const handleOpenTaxiModal = (option: TaxiBoatOption) => {
      resetCommonStates();
      setSelectedTaxiOption(option);
      setIsTaxiModalOpen(true);
  };
  const handleCloseTaxiModal = () => setIsTaxiModalOpen(false);
  const handleConfirmTaxiBooking = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedTaxiOption || !selectedStaffId || !commission) return;
      onBookTaxiBoat(selectedTaxiOption.id, selectedStaffId, Number(commission), paymentDetails.method, paymentDetails.receiptImage);
      handleCloseTaxiModal();
  };


  const formatCurrency = (amount: number) => `${amount.toLocaleString('en-US')} THB`;

  const reportData = useMemo(() => {
      const totalRevenue = bookings.reduce((sum, b) => sum + (b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0)), 0);
      const totalEmployeeCommission = bookings.reduce((sum, b) => sum + b.employeeCommission, 0);
      const totalHostelCommission = bookings.reduce((sum, b) => sum + b.hostelCommission, 0);
      const totalOperatingCosts = bookings.reduce((sum, b) => sum + (b.fuelCost || 0) + (b.captainCost || 0), 0);
      const netProfit = totalRevenue + totalHostelCommission - totalOperatingCosts;
      return { totalRevenue, totalEmployeeCommission, totalHostelCommission, totalOperatingCosts, netProfit };
  }, [bookings]);

  const TABS: { id: SubView; label: string; icon: React.ReactNode }[] = [
    { id: 'tours', label: 'Tours & Activities', icon: <RocketLaunchIcon /> },
    { id: 'boats', label: 'Speed Boat Routes', icon: <ShipIcon /> },
    { id: 'extras', label: 'Extras & Taxi', icon: <TagIcon /> },
    { id: 'report', label: 'Bookings Report', icon: <ChartBarIcon /> },
  ];

  const getTypeStyle = (type: Booking['itemType']) => {
    switch (type) {
      case 'activity': return 'bg-green-100 text-green-800';
      case 'external_activity': return 'bg-yellow-100 text-yellow-800';
      case 'speedboat': return 'bg-purple-100 text-purple-800';
      case 'private_tour': return 'bg-cyan-100 text-cyan-800';
      case 'extra': return 'bg-indigo-100 text-indigo-800';
      case 'taxi_boat': return 'bg-pink-100 text-pink-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentDetails(prev => ({ ...prev, receiptImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPaymentForm = () => {
    return (
        <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Payment Details</h4>
            <div className="p-3 bg-slate-50 rounded-md border space-y-3">
                <div className="flex items-center justify-around">
                    {(['Cash', 'Credit Card', 'Internet Payment'] as PaymentMethod[]).map(method => (
                        <label key={method} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentDetails.method === method}
                                onChange={(e) => setPaymentDetails(prev => ({...prev, method: e.target.value as PaymentMethod}))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span>{method}</span>
                        </label>
                    ))}
                </div>
                {(paymentDetails.method === 'Credit Card' || paymentDetails.method === 'Internet Payment') && (
                    <div className="pt-3 border-t">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Upload Receipt (Optional)</label>
                        {paymentDetails.receiptImage ? (
                             <div className="flex items-center space-x-2">
                                <img src={paymentDetails.receiptImage} alt="Receipt preview" className="h-12 w-auto rounded-md border" />
                                <button type="button" onClick={() => setPaymentDetails(prev => ({...prev, receiptImage: undefined}))} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
  };
  
  const renderContent = () => {
      switch (activeTab) {
          case 'tours': return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-transform duration-300">
                  <img src={activity.imageUrl} alt={activity.name} className="h-56 w-full object-cover" />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{activity.name}</h3>
                    <p className="text-slate-600 text-sm flex-grow mb-4">{activity.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-2xl font-bold text-blue-600">{formatCurrency(activity.price)}</span>
                       <div className="flex items-center space-x-2">
                          <button onClick={() => handleOpenBookingModal(activity)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm">
                            Book
                          </button>
                          <button onClick={() => handleOpenExternalBookingModal(activity)} className="px-4 py-2 bg-white text-blue-600 border border-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm">
                            Book External
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
               <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-transform duration-300 border-2 border-dashed border-slate-300 hover:border-blue-500">
                  <div className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Private Tour</h3>
                    <p className="text-slate-600 text-sm flex-grow mb-4">Book a custom half-day or full-day private tour. Price and commission are set manually.</p>
                     <button onClick={handleOpenPrivateTourModal} className="w-full mt-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm">
                        Book Now
                      </button>
                  </div>
                </div>
            </div>
          );
          case 'boats': return (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4">Route</th>
                    <th scope="col" className="px-6 py-4 text-right">Sale Price</th>
                    <th scope="col" className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {speedBoatTrips.map((trip) => (
                    <tr key={trip.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                      <td scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{trip.route}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-700">{formatCurrency(trip.price)}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleOpenSpeedBoatModal(trip)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors text-xs">
                          Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          case 'extras': return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Taxi Boat Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Taxi Boat Service</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {taxiBoatOptions.map(option => (
                            <div key={option.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col text-center">
                                <h3 className="text-lg font-bold text-slate-800">{option.name}</h3>
                                <p className="text-2xl font-semibold text-blue-600 my-4">{formatCurrency(option.price)}</p>
                                <button onClick={() => handleOpenTaxiModal(option)} className="mt-auto w-full btn-primary text-sm">
                                    Book Taxi
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Standalone Extras Section */}
                 <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Sell Standalone Extras</h2>
                     <div className="bg-white p-4 rounded-lg shadow-md">
                        <ul className="divide-y divide-slate-200">
                            {TOUR_EXTRAS_LIST.map(extra => (
                                <li key={extra.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{extra.name}</p>
                                        <p className="text-sm text-slate-500">{formatCurrency(extra.price)}</p>
                                    </div>
                                    <button onClick={() => handleOpenExtraModal(extra)} className="px-3 py-1 bg-green-100 text-green-800 font-semibold rounded-md hover:bg-green-200 transition-colors text-xs">
                                        Sell
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
          );
          case 'report': return (
            bookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-10 text-center text-slate-500">
                    <h3 className="text-xl font-semibold">No Bookings Yet</h3>
                    <p className="mt-2">Start selling tours and boat trips to see your report here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                        <SummaryCard title="Total Bookings" value={bookings.length} icon={<TicketIcon className="w-6 h-6"/>} />
                        <SummaryCard title="Total Revenue" value={formatCurrency(reportData.totalRevenue)} icon={<CurrencyDollarIcon className="w-6 h-6"/>} />
                        <SummaryCard title="Operating Costs" value={formatCurrency(reportData.totalOperatingCosts)} icon={<FireIcon className="w-6 h-6"/>} />
                        <SummaryCard title="Net Profit" value={formatCurrency(reportData.netProfit)} icon={<TrendingUpIcon className="w-6 h-6"/>} />
                        <SummaryCard title="Employee Commissions" value={formatCurrency(reportData.totalEmployeeCommission)} icon={<UserGroupIcon className="w-6 h-6"/>} />
                        <SummaryCard title="Hostel Commissions" value={formatCurrency(reportData.totalHostelCommission)} icon={<BuildingOfficeIcon className="w-6 h-6"/>} />
                    </div>
                     <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4">Date</th>
                                <th scope="col" className="px-6 py-4">Item</th>
                                <th scope="col" className="px-6 py-4">Type</th>
                                <th scope="col" className="px-6 py-4">Sold By</th>
                                <th scope="col" className="px-6 py-4">Payment</th>
                                <th scope="col" className="px-6 py-4">Receipt</th>
                                <th scope="col" className="px-6 py-4 text-right">Extras Cost</th>
                                <th scope="col" className="px-6 py-4 text-right">Discount</th>
                                <th scope="col" className="px-6 py-4 text-right">Final Price</th>
                                <th scope="col" className="px-6 py-4 text-right">Emp. Comm.</th>
                                <th scope="col" className="px-6 py-4 text-right">Hostel Comm.</th>
                                <th scope="col" className="px-6 py-4 text-right">Fuel Cost</th>
                                <th scope="col" className="px-6 py-4 text-right">Captain Cost</th>
                            </tr>
                            </thead>
                            <tbody>
                                {bookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()).map((booking) => (
                                    <tr key={booking.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">{booking.bookingDate}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900" title={booking.extras?.map(e => `${e.name} (${formatCurrency(e.price)})`).join('\n')}>
                                            {booking.itemName}
                                            {booking.extras && booking.extras.length > 0 && <span className="text-blue-500 ml-1">*</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeStyle(booking.itemType)}`}>
                                                {booking.itemType.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{staffMap.get(booking.staffId) || 'Unknown'}</td>
                                        <td className="px-6 py-4">{booking.paymentMethod}</td>
                                        <td className="px-6 py-4">
                                            {booking.receiptImage ? (
                                                <button onClick={() => setViewingReceipt(booking.receiptImage!)} className="text-blue-600 hover:text-blue-800 flex items-center text-xs font-medium">
                                                  <EyeIcon className="w-4 h-4 mr-1" />
                                                  View
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">{formatCurrency(booking.extrasTotal || 0)}</td>
                                        <td className="px-6 py-4 text-right text-red-600">{formatCurrency(booking.discount || 0)}</td>
                                        <td className="px-6 py-4 text-right font-semibold">{formatCurrency(booking.customerPrice + (booking.extrasTotal || 0) - (booking.discount || 0))}</td>
                                        <td className="px-6 py-4 text-right text-green-600">{formatCurrency(booking.employeeCommission)}</td>
                                        <td className="px-6 py-4 text-right text-green-600">{formatCurrency(booking.hostelCommission)}</td>
                                        <td className="px-6 py-4 text-right text-orange-600">{formatCurrency(booking.fuelCost || 0)}</td>
                                        <td className="px-6 py-4 text-right text-orange-600">{formatCurrency(booking.captainCost || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
          );
          default: return null;
      }
  };
  
    const { total: currentExtrasTotal } = useMemo(() => calculateExtras(selectedExtras), [selectedExtras]);
    const currentDiscount = Number(discount || 0);

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Activities & Bookings</h1>
        </div>

        <div className="border-b border-slate-200">
             <nav className="flex space-x-2 sm:space-x-8 -mb-px" aria-label="Tabs">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {React.cloneElement(tab.icon as React.ReactElement, { className: 'w-5 h-5 mr-2' })}
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
        
        <div className="mt-8">
            {renderContent()}
        </div>

        {/* --- Internal Tour Booking Modal --- */}
        <Modal isOpen={isBookingModalOpen} onClose={handleCloseBookingModal} title={`Book: ${selectedActivity?.name}`}>
            {selectedActivity && (
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="staff" className="block text-sm font-medium text-slate-700">Booking Employee</label>
                            <select id="staff" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required className="mt-1 block w-full input-field">
                                <option value="">Select Employee</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        {/* Extras Section */}
                        <div>
                           <h4 className="text-sm font-semibold text-slate-800 mb-2">Add Extras</h4>
                            <div className="p-3 bg-slate-50 rounded-md border space-y-3">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {TOUR_EXTRAS.simple.map(extra => (
                                    <label key={extra.id} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedExtras[extra.id]}
                                            onChange={(e) => setSelectedExtras(prev => ({...prev, [extra.id]: e.target.checked}))}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>{extra.name} ({formatCurrency(extra.price)})</span>
                                    </label>
                                ))}
                                </div>
                                <div className="border-t pt-3">
                                    <select 
                                        value={selectedExtras.paddleboardType} 
                                        onChange={e => setSelectedExtras(prev => ({...prev, paddleboardType: e.target.value}))}
                                        className="w-full text-sm input-field mb-2"
                                    >
                                        <option value="none">No Paddle Board</option>
                                        <option value="hour">{TOUR_EXTRAS.special.paddleboard.hour.name}</option>
                                        <option value="day">{TOUR_EXTRAS.special.paddleboard.day.name}</option>
                                    </select>
                                    {selectedExtras.paddleboardType === 'hour' && (
                                        <div className="flex items-center space-x-2">
                                            <label className="text-sm">Hours:</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={selectedExtras.paddleboardHours}
                                                onChange={e => setSelectedExtras(prev => ({...prev, paddleboardHours: e.target.value}))}
                                                className="w-20 input-field text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="discount" className="block text-sm font-medium text-slate-700">Discount (THB)</label>
                            <input type="number" id="discount" placeholder="e.g. 50" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1 block w-full input-field" />
                        </div>
                        
                        <div>
                           <h4 className="text-sm font-semibold text-slate-800 mb-2">Operating Costs (Optional)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fuelCost" className="block text-xs font-medium text-slate-600">Fuel Cost</label>
                                    <input type="number" id="fuelCost" placeholder="e.g. 500" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} className="mt-1 block w-full input-field" />
                                </div>
                                <div>
                                    <label htmlFor="captainCost" className="block text-xs font-medium text-slate-600">Captain Cost</label>
                                    <input type="number" id="captainCost" placeholder="e.g. 300" value={captainCost} onChange={(e) => setCaptainCost(e.target.value)} className="mt-1 block w-full input-field" />
                                </div>
                            </div>
                        </div>

                         {renderPaymentForm()}
                    </div>
                    
                    {/* Price Summary */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Original Price:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(selectedActivity.price)}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-slate-600">Extras Total:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(currentExtrasTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-red-600">
                            <span className="">Discount:</span>
                            <span className="font-semibold">-{formatCurrency(currentDiscount)}</span>
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-slate-800">Final Price:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(selectedActivity.price + currentExtrasTotal - currentDiscount)}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={handleCloseBookingModal} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={!selectedStaffId}>Confirm Booking</button>
                    </div>
                </form>
            )}
        </Modal>

        {/* --- External Tour Booking Modal --- */}
        <Modal isOpen={isExternalBookingModalOpen} onClose={handleCloseExternalBookingModal} title={`Book External: ${selectedExternalActivity?.name}`}>
            {selectedExternalActivity && (
                 <form onSubmit={handleConfirmExternalBooking} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="staff" className="block text-sm font-medium text-slate-700">Booking Employee</label>
                            <select id="staff" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required className="mt-1 block w-full input-field">
                                <option value="">Select Employee</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Total Commission Received (THB)</label>
                            <input type="number" id="commission" placeholder="e.g. 300" value={commission} onChange={(e) => setCommission(e.target.value)} required className="mt-1 block w-full input-field" />
                        </div>

                         {/* Extras Section */}
                        <div>
                           <h4 className="text-sm font-semibold text-slate-800 mb-2">Add Extras</h4>
                            <div className="p-3 bg-slate-50 rounded-md border space-y-3">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {TOUR_EXTRAS.simple.map(extra => (
                                    <label key={extra.id} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedExtras[extra.id]}
                                            onChange={(e) => setSelectedExtras(prev => ({...prev, [extra.id]: e.target.checked}))}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>{extra.name} ({formatCurrency(extra.price)})</span>
                                    </label>
                                ))}
                                </div>
                                <div className="border-t pt-3">
                                    <select 
                                        value={selectedExtras.paddleboardType} 
                                        onChange={e => setSelectedExtras(prev => ({...prev, paddleboardType: e.target.value}))}
                                        className="w-full text-sm input-field mb-2"
                                    >
                                        <option value="none">No Paddle Board</option>
                                        <option value="hour">{TOUR_EXTRAS.special.paddleboard.hour.name}</option>
                                        <option value="day">{TOUR_EXTRAS.special.paddleboard.day.name}</option>
                                    </select>
                                    {selectedExtras.paddleboardType === 'hour' && (
                                        <div className="flex items-center space-x-2">
                                            <label className="text-sm">Hours:</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={selectedExtras.paddleboardHours}
                                                onChange={e => setSelectedExtras(prev => ({...prev, paddleboardHours: e.target.value}))}
                                                className="w-20 input-field text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="discount" className="block text-sm font-medium text-slate-700">Discount (THB)</label>
                            <input type="number" id="discount" placeholder="e.g. 50" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1 block w-full input-field" />
                        </div>
                        
                        {renderPaymentForm()}
                    </div>
                    
                    {/* Summary */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 text-sm">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-slate-800">Final Price:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(selectedExternalActivity.price + currentExtrasTotal - currentDiscount)}</span>
                        </div>
                         {commission && (
                             <div className="text-xs text-slate-600 pt-2 border-t">
                                 <p>Employee Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                                 <p>Hostel Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                             </div>
                         )}
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={handleCloseExternalBookingModal} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={!selectedStaffId || !commission}>Confirm Booking</button>
                    </div>
                </form>
            )}
        </Modal>

        {/* --- Speed Boat Booking Modal --- */}
        <Modal isOpen={isSpeedBoatModalOpen} onClose={handleCloseSpeedBoatModal} title={`Book: ${selectedTrip?.route}`}>
             {selectedTrip && (
                 <form onSubmit={handleConfirmSpeedBoatBooking} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="staff" className="block text-sm font-medium text-slate-700">Booking Employee</label>
                            <select id="staff" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required className="mt-1 block w-full input-field">
                                <option value="">Select Employee</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Total Commission (THB)</label>
                            <input type="number" id="commission" placeholder="Enter total commission amount" value={commission} onChange={(e) => setCommission(e.target.value)} required className="mt-1 block w-full input-field" />
                        </div>
                         {renderPaymentForm()}
                    </div>
                    
                    {/* Summary */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 text-sm">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-slate-800">Customer Price:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(selectedTrip.price)}</span>
                        </div>
                         {commission && (
                             <div className="text-xs text-slate-600 pt-2 border-t">
                                 <p>Employee Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                                 <p>Hostel Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                             </div>
                         )}
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={handleCloseSpeedBoatModal} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={!selectedStaffId || !commission}>Confirm Booking</button>
                    </div>
                </form>
            )}
        </Modal>

        {/* --- Private Tour Booking Modal --- */}
        <Modal isOpen={isPrivateTourModalOpen} onClose={handleClosePrivateTourModal} title="Book a Private Tour">
            <form onSubmit={handleConfirmPrivateTourBooking} className="space-y-6">
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tour Type</label>
                        <div className="flex space-x-4">
                            {(['Half Day', 'Full Day'] as PrivateTourType[]).map(type => (
                                <label key={type} className="flex items-center">
                                    <input 
                                        type="radio"
                                        name="tourType"
                                        value={type}
                                        checked={privateTourDetails.type === type}
                                        onChange={() => setPrivateTourDetails(prev => ({ ...prev, type }))}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-slate-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label>
                        <input type="number" id="price" placeholder="Enter total price" value={privateTourDetails.price} onChange={(e) => setPrivateTourDetails(prev => ({...prev, price: e.target.value}))} required className="mt-1 block w-full input-field" />
                    </div>

                    <div>
                        <label htmlFor="staff" className="block text-sm font-medium text-slate-700">Booking Employee</label>
                        <select id="staff" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required className="mt-1 block w-full input-field">
                            <option value="">Select Employee</option>
                            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Total Commission (THB)</label>
                        <input type="number" id="commission" placeholder="Enter total commission amount" value={commission} onChange={(e) => setCommission(e.target.value)} required className="mt-1 block w-full input-field" />
                    </div>
                     <div>
                       <h4 className="text-sm font-semibold text-slate-800 mb-2">Operating Costs (Optional)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fuelCostPrivate" className="block text-xs font-medium text-slate-600">Fuel Cost</label>
                                <input type="number" id="fuelCostPrivate" placeholder="e.g. 500" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} className="mt-1 block w-full input-field" />
                            </div>
                            <div>
                                <label htmlFor="captainCostPrivate" className="block text-xs font-medium text-slate-600">Captain Cost</label>
                                <input type="number" id="captainCostPrivate" placeholder="e.g. 300" value={captainCost} onChange={(e) => setCaptainCost(e.target.value)} className="mt-1 block w-full input-field" />
                            </div>
                        </div>
                    </div>
                    {renderPaymentForm()}
                </div>
                
                {/* Summary */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 text-sm">
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-slate-800">Customer Price:</span>
                        <span className="font-bold text-blue-600">{formatCurrency(Number(privateTourDetails.price) || 0)}</span>
                    </div>
                        {commission && (
                            <div className="text-xs text-slate-600 pt-2 border-t">
                                <p>Employee Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                                <p>Hostel Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                            </div>
                        )}
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                    <button type="button" onClick={handleClosePrivateTourModal} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary" disabled={!selectedStaffId || !commission || !privateTourDetails.price}>Confirm Booking</button>
                </div>
            </form>
        </Modal>

        {/* --- Standalone Extra/Taxi Modals --- */}
        <Modal isOpen={isExtraModalOpen} onClose={handleCloseExtraModal} title={`Sell: ${selectedExtra?.name}`}>
            {selectedExtra && (
                 <form onSubmit={handleConfirmExtraSale} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="staffExtra" className="block text-sm font-medium text-slate-700">Selling Employee</label>
                            <select id="staffExtra" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required className="mt-1 block w-full input-field">
                                <option value="">Select Employee</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Total Commission (THB)</label>
                            <input type="number" id="commission" placeholder="e.g. 50" value={commission} onChange={(e) => setCommission(e.target.value)} required className="mt-1 block w-full input-field" />
                        </div>
                        {renderPaymentForm()}
                    </div>
                     <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 text-sm">
                         <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-slate-800">Total Price:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(selectedExtra.price)}</span>
                        </div>
                        {commission && (
                            <div className="text-xs text-slate-600 pt-2 border-t">
                                <p>Employee Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                                <p>Hostel Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={handleCloseExtraModal} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={!selectedStaffId || !commission}>Confirm Sale</button>
                    </div>
                </form>
            )}
        </Modal>

        <Modal isOpen={isTaxiModalOpen} onClose={handleCloseTaxiModal} title={`Book Taxi: ${selectedTaxiOption?.name}`}>
            {selectedTaxiOption && (
                 <form onSubmit={handleConfirmTaxiBooking} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="staffTaxi" className="block text-sm font-medium text-slate-700">Booking Employee</label>
                            <select id="staffTaxi" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required className="mt-1 block w-full input-field">
                                <option value="">Select Employee</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Total Commission (THB)</label>
                            <input type="number" id="commission" placeholder="e.g. 50" value={commission} onChange={(e) => setCommission(e.target.value)} required className="mt-1 block w-full input-field" />
                        </div>
                        {renderPaymentForm()}
                    </div>
                     <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 text-sm">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-slate-800">Total Price:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(selectedTaxiOption.price)}</span>
                        </div>
                        {commission && (
                            <div className="text-xs text-slate-600 pt-2 border-t">
                                <p>Employee Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                                <p>Hostel Commission (50%): {formatCurrency(Number(commission) / 2)}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={handleCloseTaxiModal} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={!selectedStaffId || !commission}>Confirm Booking</button>
                    </div>
                </form>
            )}
        </Modal>


        <Modal isOpen={!!viewingReceipt} onClose={() => setViewingReceipt(null)} title="View Receipt">
            {viewingReceipt && <img src={viewingReceipt} alt="Transaction receipt" className="w-full h-auto rounded-md" />}
        </Modal>

        <style>{`
            .input-field { padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #cbd5e1; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); outline: none; color: #1e293b; }
            .input-field:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #3b82f6; box-shadow: 0 0 0 2px #3b82f6; border-color: #3b82f6; }
            .btn-primary { padding: 0.5rem 1rem; background-color: #2563eb; color: white; border-radius: 0.375rem; font-weight: 600; transition: background-color 0.2s; }
            .btn-primary:hover { background-color: #1d4ed8; }
            .btn-primary:disabled { background-color: #93c5fd; cursor: not-allowed; }
            .btn-secondary { padding: 0.5rem 1rem; background-color: #e2e8f0; color: #1e293b; border-radius: 0.375rem; font-weight: 600; transition: background-color 0.2s; }
            .btn-secondary:hover { background-color: #cbd5e1; }
        `}</style>
    </div>
  );
};