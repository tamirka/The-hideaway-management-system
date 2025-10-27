import React, { useState, useMemo, useEffect } from 'react';
import type { Booking, ExternalSale, PlatformPayment, UtilityRecord, SalaryAdvance, WalkInGuest, AccommodationBooking, Staff, SpeedBoatTrip, Room } from '../../types';
import Modal from '../Modal';
// Fix: Import newly added TrendingUpIcon and BuildingOfficeIcon.
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, CurrencyDollarIcon, ReceiptPercentIcon, TrendingUpIcon, BuildingOfficeIcon } from '../../constants';

// --- Sub-Components & Forms ---
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

interface ExternalSaleFormProps {
    onSave: (sale: Omit<ExternalSale, 'id'> | ExternalSale) => void;
    onClose: () => void;
    initialData?: ExternalSale | null;
}
const ExternalSaleForm: React.FC<ExternalSaleFormProps> = ({ onSave, onClose, initialData }) => {
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [description, setDescription] = useState(initialData?.description || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const saleData = { date, amount: Number(amount) || 0, description };
        if (initialData) { onSave({ ...initialData, ...saleData }); } else { onSave(saleData); }
        onClose();
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="saleDate" className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" id="saleDate" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="saleAmount" className="block text-sm font-medium text-slate-700">Total Amount (THB)</label>
                <input type="number" id="saleAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="saleDescription" className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                <textarea id="saleDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Sale'}</button>
            </div>
        </form>
    );
};

interface PlatformPaymentFormProps {
    onSave: (payment: Omit<PlatformPayment, 'id'> | PlatformPayment) => void;
    onClose: () => void;
    initialData?: PlatformPayment | null;
}
const PlatformPaymentForm: React.FC<PlatformPaymentFormProps> = ({ onSave, onClose, initialData }) => {
    const PLATFORMS = ['Booking.com', 'Hostelworld', 'Agoda'];
    const initialPlatform = initialData?.platform && !PLATFORMS.includes(initialData.platform) ? 'Other' : initialData?.platform || '';

    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [platform, setPlatform] = useState(initialPlatform);
    const [otherPlatform, setOtherPlatform] = useState(initialData?.platform && !PLATFORMS.includes(initialData.platform) ? initialData.platform : '');
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [bookingReference, setBookingReference] = useState(initialData?.bookingReference || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalPlatform = platform === 'Other' ? otherPlatform : platform;
        if (!finalPlatform) { alert('Please select or specify a platform.'); return; }

        const paymentData = { date, platform: finalPlatform, amount: Number(amount) || 0, bookingReference };
        if (initialData) { onSave({ ...initialData, ...paymentData }); } else { onSave(paymentData); }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="paymentDate" className="block text-sm font-medium text-slate-700">Date</label><input type="date" id="paymentDate" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-field" /></div>
            <div>
                <label htmlFor="platform" className="block text-sm font-medium text-slate-700">Platform</label>
                <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} required className="mt-1 block w-full input-field">
                    <option value="">Select a platform...</option>{PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}<option value="Other">Other</option>
                </select>
            </div>
            {platform === 'Other' && ( <div><label htmlFor="otherPlatform" className="block text-sm font-medium text-slate-700">Specify Platform Name</label><input type="text" id="otherPlatform" value={otherPlatform} onChange={(e) => setOtherPlatform(e.target.value)} required className="mt-1 block w-full input-field" /></div> )}
            <div><label htmlFor="paymentAmount" className="block text-sm font-medium text-slate-700">Total Amount (THB)</label><input type="number" id="paymentAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="bookingReference" className="block text-sm font-medium text-slate-700">Booking Reference (Optional)</label><input type="text" id="bookingReference" value={bookingReference} onChange={(e) => setBookingReference(e.target.value)} className="mt-1 block w-full input-field" /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Payment'}</button>
            </div>
        </form>
    );
};

