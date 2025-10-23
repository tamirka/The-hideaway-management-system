
import React, { useState, useMemo, useEffect } from 'react';
import type { Activity, SpeedBoatTrip, Staff, Booking, Extra, PaymentMethod, TaxiBoatOption } from '../types';
import { Role } from '../types';
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
  currentUserRole: Role;
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
  const { activities, speedBoatTrips, taxiBoatOptions, staff, bookings, onBookActivity, onBookSpeedBoat, onBookExternalActivity, onBookPrivateTour, onBookStandaloneExtra, onBookTaxiBoat, currentUserRole } = props;
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

  const TABS: { id: SubView; label: string; icon: React.ReactNode; }[] = [
    { id: 'tours', label: 'Tours & Activities', icon: <RocketLaunchIcon className="w-5 h-5" /> },
    { id: 'boats', label: 'Boat Tickets', icon: <ShipIcon className="w-5 h-5" /> },
    { id: 'extras', label: 'Sell Extras', icon: <TagIcon className="w-5 h-5" /> },
    { id: 'report', label: 'Bookings Report', icon: <ChartBarIcon className="w-5 h-5" /> },
  ];

  const visibleTabs = useMemo(() => {
    if (currentUserRole === Role.Admin) {
      return TABS;
    }
    return TABS.filter(tab => tab.id !== 'report');
  }, [currentUserRole]);

  useEffect(() => {
    const isCurrentTabVisible = visibleTabs.some(tab => tab.id === activeTab);
    if (!isCurrentTabVisible) {
        setActiveTab(visibleTabs[0]?.id || 'tours');
    }
  }, [currentUserRole, activeTab, visibleTabs]);


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

  const handleOpenBookingModal = (activity: Activity) => {
    resetCommonStates();
    setSelectedActivity(activity);
    setIsBookingModalOpen(true);
  };
  const handleOpenExternalBookingModal = (activity: Activity) => {
    resetCommonStates();
    setSelectedExternalActivity(activity);
    setIsExternalBookingModalOpen(true);
  };
  const handleOpenSpeedBoatModal = (trip: SpeedBoatTrip) => {
    resetCommonStates();
    setSelectedTrip(trip);
    setIsSpeedBoatModalOpen(true);
  };
  const handleOpenPrivateTourModal = () => {
    resetCommonStates();
    setIsPrivateTourModalOpen(true);
  };
  const handleOpenExtraModal = (extra: Extra) => {
    resetCommonStates();
    setSelectedExtra(extra);
    setIsExtraModalOpen(true);
  };
  const handleOpenTaxiModal = (option: TaxiBoatOption) => {
    resetCommonStates();
    setSelectedTaxiOption(option);
    setIsTaxiModalOpen(true);
  }

  const handleCloseModals = () => {
    setIsBookingModalOpen(false);
    setIsExternalBookingModalOpen(false);
    setIsSpeedBoatModalOpen(false);
    setIsPrivateTourModalOpen(false);
    setIsExtraModalOpen(false);
    setIsTaxiModalOpen(false);
    setSelectedActivity(null);
    setSelectedExternalActivity(null);
    setSelectedTrip(null);
    setSelectedExtra(null);
    setSelectedTaxiOption(null);
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

  // Submission handlers
  const handleBookInternalActivity = () => {
    if (!selectedActivity || !selectedStaffId) return alert('Please select a staff member.');
    const { list: extrasList } = calculateExtras(selectedExtras);
    onBookActivity(selectedActivity.id, selectedStaffId, Number(discount) || 0, extrasList, paymentDetails.method, paymentDetails.receiptImage, Number(fuelCost) || undefined, Number(captainCost) || undefined);
    handleCloseModals();
  };

  const handleBookExternal = () => {
    if (!selectedExternalActivity || !selectedStaffId) return alert('Please select a staff member.');
    const { list: extrasList } = calculateExtras(selectedExtras);
    onBookExternalActivity(selectedExternalActivity.id, selectedStaffId, Number(commission) || 0, Number(discount) || 0, extrasList, paymentDetails.method, paymentDetails.receiptImage);
    handleCloseModals();
  };
  
  const handleBookSpeedBoat = () => {
    if (!selectedTrip || !selectedStaffId) return alert('Please select a staff member.');
    onBookSpeedBoat(selectedTrip.id, selectedStaffId, Number(commission) || 0, paymentDetails.method, paymentDetails.receiptImage);
    handleCloseModals();
  };

  const handleBookPrivate = () => {
    if (!selectedStaffId) return alert('Please select a staff member.');
    onBookPrivateTour(privateTourDetails.type, Number(privateTourDetails.price), selectedStaffId, Number(commission) || 0, paymentDetails.method, paymentDetails.receiptImage, Number(fuelCost) || undefined, Number(captainCost) || undefined);
    handleCloseModals();
  };
  
  const handleBookExtra = () => {
    if (!selectedExtra || !selectedStaffId) return alert('Please select a staff member.');
    onBookStandaloneExtra(selectedExtra, selectedStaffId, Number(commission) || 0, paymentDetails.method, paymentDetails.receiptImage);
    handleCloseModals();
  };

  const handleBookTaxi = () => {
    if (!selectedTaxiOption || !selectedStaffId) return alert('Please select a staff member.');
    onBookTaxiBoat(selectedTaxiOption.id, selectedStaffId, Number(commission) || 0, paymentDetails.method, paymentDetails.receiptImage);
    handleCloseModals();
  };

  // Report data
  const reportData = useMemo(() => {
    const totalRevenue = bookings.reduce((sum, b) => sum + b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0), 0);
    const totalEmployeeCommission = bookings.reduce((sum, b) => sum + b.employeeCommission, 0);
    const totalHostelCommission = bookings.reduce((sum, b) => sum + b.hostelCommission, 0);
    const totalBookings = bookings.length;
    const netProfit = totalHostelCommission - bookings.reduce((sum, b) => sum + (b.fuelCost || 0) + (b.captainCost || 0), 0);

    const staffPerformance = staff.map(s => {
        const staffBookings = bookings.filter(b => b.staffId === s.id);
        const revenue = staffBookings.reduce((sum, b) => sum + b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0), 0);
        const commission = staffBookings.reduce((sum, b) => sum + b.employeeCommission, 0);
        return {
            staffId: s.id,
            staffName: s.name,
            bookingsCount: staffBookings.length,
            totalRevenue: revenue,
            totalCommission: commission,
        };
    }).sort((a,b) => b.totalRevenue - a.totalRevenue);
    
    return {
        totalRevenue,
        totalEmployeeCommission,
        totalHostelCommission,
        netProfit,
        totalBookings,
        staffPerformance
    };
  }, [bookings, staff]);

  const currencyFormat = (value: number) => `฿${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Form Components
  const CommonFormFields = ({ includeCommission = false, includeDiscount = false, includeFuelAndCaptain = false }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Booking Staff</label>
            <select id="staffId" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required className="mt-1 block w-full input-field">
                <option value="">Select Staff</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
        </div>
        {includeCommission && (
            <div>
                <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Total Commission (THB)</label>
                <input type="number" id="commission" value={commission} onChange={(e) => setCommission(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
        )}
        {includeDiscount && (
             <div>
                <label htmlFor="discount" className="block text-sm font-medium text-slate-700">Discount (THB)</label>
                <input type="number" id="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1 block w-full input-field" />
            </div>
        )}
        {includeFuelAndCaptain && (
            <>
                <div>
                    <label htmlFor="fuelCost" className="block text-sm font-medium text-slate-700">Fuel Cost (THB)</label>
                    <input type="number" id="fuelCost" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
                <div>
                    <label htmlFor="captainCost" className="block text-sm font-medium text-slate-700">Captain Cost (THB)</label>
                    <input type="number" id="captainCost" value={captainCost} onChange={(e) => setCaptainCost(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
            </>
        )}
    </div>
  );

  const ExtrasFormFields = () => (
      <div>
          <h4 className="text-md font-semibold text-slate-800 border-b pb-2 mb-3">Add Extras</h4>
          <div className="space-y-3">
              {TOUR_EXTRAS.simple.map(extra => (
                  <div key={extra.id} className="flex items-center justify-between">
                      <label htmlFor={extra.id} className="text-sm text-slate-700">{extra.name} (+{extra.price} THB)</label>
                      <input id={extra.id} type="checkbox" checked={selectedExtras[extra.id]} onChange={(e) => setSelectedExtras(p => ({ ...p, [extra.id]: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </div>
              ))}
              <div className="border-t pt-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Paddle Board</p>
                  <select value={selectedExtras.paddleboardType} onChange={e => setSelectedExtras(p => ({...p, paddleboardType: e.target.value}))} className="w-full input-field text-sm">
                      <option value="none">None</option>
                      <option value="hour">{TOUR_EXTRAS.special.paddleboard.hour.name}</option>
                      <option value="day">{TOUR_EXTRAS.special.paddleboard.day.name}</option>
                  </select>
                  {selectedExtras.paddleboardType === 'hour' && (
                      <div className="mt-2">
                          <label htmlFor="paddleHours" className="text-xs text-slate-600">Hours:</label>
                          <input type="number" id="paddleHours" min="1" value={selectedExtras.paddleboardHours} onChange={e => setSelectedExtras(p => ({...p, paddleboardHours: e.target.value}))} className="w-full input-field text-sm mt-1" />
                      </div>
                  )}
              </div>
          </div>
      </div>
  );

  const PaymentFormFields = () => (
      <div>
          <h4 className="text-md font-semibold text-slate-800 border-b pb-2 mb-3">Payment</h4>
           <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">Method</label>
                <select id="paymentMethod" value={paymentDetails.method} onChange={(e) => setPaymentDetails(p => ({...p, method: e.target.value as PaymentMethod}))} className="mt-1 block w-full input-field">
                    <option>Cash</option>
                    <option>Credit Card</option>
                    <option>Internet Payment</option>
                </select>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Receipt (Optional)</label>
                <div className="mt-1 flex items-center">
                    <input type="file" id="receipt" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="receipt" className="cursor-pointer bg-white py-2 px-3 border border-slate-300 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        {paymentDetails.receiptImage ? 'Change Image' : 'Upload Image'}
                    </label>
                    {paymentDetails.receiptImage && <img src={paymentDetails.receiptImage} alt="Receipt Preview" className="ml-4 h-10 w-10 object-cover rounded" />}
                </div>
            </div>
      </div>
  );

  const ActivityCard: React.FC<{ activity: Activity, onBook: (activity: Activity) => void, onBookExternal: (activity: Activity) => void }> = ({ activity, onBook, onBookExternal }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <img src={activity.imageUrl} alt={activity.name} className="w-full h-40 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-slate-800">{activity.name}</h3>
            <p className="text-sm text-slate-600 mt-1 flex-grow">{activity.description}</p>
            <p className="text-xl font-extrabold text-blue-600 mt-3">{activity.price} THB</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => onBook(activity)} className="w-full px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Book Internal</button>
                <button onClick={() => onBookExternal(activity)} className="w-full px-3 py-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">Book External</button>
            </div>
        </div>
    </div>
  );


  return (
    <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Activities & Bookings</h1>
        <div className="border-b border-slate-200">
             <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto -mb-px" aria-label="Tabs">
                {visibleTabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        } whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center`}
                    >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>

        <div className="mt-6">
            {activeTab === 'tours' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map(act => <ActivityCard key={act.id} activity={act} onBook={handleOpenBookingModal} onBookExternal={handleOpenExternalBookingModal} />)}
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 flex flex-col justify-center items-center text-white">
                        <h3 className="text-xl font-bold">Private Tours</h3>
                        <p className="mt-2 text-center text-sm">Offer a custom experience for your guests.</p>
                        <button onClick={handleOpenPrivateTourModal} className="mt-4 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-md hover:bg-indigo-50 transition-colors">Create Booking</button>
                    </div>
                </div>
            )}
            {activeTab === 'boats' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Speed Boat Routes</h3>
                        <div className="space-y-2">
                            {speedBoatTrips.map(trip => (
                                <div key={trip.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                                    <div>
                                        <p className="font-medium text-slate-700">{trip.route}</p>
                                        <p className="text-sm text-slate-500">{trip.price} THB</p>
                                    </div>
                                    <button onClick={() => handleOpenSpeedBoatModal(trip)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Book</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">Taxi Boat</h3>
                         <div className="space-y-2">
                            {taxiBoatOptions.map(opt => (
                                <div key={opt.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                                    <div>
                                        <p className="font-medium text-slate-700">{opt.name}</p>
                                        <p className="text-sm text-slate-500">{opt.price} THB</p>
                                    </div>
                                    <button onClick={() => handleOpenTaxiModal(opt)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Book</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'extras' && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Sell Standalone Extras</h3>
                    <div className="space-y-2">
                        {TOUR_EXTRAS_LIST.map(extra => (
                             <div key={extra.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                                <div>
                                    <p className="font-medium text-slate-700">{extra.name}</p>
                                    <p className="text-sm text-slate-500">{extra.price} THB</p>
                                </div>
                                <button onClick={() => handleOpenExtraModal(extra)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Sell</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'report' && currentUserRole === Role.Admin && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                        <SummaryCard title="Total Bookings" value={reportData.totalBookings} icon={<TicketIcon />} />
                        <SummaryCard title="Total Revenue" value={currencyFormat(reportData.totalRevenue)} icon={<CurrencyDollarIcon />} />
                        <SummaryCard title="Staff Commission" value={currencyFormat(reportData.totalEmployeeCommission)} icon={<UserGroupIcon />} />
                        <SummaryCard title="Hostel Commission" value={currencyFormat(reportData.totalHostelCommission)} icon={<BuildingOfficeIcon />} />
                        <SummaryCard title="Net Profit" value={currencyFormat(reportData.netProfit)} icon={<TrendingUpIcon />} />
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Booking ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Item Name</th>
                                    <th className="px-6 py-3">Staff</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Receipt</th>
                                </tr>
                             </thead>
                             <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono text-xs">{b.id}</td>
                                        <td className="px-6 py-4">{b.bookingDate}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{b.itemName}</td>
                                        <td className="px-6 py-4">{staffMap.get(b.staffId) || 'N/A'}</td>
                                        <td className="px-6 py-4">{currencyFormat(b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0))}</td>
                                        <td className="px-6 py-4">
                                            {b.receiptImage ? <button onClick={() => setViewingReceipt(b.receiptImage)}><EyeIcon /></button> : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>

        {/* --- Modals --- */}
        <Modal isOpen={isBookingModalOpen} onClose={handleCloseModals} title={`Book: ${selectedActivity?.name}`}>
            <div className="space-y-6">
                <CommonFormFields includeDiscount includeFuelAndCaptain />
                <ExtrasFormFields />
                <PaymentFormFields />
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookInternalActivity} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isExternalBookingModalOpen} onClose={handleCloseModals} title={`Book External: ${selectedExternalActivity?.name}`}>
             <div className="space-y-6">
                <CommonFormFields includeCommission includeDiscount />
                <ExtrasFormFields />
                <PaymentFormFields />
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookExternal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

         <Modal isOpen={isSpeedBoatModalOpen} onClose={handleCloseModals} title={`Book: ${selectedTrip?.route}`}>
             <div className="space-y-6">
                <CommonFormFields includeCommission />
                <PaymentFormFields />
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookSpeedBoat} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isPrivateTourModalOpen} onClose={handleCloseModals} title="Book Private Tour">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="tourType" className="block text-sm font-medium text-slate-700">Tour Type</label>
                        <select id="tourType" value={privateTourDetails.type} onChange={e => setPrivateTourDetails(p => ({...p, type: e.target.value as PrivateTourType}))} className="mt-1 block w-full input-field">
                            <option>Half Day</option>
                            <option>Full Day</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tourPrice" className="block text-sm font-medium text-slate-700">Total Price (THB)</label>
                        <input type="number" id="tourPrice" value={privateTourDetails.price} onChange={e => setPrivateTourDetails(p => ({...p, price: e.target.value}))} required className="mt-1 block w-full input-field" />
                    </div>
                </div>
                <CommonFormFields includeCommission includeFuelAndCaptain />
                <PaymentFormFields />
                 <div className="flex justify-end pt-4">
                    <button onClick={handleBookPrivate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isExtraModalOpen} onClose={handleCloseModals} title={`Sell: ${selectedExtra?.name}`}>
            <div className="space-y-6">
                <CommonFormFields includeCommission />
                <PaymentFormFields />
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookExtra} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Sale</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isTaxiModalOpen} onClose={handleCloseModals} title={`Book Taxi: ${selectedTaxiOption?.name}`}>
             <div className="space-y-6">
                <CommonFormFields includeCommission />
                <PaymentFormFields />
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookTaxi} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={!!viewingReceipt} onClose={() => setViewingReceipt(null)} title="View Receipt">
            {viewingReceipt && <img src={viewingReceipt} alt="Receipt" className="w-full h-auto rounded-md" />}
        </Modal>
         <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </div>
  );
};
