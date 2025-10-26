import React, { useState, useMemo, useEffect } from 'react';
import type { Activity, Extra, Staff, PaymentType } from '../../types';
import { Role } from '../../types';
import Modal from '../Modal';

const initialExtrasState = {
    paddleboardType: 'none',
    paddleboardHours: 1,
};

const initialPrivateTourState = {
    type: 'Half Day' as 'Half Day' | 'Full Day',
    price: '',
};

const CommonFormFields: React.FC<{
    staff: Staff[];
    selectedStaffId: string;
    onStaffChange: (id: string) => void;
    numberOfPeople: string;
    onPeopleChange: (num: string) => void;
    commission?: string;
    onCommissionChange?: (value: string) => void;
    discount?: string;
    onDiscountChange?: (value: string) => void;
    fuelCost?: string;
    onFuelCostChange?: (value: string) => void;
    captainCost?: string;
    onCaptainCostChange?: (value: string) => void;
    employeeCommission?: string;
    onEmployeeCommissionChange?: (value: string) => void;
    hostelCommission?: string;
    onHostelCommissionChange?: (value: string) => void;
    includeCommission?: boolean;
    includeDiscount?: boolean;
    includeFuelAndCaptain?: boolean;
    includePeopleCount?: boolean;
    currentUserRole: Role;
}> = ({ staff, selectedStaffId, onStaffChange, numberOfPeople, onPeopleChange, commission, onCommissionChange, discount, onDiscountChange, fuelCost, onFuelCostChange, captainCost, onCaptainCostChange, employeeCommission, onEmployeeCommissionChange, hostelCommission, onHostelCommissionChange, includeCommission, includeDiscount, includeFuelAndCaptain, includePeopleCount, currentUserRole }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Booking Staff</label>
            <select id="staffId" value={selectedStaffId} onChange={(e) => onStaffChange(e.target.value)} required className="mt-1 block w-full input-field">
                <option value="">Select Staff</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
        </div>
        {includePeopleCount && (
             <div>
                <label htmlFor="numberOfPeople" className="block text-sm font-medium text-slate-700">Number of People</label>
                <input type="number" id="numberOfPeople" value={numberOfPeople} onChange={(e) => onPeopleChange(e.target.value)} min="1" required className="mt-1 block w-full input-field" />
            </div>
        )}
        {includeCommission && currentUserRole === Role.Admin && onCommissionChange && (
            <div>
                <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Total Commission (THB)</label>
                <input type="number" id="commission" value={commission} onChange={(e) => onCommissionChange(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
        )}
        {includeDiscount && onDiscountChange &&(
             <div>
                <label htmlFor="discount" className="block text-sm font-medium text-slate-700">Discount (THB)</label>
                <input type="number" id="discount" value={discount} onChange={(e) => onDiscountChange(e.target.value)} className="mt-1 block w-full input-field" />
            </div>
        )}
        {includeFuelAndCaptain && currentUserRole === Role.Admin && onFuelCostChange && onCaptainCostChange && (
            <>
                <div>
                    <label htmlFor="fuelCost" className="block text-sm font-medium text-slate-700">Fuel Cost (THB)</label>
                    <input type="number" id="fuelCost" value={fuelCost} onChange={(e) => onFuelCostChange(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
                <div>
                    <label htmlFor="captainCost" className="block text-sm font-medium text-slate-700">Captain Cost (THB)</label>
                    <input type="number" id="captainCost" value={captainCost} onChange={(e) => onCaptainCostChange(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
            </>
        )}
        {currentUserRole === Role.Admin && onEmployeeCommissionChange && onHostelCommissionChange && (
            <>
                <div>
                    <label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission (THB)</label>
                    <input type="number" id="employeeCommission" value={employeeCommission} onChange={(e) => onEmployeeCommissionChange(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
                <div>
                    <label htmlFor="hostelCommission" className="block text-sm font-medium text-slate-700">Hostel Commission (THB)</label>
                    <input type="number" id="hostelCommission" value={hostelCommission} onChange={(e) => onHostelCommissionChange(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
            </>
        )}
    </div>
);

const ExtrasFormFields: React.FC<{ TOUR_EXTRAS: any, selectedExtras: any, onExtrasChange: (extras: any) => void }> = ({ TOUR_EXTRAS, selectedExtras, onExtrasChange }) => (
      <div>
          <h4 className="text-md font-semibold text-slate-800 border-b pb-2 mb-3">Add Extras</h4>
          <div className="space-y-3">
              {TOUR_EXTRAS.simple.map((extra: Extra) => (
                  <div key={extra.id} className="flex items-center justify-between">
                      <label htmlFor={extra.id} className="text-sm text-slate-700">{extra.name} (+{extra.price} THB)</label>
                      <input id={extra.id} type="checkbox" checked={!!selectedExtras[extra.id]} onChange={(e) => onExtrasChange({ ...selectedExtras, [extra.id]: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </div>
              ))}
              <div className="border-t pt-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Paddle Board</p>
                  <select value={selectedExtras.paddleboardType} onChange={e => onExtrasChange({...selectedExtras, paddleboardType: e.target.value})} className="w-full input-field text-sm">
                      <option value="none">None</option>
                      <option value="hour">{TOUR_EXTRAS.special.paddleboard.hour.name}</option>
                      <option value="day">{TOUR_EXTRAS.special.paddleboard.day.name}</option>
                  </select>
                  {selectedExtras.paddleboardType === 'hour' && (
                      <div className="mt-2">
                          <label htmlFor="paddleHours" className="text-xs text-slate-600">Hours:</label>
                          <input type="number" id="paddleHours" min="1" value={selectedExtras.paddleboardHours} onChange={e => onExtrasChange({...selectedExtras, paddleboardHours: e.target.value})} className="w-full input-field text-sm mt-1" />
                      </div>
                  )}
              </div>
          </div>
      </div>
);

const PaymentFormFields: React.FC<{ paymentDetails: { method: string, receiptImage?: string }, onPaymentChange: (details: { method: string, receiptImage?: string }) => void, paymentTypes: PaymentType[] }> = ({ paymentDetails, onPaymentChange, paymentTypes }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            onPaymentChange({ ...paymentDetails, receiptImage: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
    };
    return (
      <div>
          <h4 className="text-md font-semibold text-slate-800 border-b pb-2 mb-3">Payment</h4>
           <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">Method</label>
                <select id="paymentMethod" value={paymentDetails.method} onChange={(e) => onPaymentChange({...paymentDetails, method: e.target.value as string})} className="mt-1 block w-full input-field">
                    {paymentTypes.map(pt => <option key={pt.id} value={pt.name}>{pt.name}</option>)}
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
};


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


interface ToursActivitiesProps {
    activities: Activity[];
    staff: Staff[];
    extras: Extra[];
    paymentTypes: PaymentType[];
    onBookActivity: (activityId: string, staffId: string, numberOfPeople: number, discount: number, extras: Omit<Extra, 'id'>[], paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number, hostelCommission?: number) => void;
    onBookExternalActivity: (activityId: string, staffId: string, numberOfPeople: number, totalCommission: number, discount: number, extras: Omit<Extra, 'id'>[], paymentMethod: string, bookingDate: string, receiptImage?: string) => void;
    onBookPrivateTour: (tourType: 'Half Day' | 'Full Day', price: number, numberOfPeople: number, staffId: string, totalCommission: number, paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number) => void;
    currentUserRole: Role;
}

const ToursActivities: React.FC<ToursActivitiesProps> = ({ activities, staff, extras, paymentTypes, onBookActivity, onBookExternalActivity, onBookPrivateTour, currentUserRole }) => {
    // Modal States
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isExternalBookingModalOpen, setIsExternalBookingModalOpen] = useState(false);
    const [selectedExternalActivity, setSelectedExternalActivity] = useState<Activity | null>(null);
    const [isPrivateTourModalOpen, setIsPrivateTourModalOpen] = useState(false);
    
    const initialPaymentState = useMemo(() => ({
        method: paymentTypes[0]?.name || '',
        receiptImage: undefined as string | undefined,
    }), [paymentTypes]);

    // Common form states
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [commission, setCommission] = useState<string>('');
    const [discount, setDiscount] = useState<string>('');
    const [selectedExtras, setSelectedExtras] = useState(initialExtrasState);
    // Fix: Explicitly type the state to ensure `receiptImage` is optional.
    const [paymentDetails, setPaymentDetails] = useState<{ method: string; receiptImage?: string }>(initialPaymentState);
    const [privateTourDetails, setPrivateTourDetails] = useState(initialPrivateTourState);
    const [fuelCost, setFuelCost] = useState('');
    const [captainCost, setCaptainCost] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('1');
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [employeeCommission, setEmployeeCommission] = useState('');
    const [hostelCommission, setHostelCommission] = useState('');

    useEffect(() => {
        setPaymentDetails(initialPaymentState);
    }, [initialPaymentState]);

    const currencyFormat = (value: number) => `฿${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    
    const TOUR_EXTRAS = useMemo(() => {
        const simple = extras.filter(e => !e.id.startsWith('paddle'));
        const paddle_hour = extras.find(e => e.id === 'paddle_hour');
        const paddle_day = extras.find(e => e.id === 'paddle_day');
        return { simple, special: { paddleboard: { hour: paddle_hour || { id: 'paddle_hour', name: 'Paddle board (per hour)', price: 0 }, day: paddle_day || { id: 'paddle_day', name: 'Paddle board (per day)', price: 0 } } } };
    }, [extras]);
    
    const dynamicInitialExtrasState = useMemo(() => ({ ...extras.reduce((acc, extra) => ({ ...acc, [extra.id]: false }), {} as Record<string, boolean>), ...initialExtrasState }), [extras]);
    useEffect(() => { setSelectedExtras(dynamicInitialExtrasState); }, [dynamicInitialExtrasState]);
    
    const calculateExtras = (currentExtras: Record<string, string | number | boolean>): { list: Omit<Extra, 'id'>[], total: number } => {
        const list: Omit<Extra, 'id'>[] = [];
        let total = 0;
        TOUR_EXTRAS.simple.forEach(extra => {
            if (currentExtras[extra.id]) { list.push({ name: extra.name, price: extra.price }); total += extra.price; }
        });
        if (currentExtras.paddleboardType === 'hour') {
            const hours = Math.max(1, Number(currentExtras.paddleboardHours) || 1); const price = TOUR_EXTRAS.special.paddleboard.hour.price * hours;
            list.push({ name: `${TOUR_EXTRAS.special.paddleboard.hour.name} x${hours}`, price }); total += price;
        } else if (currentExtras.paddleboardType === 'day') {
            list.push({ name: TOUR_EXTRAS.special.paddleboard.day.name, price: TOUR_EXTRAS.special.paddleboard.day.price }); total += TOUR_EXTRAS.special.paddleboard.day.price;
        }
        return { list, total };
    };
    
    const resetCommonStates = () => {
        setSelectedStaffId(''); setCommission(''); setDiscount(''); setSelectedExtras(dynamicInitialExtrasState); setPaymentDetails(initialPaymentState);
        setPrivateTourDetails(initialPrivateTourState); setFuelCost(''); setCaptainCost(''); setNumberOfPeople('1'); setBookingDate(new Date().toISOString().split('T')[0]);
        setEmployeeCommission(''); setHostelCommission('');
    };

    const handleOpenBookingModal = (activity: Activity) => { resetCommonStates(); setSelectedActivity(activity); setIsBookingModalOpen(true); };
    const handleOpenExternalBookingModal = (activity: Activity) => { resetCommonStates(); setSelectedExternalActivity(activity); setIsExternalBookingModalOpen(true); };
    const handleOpenPrivateTourModal = () => { resetCommonStates(); setIsPrivateTourModalOpen(true); };
    const handleCloseModals = () => { setIsBookingModalOpen(false); setIsExternalBookingModalOpen(false); setIsPrivateTourModalOpen(false); setSelectedActivity(null); setSelectedExternalActivity(null); };
    
    const handleBookInternalActivity = () => {
        if (!selectedActivity || !selectedStaffId) return alert('Please select a staff member.');
        const { list: extrasList } = calculateExtras(selectedExtras);
        onBookActivity(selectedActivity.id, selectedStaffId, Number(numberOfPeople), Number(discount) || 0, extrasList, paymentDetails.method, bookingDate, paymentDetails.receiptImage, Number(fuelCost) || undefined, Number(captainCost) || undefined, Number(employeeCommission) || undefined, Number(hostelCommission) || undefined);
        handleCloseModals();
    };

    const handleBookExternal = () => {
        if (!selectedExternalActivity || !selectedStaffId) return alert('Please select a staff member.');
        const { list: extrasList } = calculateExtras(selectedExtras);
        onBookExternalActivity(selectedExternalActivity.id, selectedStaffId, Number(numberOfPeople), Number(commission) || 0, Number(discount) || 0, extrasList, paymentDetails.method, bookingDate, paymentDetails.receiptImage);
        handleCloseModals();
    };

    const handleBookPrivate = () => {
        if (!selectedStaffId) return alert('Please select a staff member.');
        onBookPrivateTour(privateTourDetails.type, Number(privateTourDetails.price), Number(numberOfPeople), selectedStaffId, Number(commission) || 0, paymentDetails.method, bookingDate, paymentDetails.receiptImage, Number(fuelCost) || undefined, Number(captainCost) || undefined);
        handleCloseModals();
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map(act => <ActivityCard key={act.id} activity={act} onBook={handleOpenBookingModal} onBookExternal={handleOpenExternalBookingModal} />)}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 flex flex-col justify-center items-center text-white">
                    <h3 className="text-xl font-bold">Private Tours</h3>
                    <p className="mt-2 text-center text-sm">Offer a custom experience for your guests.</p>
                    <button onClick={handleOpenPrivateTourModal} className="mt-4 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-md hover:bg-indigo-50 transition-colors">Create Booking</button>
                </div>
            </div>

            <Modal isOpen={isBookingModalOpen} onClose={handleCloseModals} title={`Book: ${selectedActivity?.name}`}>
                <div className="space-y-6">
                    <div><label htmlFor="bookingDate" className="block text-sm font-medium">Booking Date</label><input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" /></div>
                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} numberOfPeople={numberOfPeople} onPeopleChange={setNumberOfPeople} discount={discount} onDiscountChange={setDiscount} fuelCost={fuelCost} onFuelCostChange={setFuelCost} captainCost={captainCost} onCaptainCostChange={setCaptainCost} employeeCommission={employeeCommission} onEmployeeCommissionChange={setEmployeeCommission} hostelCommission={hostelCommission} onHostelCommissionChange={setHostelCommission} includeDiscount includeFuelAndCaptain includePeopleCount currentUserRole={currentUserRole} />
                    <ExtrasFormFields TOUR_EXTRAS={TOUR_EXTRAS} selectedExtras={selectedExtras} onExtrasChange={setSelectedExtras} />
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                    {(() => {
                        const numPeople = Number(numberOfPeople) || 1; const baseTotal = (selectedActivity?.price || 0) * numPeople; const { list: extrasList, total: extrasTotal } = calculateExtras(selectedExtras); const finalTotal: number = baseTotal + extrasTotal - (Number(discount) || 0);
                        return (<div className="mt-6 p-4 bg-slate-50 rounded-lg"><h4 className="text-lg font-semibold mb-2">Booking Summary</h4><div className="space-y-1 text-sm"><div className="flex justify-between"><span>{selectedActivity?.name} ({numPeople} x {currencyFormat(selectedActivity?.price || 0)})</span><span>{currencyFormat(baseTotal)}</span></div>{extrasList.length > 0 && (<div className="flex justify-between border-t mt-1 pt-1"><span>Extras Total</span><span>{currencyFormat(extrasTotal)}</span></div>)}{(Number(discount) || 0) > 0 && (<div className="flex justify-between text-red-600"><span>Discount</span><span>-{currencyFormat(Number(discount) || 0)}</span></div>)}<div className="flex justify-between font-bold text-base pt-2 border-t mt-2"><span>Total</span><span>{currencyFormat(finalTotal)}</span></div></div></div>);
                    })()}
                    <div className="flex justify-end pt-4"><button onClick={handleBookInternalActivity} className="px-4 py-2 bg-blue-600 text-white rounded-md">Confirm Booking</button></div>
                </div>
            </Modal>

            <Modal isOpen={isExternalBookingModalOpen} onClose={handleCloseModals} title={`Book External: ${selectedExternalActivity?.name}`}>
                 <div className="space-y-6">
                    <div><label htmlFor="bookingDate" className="block text-sm font-medium">Booking Date</label><input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" /></div>
                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} numberOfPeople={numberOfPeople} onPeopleChange={setNumberOfPeople} commission={commission} onCommissionChange={setCommission} discount={discount} onDiscountChange={setDiscount} includeCommission includeDiscount includePeopleCount currentUserRole={currentUserRole}/>
                    <ExtrasFormFields TOUR_EXTRAS={TOUR_EXTRAS} selectedExtras={selectedExtras} onExtrasChange={setSelectedExtras} />
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                     {(() => {
                        const numPeople = Number(numberOfPeople) || 1; const baseTotal = (selectedExternalActivity?.price || 0) * numPeople; const { list: extrasList, total: extrasTotal } = calculateExtras(selectedExtras); const finalTotal: number = baseTotal + extrasTotal - (Number(discount) || 0);
                        return (<div className="mt-6 p-4 bg-slate-50 rounded-lg"><h4 className="text-lg font-semibold mb-2">Booking Summary</h4><div className="space-y-1 text-sm"><div className="flex justify-between"><span>{selectedExternalActivity?.name} ({numPeople} x {currencyFormat(selectedExternalActivity?.price || 0)})</span><span>{currencyFormat(baseTotal)}</span></div>{extrasList.length > 0 && (<div className="flex justify-between border-t mt-1 pt-1"><span>Extras Total</span><span>{currencyFormat(extrasTotal)}</span></div>)}{(Number(discount) || 0) > 0 && (<div className="flex justify-between text-red-600"><span>Discount</span><span>-{currencyFormat(Number(discount) || 0)}</span></div>)}<div className="flex justify-between font-bold text-base pt-2 border-t mt-2"><span>Total</span><span>{currencyFormat(finalTotal)}</span></div></div></div>);
                    })()}
                    <div className="flex justify-end pt-4"><button onClick={handleBookExternal} className="px-4 py-2 bg-blue-600 text-white rounded-md">Confirm Booking</button></div>
                </div>
            </Modal>
            
            <Modal isOpen={isPrivateTourModalOpen} onClose={handleCloseModals} title="Book Private Tour">
                <div className="space-y-6">
                    <div><label htmlFor="bookingDate" className="block text-sm font-medium">Booking Date</label><input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label htmlFor="tourType" className="block text-sm font-medium">Tour Type</label><select id="tourType" value={privateTourDetails.type} onChange={e => setPrivateTourDetails(p => ({...p, type: e.target.value as 'Half Day' | 'Full Day'}))} className="mt-1 block w-full input-field"><option>Half Day</option><option>Full Day</option></select></div>
                        <div><label htmlFor="tourPrice" className="block text-sm font-medium">Total Price (THB)</label><input type="number" id="tourPrice" value={privateTourDetails.price} onChange={e => setPrivateTourDetails(p => ({...p, price: e.target.value}))} required className="mt-1 block w-full input-field" /></div>
                    </div>
                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} numberOfPeople={numberOfPeople} onPeopleChange={setNumberOfPeople} commission={commission} onCommissionChange={setCommission} fuelCost={fuelCost} onFuelCostChange={setFuelCost} captainCost={captainCost} onCaptainCostChange={setCaptainCost} includeCommission includeFuelAndCaptain includePeopleCount currentUserRole={currentUserRole}/>
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                    <div className="flex justify-end pt-4"><button onClick={handleBookPrivate} className="px-4 py-2 bg-blue-600 text-white rounded-md">Confirm Booking</button></div>
                </div>
            </Modal>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </>
    );
};

export default ToursActivities;