interface EditBookingFormProps {
    booking: Booking;
    onSave: (booking: Booking) => void;
    onClose: () => void;
}
const EditBookingForm: React.FC<EditBookingFormProps> = ({ booking, onSave, onClose }) => {
    const [employeeCommission, setEmployeeCommission] = useState(booking.employeeCommission?.toString() || '');
    const [hostelCommission, setHostelCommission] = useState(booking.hostelCommission?.toString() || '');

    const handleSave = () => {
        const updatedBooking = {
            ...booking,
            employeeCommission: Number(employeeCommission) || undefined,
            hostelCommission: Number(hostelCommission) || undefined,
        };
        onSave(updatedBooking);
        onClose();
    };

    const canEditEmployeeCommission = ['activity', 'external_activity', 'private_tour'].includes(booking.itemType);
    const canEditHostelCommission = booking.itemType === 'private_tour';

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
                <p><span className="font-semibold">Item:</span> {booking.itemName}</p>
                <p><span className="font-semibold">Date:</span> {booking.bookingDate}</p>
            </div>
            {canEditEmployeeCommission && (
                <div>
                    <label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission (THB)</label>
                    <input type="number" id="employeeCommission" value={employeeCommission} onChange={(e) => setEmployeeCommission(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
            )}
            {canEditHostelCommission && (
                <div>
                    <label htmlFor="hostelCommission" className="block text-sm font-medium text-slate-700">Hostel Commission (THB)</label>
                    <input type="number" id="hostelCommission" value={hostelCommission} onChange={(e) => setHostelCommission(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
            )}
            {!canEditEmployeeCommission && !canEditHostelCommission && (
                <p className="text-sm text-slate-600">This booking type does not support commissions.</p>
            )}
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
            </div>
        </form>
    );
};


// --- Main Component ---
interface BookingsReportProps {
  bookings: Booking[];
  externalSales: ExternalSale[];
  platformPayments: PlatformPayment[];
  utilityRecords: UtilityRecord[];
  salaryAdvances: SalaryAdvance[];
  walkInGuests: WalkInGuest[];
  accommodationBookings: AccommodationBooking[];
  staff: Staff[];
  speedBoatTrips: SpeedBoatTrip[];
  rooms: Room[];
  onUpdateBooking: (updatedBooking: Booking) => void;
  onAddExternalSale: (newSale: Omit<ExternalSale, 'id'>) => void;
  onUpdateExternalSale: (updatedSale: ExternalSale) => void;
  onDeleteExternalSale: (saleId: string) => void;
  onAddPlatformPayment: (newPayment: Omit<PlatformPayment, 'id'>) => void;
  onUpdatePlatformPayment: (updatedPayment: PlatformPayment) => void;
  onDeletePlatformPayment: (paymentId: string) => void;
}

const BookingsReport: React.FC<BookingsReportProps> = ({ bookings, externalSales, platformPayments, utilityRecords, salaryAdvances, walkInGuests, accommodationBookings, staff, speedBoatTrips, rooms, onUpdateBooking, onAddExternalSale, onUpdateExternalSale, onDeleteExternalSale, onAddPlatformPayment, onUpdatePlatformPayment, onDeletePlatformPayment }) => {
    // State
    const [reportGranularity, setReportGranularity] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
    const [isExternalSaleModalOpen, setIsExternalSaleModalOpen] = useState(false);
    const [editingExternalSale, setEditingExternalSale] = useState<ExternalSale | null>(null);
    const [isPlatformPaymentModalOpen, setIsPlatformPaymentModalOpen] = useState(false);
    const [editingPlatformPayment, setEditingPlatformPayment] = useState<PlatformPayment | null>(null);
    const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    
    const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s.name])), [staff]);
    const roomMap = useMemo(() => new Map(rooms.map(r => [r.id, r.name])), [rooms]);

    // Handlers
    const handleCloseModals = () => {
        setViewingReceipt(null);
        setIsExternalSaleModalOpen(false);
        setEditingExternalSale(null);
        setIsPlatformPaymentModalOpen(false);
        setEditingPlatformPayment(null);
        setIsEditBookingModalOpen(false);
        setEditingBooking(null);
    };
    const handleOpenExternalSaleModal = (sale?: ExternalSale) => { setEditingExternalSale(sale || null); setIsExternalSaleModalOpen(true); };
    const handleSaveExternalSale = (saleData: Omit<ExternalSale, 'id'> | ExternalSale) => { if ('id' in saleData) { onUpdateExternalSale(saleData); } else { onAddExternalSale(saleData); } handleCloseModals(); };
    const handleOpenPlatformPaymentModal = (payment?: PlatformPayment) => { setEditingPlatformPayment(payment || null); setIsPlatformPaymentModalOpen(true); };
    const handleSavePlatformPayment = (paymentData: Omit<PlatformPayment, 'id'> | PlatformPayment) => { if ('id' in paymentData) { onUpdatePlatformPayment(paymentData); } else { onAddPlatformPayment(paymentData); } handleCloseModals(); };
    const handleOpenEditBookingModal = (booking: Booking) => { setEditingBooking(booking); setIsEditBookingModalOpen(true); };


    // Memos for data processing...
    const currentFilter = useMemo(() => {
        if (reportGranularity === 'yearly') {
            if (selectedYear && /^\d{4}$/.test(selectedYear)) { return selectedYear; }
            return new Date().getFullYear().toString();
        }
        return selectedMonth;
    }, [reportGranularity, selectedMonth, selectedYear]);

    const reportPeriodTitle = useMemo(() => {
        if (reportGranularity === 'yearly') { return currentFilter; }
        try { return new Date(selectedMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' });
        } catch { return 'Invalid Date'; }
    }, [reportGranularity, selectedMonth, currentFilter]);
    
    const filteredBookings = useMemo(() => bookings.filter(b => b.bookingDate.startsWith(currentFilter)), [bookings, currentFilter]);
    const filteredExternalSales = useMemo(() => externalSales.filter(s => s.date.startsWith(currentFilter)), [externalSales, currentFilter]);
    const filteredPlatformPayments = useMemo(() => platformPayments.filter(p => p.date.startsWith(currentFilter)), [platformPayments, currentFilter]);
    const filteredUtilityRecords = useMemo(() => utilityRecords.filter(r => r.date.startsWith(currentFilter)), [utilityRecords, currentFilter]);
    const filteredSalaryAdvances = useMemo(() => salaryAdvances.filter(a => a.date.startsWith(currentFilter)), [salaryAdvances, currentFilter]);
    const filteredWalkInGuests = useMemo(() => walkInGuests.filter(g => g.checkInDate.startsWith(currentFilter)), [walkInGuests, currentFilter]);
    const filteredAccommodationBookings = useMemo(() => accommodationBookings.filter(b => b.checkInDate.startsWith(currentFilter)), [accommodationBookings, currentFilter]);

    const reportData = useMemo(() => {
        const totalActivityBookingRevenue = filteredBookings.reduce((sum, b) => sum + b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0), 0);
        
        const totalExtrasRevenue = filteredBookings.reduce((sum, b) => {
            if (b.itemType === 'extra') {
                return sum + b.customerPrice - (b.discount || 0); // Standalone extra
            }
            return sum + (b.extrasTotal || 0); // Extras attached to other bookings
        }, 0);

        const totalExternalSales = filteredExternalSales.reduce((sum, s) => sum + s.amount, 0);
        const totalWalkInRevenue = filteredWalkInGuests.reduce((sum, g) => sum + g.amountPaid, 0);
        const totalPlatformBookingRevenue = filteredAccommodationBookings.reduce((sum, b) => sum + b.amountPaid, 0);
        const totalAccommodationRevenue = totalWalkInRevenue + totalPlatformBookingRevenue;
        const totalRevenue = totalActivityBookingRevenue + totalExternalSales + totalAccommodationRevenue;
        
        const totalUtilitiesCost = filteredUtilityRecords.reduce((sum, r) => sum + r.cost, 0);
        const totalItemCosts = filteredBookings.reduce((sum, b) => sum + (b.itemCost || 0), 0);
        const totalEmployeeCommissions = filteredBookings.reduce((sum, b) => sum + (b.employeeCommission || 0), 0);
        const totalSalaries = staff.reduce((sum, s) => sum + s.salary, 0);
        const totalCalculatedSalaries = reportGranularity === 'yearly' ? totalSalaries * 12 : totalSalaries;
        const totalSalaryAdvances = filteredSalaryAdvances.reduce((sum, a) => sum + a.amount, 0);
        const totalExpenses = totalUtilitiesCost + totalItemCosts + totalCalculatedSalaries + totalSalaryAdvances + totalEmployeeCommissions;

        const netProfit = totalRevenue - totalExpenses;

        const staffPerformance = staff.map(s => {
            const staffBookings = filteredBookings.filter(b => b.staffId === s.id);
            return {
                staffId: s.id, staffName: s.name,
                bookingsCount: staffBookings.length,
                totalRevenue: staffBookings.reduce((sum, b) => sum + b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0), 0),
                totalCommission: staffBookings.reduce((sum, b) => sum + (b.employeeCommission || 0), 0),
            };
        }).sort((a,b) => b.totalRevenue - a.totalRevenue);

        // Fix: Correctly typed the reduce accumulator to ensure Object.entries infers the correct value type.
        const companyDebts = filteredBookings
            .filter(b => b.itemType === 'speedboat')
            .reduce((acc: Record<string, number>, booking) => {
                const trip = speedBoatTrips.find(t => t.id === booking.itemId);
                if (trip) { acc[trip.company] = (acc[trip.company] || 0) + (booking.itemCost || 0); }
                return acc;
            }, {});
    
        return { totalRevenue, totalAccommodationRevenue, totalActivityBookingRevenue, totalExtrasRevenue, totalExternalSales, totalExpenses, totalMonthlySalaries: totalCalculatedSalaries, totalUtilitiesCost, totalItemCosts, totalSalaryAdvances, totalEmployeeCommissions, netProfit, staffPerformance, companyDebts };
    }, [filteredBookings, filteredExternalSales, filteredPlatformPayments, filteredUtilityRecords, filteredSalaryAdvances, filteredWalkInGuests, filteredAccommodationBookings, staff, speedBoatTrips, reportGranularity]);
    
    const currencyFormat = (value: number) => `฿${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-center gap-x-6 gap-y-4">
                {/* Filters UI */}
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-slate-600">View Report By:</span>
                    <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="granularity" value="monthly" checked={reportGranularity === 'monthly'} onChange={() => setReportGranularity('monthly')} className="form-radio text-blue-600" /><span className="text-sm">Monthly</span></label>
                        <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="granularity" value="yearly" checked={reportGranularity === 'yearly'} onChange={() => setReportGranularity('yearly')} className="form-radio text-blue-600" /><span className="text-sm">Yearly</span></label>
                    </div>
                </div>
                {reportGranularity === 'monthly' && (<div><label htmlFor="month-filter" className="text-sm font-medium text-slate-600">Month:</label><input type="month" id="month-filter" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="ml-2 rounded-md border-slate-300 shadow-sm text-sm py-1"/></div>)}
                {reportGranularity === 'yearly' && (<div><label htmlFor="year-filter" className="text-sm font-medium text-slate-600">Year:</label><input type="number" id="year-filter" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="ml-2 rounded-md border-slate-300 shadow-sm text-sm py-1 w-24"/></div>)}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <SummaryCard title="Total Revenue" value={currencyFormat(reportData.totalRevenue)} icon={<CurrencyDollarIcon />} />
                <SummaryCard title="Accommodation Revenue" value={currencyFormat(reportData.totalAccommodationRevenue)} icon={<BuildingOfficeIcon />} />
                <SummaryCard title="Total Expenses" value={currencyFormat(reportData.totalExpenses)} icon={<ReceiptPercentIcon />} />
                <SummaryCard title="Net Profit" value={currencyFormat(reportData.netProfit)} icon={<TrendingUpIcon />} />
            </div>

            {/* Financial Breakdown */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto"><h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Financial Breakdown - {reportPeriodTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200">
                    <div className="bg-white p-4"><h4 className="font-semibold text-green-600 mb-2">Revenue Streams</h4>
                        <ul className="space-y-1 text-sm">
                            <li className="flex justify-between"><span>Accommodation Revenue (Paid):</span> <span className="font-medium">{currencyFormat(reportData.totalAccommodationRevenue)}</span></li>
                            <li className="flex justify-between"><span>Activity Booking Revenue:</span> <span className="font-medium">{currencyFormat(reportData.totalActivityBookingRevenue)}</span></li>
                             <li className="flex justify-between pl-4 text-slate-500">
                                <span>↳ from Extras:</span>
                                <span className="font-medium">{currencyFormat(reportData.totalExtrasRevenue)}</span>
                            </li>
                            <li className="flex justify-between"><span>External POS Sales:</span> <span className="font-medium">{currencyFormat(reportData.totalExternalSales)}</span></li>
                            <li className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total Revenue:</span> <span>{currencyFormat(reportData.totalRevenue)}</span></li>
                        </ul>
                    </div>
                    <div className="bg-white p-4"><h4 className="font-semibold text-red-600 mb-2">Expense Streams</h4>
                        <ul className="space-y-1 text-sm">
                            <li className="flex justify-between"><span>Staff Salaries ({reportGranularity === 'yearly' ? 'Annual' : 'Monthly'} Est.):</span> <span className="font-medium">{currencyFormat(reportData.totalMonthlySalaries)}</span></li>
                            <li className="flex justify-between"><span>Utility Bills:</span> <span className="font-medium">{currencyFormat(reportData.totalUtilitiesCost)}</span></li>
                            <li className="flex justify-between"><span>Activity Item Costs:</span> <span className="font-medium">{currencyFormat(reportData.totalItemCosts)}</span></li>
                            <li className="flex justify-between"><span>Salary Advances:</span> <span className="font-medium">{currencyFormat(reportData.totalSalaryAdvances)}</span></li>
                            <li className="flex justify-between"><span>Employee Commissions:</span> <span className="font-medium">{currencyFormat(reportData.totalEmployeeCommissions)}</span></li>
                            <li className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total Expenses:</span> <span>{currencyFormat(reportData.totalExpenses)}</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Other Tables... (Boat Company Payments, Platform Payments, External Sales, Staff Performance, All Bookings) */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto"><h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Boat Company Payments Due - {reportPeriodTitle}</h3>
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Company Name</th><th className="px-6 py-3">Amount to Pay</th></tr></thead>
                    <tbody>
                        {Object.entries(reportData.companyDebts).map(([c, a]) => <tr key={c} className="bg-white border-b"><td className="px-6 py-4 font-medium">{c}</td><td className="px-6 py-4 font-bold text-red-600">{currencyFormat(a)}</td></tr>)}
                        {Object.keys(reportData.companyDebts).length === 0 && (<tr><td colSpan={2} className="text-center p-4">No payments due.</td></tr>)}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <div className="flex justify-between items-center p-4 border-b"><h3 className="text-lg font-semibold">Platform Payments - {reportPeriodTitle}</h3><button onClick={() => handleOpenPlatformPaymentModal()} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"><PlusIcon className="w-4 h-4 mr-2" /> Add</button></div>
                <table className="w-full text-sm">
                     <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Platform</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Reference</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                     <tbody>
                        {filteredPlatformPayments.map(p => <tr key={p.id} className="border-b"><td className="px-6 py-4">{p.date}</td><td className="px-6 py-4 font-medium">{p.platform}</td><td className="px-6 py-4">{currencyFormat(p.amount)}</td><td className="px-6 py-4">{p.bookingReference||'N/A'}</td><td className="px-6 py-4 text-right"><div className="flex justify-end space-x-3"><button onClick={() => handleOpenPlatformPaymentModal(p)}><EditIcon /></button><button onClick={() => onDeletePlatformPayment(p.id)}><TrashIcon /></button></div></td></tr>)}
                        {filteredPlatformPayments.length === 0 && (<tr><td colSpan={5} className="text-center p-4">No platform payments.</td></tr>)}
                     </tbody>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <div className="flex justify-between items-center p-4 border-b"><h3 className="text-lg font-semibold">External POS Sales - {reportPeriodTitle}</h3><button onClick={() => handleOpenExternalSaleModal()} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"><PlusIcon className="w-4 h-4 mr-2" /> Add</button></div>
                <table className="w-full text-sm">
                     <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Description</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                     <tbody>
                        {filteredExternalSales.map(s => <tr key={s.id} className="border-b"><td className="px-6 py-4">{s.date}</td><td className="px-6 py-4">{currencyFormat(s.amount)}</td><td className="px-6 py-4">{s.description||'N/A'}</td><td className="px-6 py-4 text-right"><div className="flex justify-end space-x-3"><button onClick={() => handleOpenExternalSaleModal(s)}><EditIcon /></button><button onClick={() => onDeleteExternalSale(s.id)}><TrashIcon /></button></div></td></tr>)}
                        {filteredExternalSales.length === 0 && (<tr><td colSpan={4} className="text-center p-4">No external sales.</td></tr>)}
                     </tbody>
                </table>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto"><h3 className="text-lg font-semibold p-4 border-b">Staff Performance - {reportPeriodTitle}</h3>
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Staff Name</th><th className="px-6 py-3">Bookings</th><th className="px-6 py-3">Revenue Generated</th><th className="px-6 py-3">Commission Earned</th></tr></thead>
                    <tbody>{reportData.staffPerformance.map(p => <tr key={p.staffId} className="border-b"><td className="px-6 py-4 font-medium">{p.staffName}</td><td className="px-6 py-4">{p.bookingsCount}</td><td className="px-6 py-4">{currencyFormat(p.totalRevenue)}</td><td className="px-6 py-4 font-semibold text-green-600">{currencyFormat(p.totalCommission)}</td></tr>)}</tbody>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto"><h3 className="text-lg font-semibold p-4 border-b">All Bookings - {reportPeriodTitle}</h3>
                <table className="w-full text-sm">
                     <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Item</th><th className="px-6 py-3">Staff</th><th className="px-6 py-3">Price</th><th className="px-6 py-3">Hostel C.</th><th className="px-6 py-3">Employee C.</th><th className="px-6 py-3">Receipt</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                     <tbody>
                        {filteredBookings.map(b => <tr key={b.id} className="border-b"><td className="px-6 py-4 font-mono text-xs">{b.id.slice(-6)}</td><td className="px-6 py-4">{b.bookingDate}</td><td className="px-6 py-4 font-medium">{b.itemName}</td><td className="px-6 py-4">{staffMap.get(b.staffId)||'N/A'}</td><td className="px-6 py-4">{currencyFormat(b.customerPrice + (b.extrasTotal||0) - (b.discount||0))}</td><td className="px-6 py-4">{b.hostelCommission ? currencyFormat(b.hostelCommission) : 'N/A'}</td><td className="px-6 py-4">{b.employeeCommission ? currencyFormat(b.employeeCommission) : 'N/A'}</td><td className="px-6 py-4">{b.receiptImage ? <button onClick={() => setViewingReceipt(b.receiptImage)}><EyeIcon/></button>:'N/A'}</td><td className="px-6 py-4 text-right"><button onClick={() => handleOpenEditBookingModal(b)}><EditIcon/></button></td></tr>)}
                        {filteredBookings.length === 0 && (<tr><td colSpan={9} className="text-center p-4">No bookings.</td></tr>)}
                     </tbody>
                </table>
            </div>

            {/* Modals */}
            <Modal isOpen={isExternalSaleModalOpen} onClose={handleCloseModals} title={editingExternalSale ? 'Edit POS Sale' : 'Add POS Sale'}>
                <ExternalSaleForm onSave={handleSaveExternalSale} onClose={handleCloseModals} initialData={editingExternalSale} />
            </Modal>
            <Modal isOpen={isPlatformPaymentModalOpen} onClose={handleCloseModals} title={editingPlatformPayment ? 'Edit Platform Payment' : 'Add Platform Payment'}>
                <PlatformPaymentForm onSave={handleSavePlatformPayment} onClose={handleCloseModals} initialData={editingPlatformPayment} />
            </Modal>
            <Modal isOpen={!!viewingReceipt} onClose={() => setViewingReceipt(null)} title="View Receipt">
                {viewingReceipt && <img src={viewingReceipt} alt="Receipt" className="w-full h-auto rounded-md" />}
            </Modal>
            <Modal isOpen={isEditBookingModalOpen} onClose={handleCloseModals} title="Edit Booking Commissions">
                {editingBooking && <EditBookingForm booking={editingBooking} onSave={onUpdateBooking} onClose={handleCloseModals} />}
            </Modal>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </div>
    );
};

export default BookingsReport;