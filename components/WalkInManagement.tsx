import React, { useState, useMemo, useEffect } from 'react';
import type { WalkInGuest, Room, PaymentMethod, AccommodationBooking } from '../types';
import { PaymentStatus } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { PlusIcon, CalendarDaysIcon, CurrencyDollarIcon, BedIcon, GlobeAltIcon, UserPlusIcon } from '../constants';

type GuestData = (WalkInGuest | AccommodationBooking) & { type: 'walk-in' | 'booking' };

// --- Add Walk-In Form Component ---
interface WalkInFormProps {
  rooms: Room[];
  onSubmit: (guest: Omit<WalkInGuest, 'id'>) => void;
  onClose: () => void;
}

const WalkInForm: React.FC<WalkInFormProps> = ({ rooms, onSubmit, onClose }) => {
  const [guestName, setGuestName] = useState('');
  const [nationality, setNationality] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [roomId, setRoomId] = useState('');
  const [bedNumber, setBedNumber] = useState<number | undefined>(undefined);
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [numberOfNights, setNumberOfNights] = useState('1');
  const [pricePerNight, setPricePerNight] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  const selectedRoom = rooms.find(r => r.id === roomId);
  const isDorm = selectedRoom && selectedRoom.beds.length > 1;
  const totalCost = (Number(numberOfNights) || 0) * (Number(pricePerNight) || 0);
  const remainingBalance = totalCost - (Number(amountPaid) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
        alert("Please select a room.");
        return;
    }
    const paidAmount = Number(amountPaid) || 0;
    const finalStatus = paidAmount >= totalCost ? PaymentStatus.Paid : (paidAmount > 0 ? PaymentStatus['Deposit Paid'] : PaymentStatus.Unpaid);

    onSubmit({
      guestName,
      nationality,
      idNumber,
      roomId,
      bedNumber,
      checkInDate,
      numberOfNights: Number(numberOfNights),
      pricePerNight: Number(pricePerNight),
      amountPaid: paidAmount,
      paymentMethod,
      notes,
      status: finalStatus,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-slate-700">Guest Name</label>
          <input type="text" id="guestName" value={guestName} onChange={e => setGuestName(e.target.value)} required className="mt-1 block w-full input-field" />
        </div>
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-slate-700">Nationality</label>
          <input type="text" id="nationality" value={nationality} onChange={e => setNationality(e.target.value)} className="mt-1 block w-full input-field" />
        </div>
      </div>
      <div>
        <label htmlFor="idNumber" className="block text-sm font-medium text-slate-700">ID / Passport Number</label>
        <input type="text" id="idNumber" value={idNumber} onChange={e => setIdNumber(e.target.value)} className="mt-1 block w-full input-field" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-slate-700">Room</label>
          <select id="roomId" value={roomId} onChange={e => { setRoomId(e.target.value); setBedNumber(undefined); }} required className="mt-1 block w-full input-field">
            <option value="">Select a room...</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        {isDorm && (
          <div>
            <label htmlFor="bedNumber" className="block text-sm font-medium text-slate-700">Bed Number</label>
            <select id="bedNumber" value={bedNumber || ''} onChange={e => setBedNumber(Number(e.target.value))} required className="mt-1 block w-full input-field">
              <option value="">Select a bed...</option>
              {selectedRoom.beds.map(b => <option key={b.id} value={b.number}>{b.number}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <label htmlFor="checkInDate" className="block text-sm font-medium text-slate-700">Check-in Date</label>
            <input type="date" id="checkInDate" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} required className="mt-1 block w-full input-field" />
        </div>
        <div>
            <label htmlFor="numberOfNights" className="block text-sm font-medium text-slate-700">Number of Nights</label>
            <input type="number" id="numberOfNights" value={numberOfNights} onChange={e => setNumberOfNights(e.target.value)} min="1" required className="mt-1 block w-full input-field" />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <label htmlFor="pricePerNight" className="block text-sm font-medium text-slate-700">Price per Night (THB)</label>
            <input type="number" id="pricePerNight" value={pricePerNight} onChange={e => setPricePerNight(e.target.value)} required className="mt-1 block w-full input-field" />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Total Cost</label>
            <input type="text" value={`฿${totalCost.toLocaleString()}`} disabled className="mt-1 block w-full input-field bg-slate-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium text-slate-700">Amount Paid / Deposit (THB)</label>
            <input type="number" id="amountPaid" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} required className="mt-1 block w-full input-field" />
        </div>
        <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">Payment Method</label>
            <select id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="mt-1 block w-full input-field">
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Internet Payment</option>
            </select>
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes</label>
        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full input-field" />
      </div>

       <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Check In Guest</button>
      </div>
       <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
  );
};

// --- Add Booking Form Component ---
interface BookingFormProps {
  rooms: Room[];
  onSubmit: (booking: Omit<AccommodationBooking, 'id'>) => void;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ rooms, onSubmit, onClose }) => {
  const [guestName, setGuestName] = useState('');
  const [platform, setPlatform] = useState('Booking.com');
  const [otherPlatform, setOtherPlatform] = useState('');
  const [roomId, setRoomId] = useState('');
  const [bedNumber, setBedNumber] = useState<number | undefined>(undefined);
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [numberOfNights, setNumberOfNights] = useState('1');
  const [totalPrice, setTotalPrice] = useState('');

  const selectedRoom = rooms.find(r => r.id === roomId);
  const isDorm = selectedRoom && selectedRoom.beds.length > 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
        alert("Please select a room.");
        return;
    }
    const total = Number(totalPrice) || 0;
    const paidAmount = 0;
    const finalStatus = paidAmount >= total ? PaymentStatus.Paid : (paidAmount > 0 ? PaymentStatus['Deposit Paid'] : PaymentStatus.Unpaid);
    const finalPlatform = platform === 'Other' ? otherPlatform : platform;

    if (platform === 'Other' && !finalPlatform.trim()) {
        alert("Please specify the platform name.");
        return;
    }

    onSubmit({
      guestName,
      platform: finalPlatform,
      roomId,
      bedNumber,
      checkInDate,
      numberOfNights: Number(numberOfNights),
      totalPrice: total,
      amountPaid: paidAmount,
      status: finalStatus,
    });
    onClose();
  };
  
  const PLATFORMS = ['Booking.com', 'Hostelworld', 'Agoda', 'Other'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="guestName" className="block text-sm font-medium text-slate-700">Guest Name</label>
        <input type="text" id="guestName" value={guestName} onChange={e => setGuestName(e.target.value)} required className="mt-1 block w-full input-field" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-slate-700">Platform</label>
          <select id="platform" value={platform} onChange={e => setPlatform(e.target.value)} required className="mt-1 block w-full input-field">
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        {platform === 'Other' && (
          <div>
            <label htmlFor="otherPlatform" className="block text-sm font-medium text-slate-700">Platform Name</label>
            <input type="text" id="otherPlatform" value={otherPlatform} onChange={e => setOtherPlatform(e.target.value)} required className="mt-1 block w-full input-field" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-slate-700">Room</label>
          <select id="roomId" value={roomId} onChange={e => { setRoomId(e.target.value); setBedNumber(undefined); }} required className="mt-1 block w-full input-field">
            <option value="">Select a room...</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        {isDorm && (
          <div>
            <label htmlFor="bedNumber" className="block text-sm font-medium text-slate-700">Bed Number</label>
            <select id="bedNumber" value={bedNumber || ''} onChange={e => setBedNumber(Number(e.target.value))} required className="mt-1 block w-full input-field">
              <option value="">Select a bed...</option>
              {selectedRoom.beds.map(b => <option key={b.id} value={b.number}>{b.number}</option>)}
            </select>
          </div>
        )}
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <label htmlFor="checkInDate" className="block text-sm font-medium text-slate-700">Check-in Date</label>
            <input type="date" id="checkInDate" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} required className="mt-1 block w-full input-field" />
        </div>
        <div>
            <label htmlFor="numberOfNights" className="block text-sm font-medium text-slate-700">Number of Nights</label>
            <input type="number" id="numberOfNights" value={numberOfNights} onChange={e => setNumberOfNights(e.target.value)} min="1" required className="mt-1 block w-full input-field" />
        </div>
      </div>
      <div>
         <label htmlFor="totalPrice" className="block text-sm font-medium text-slate-700">Total Price (THB)</label>
         <input type="number" id="totalPrice" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} required className="mt-1 block w-full input-field" />
     </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Booking</button>
      </div>
       <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
  );
};


// --- Payment Modal Component ---
interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    guestData: GuestData | null;
    onSave: (updatedGuest: WalkInGuest | AccommodationBooking) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, guestData, onSave }) => {
    const [amountToPay, setAmountToPay] = useState('');

    const totalCost = guestData ? (guestData.type === 'walk-in' ? guestData.pricePerNight * guestData.numberOfNights : guestData.totalPrice) : 0;
    const remainingBalance = guestData ? totalCost - guestData.amountPaid : 0;

    useEffect(() => {
        if (isOpen && guestData) {
            setAmountToPay(String(remainingBalance));
        }
    }, [isOpen, guestData, remainingBalance]);

    const handleSave = () => {
        if (!guestData) return;

        const paymentAmount = Number(amountToPay) || 0;
        if (paymentAmount <= 0) {
            alert('Please enter a valid payment amount.');
            return;
        }
        if (paymentAmount > remainingBalance) {
            alert(`Payment amount (฿${paymentAmount.toLocaleString()}) cannot exceed the remaining balance (฿${remainingBalance.toLocaleString()}).`);
            return;
        }

        const newPaidAmount = guestData.amountPaid + paymentAmount;
        const newStatus = newPaidAmount >= totalCost ? PaymentStatus.Paid : PaymentStatus['Deposit Paid'];
        
        const updatedGuest = {
            ...guestData,
            amountPaid: newPaidAmount,
            status: newStatus,
        };
        delete (updatedGuest as any).type;
        onSave(updatedGuest as WalkInGuest | AccommodationBooking);
        handleClose();
    };

    const handleClose = () => {
        setAmountToPay('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Collect Payment for ${guestData?.guestName}`}>
            <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-600">Total Cost:</span><span className="font-medium">฿{totalCost.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-600">Already Paid:</span><span className="font-medium text-green-600">฿{guestData?.amountPaid.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span className="text-slate-800">Remaining Balance:</span><span className="text-red-600">฿{remainingBalance.toLocaleString()}</span></div>
                </div>
                <div>
                    <label htmlFor="amountToPay" className="block text-sm font-medium text-slate-700">Amount to Pay (THB)</label>
                    <input 
                        type="number" 
                        id="amountToPay" 
                        value={amountToPay} 
                        onChange={e => setAmountToPay(e.target.value)} 
                        placeholder={remainingBalance.toString()} 
                        className="mt-1 block w-full input-field"
                        max={remainingBalance}
                        min="0.01"
                        step="any"
                     />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                    <button 
                        onClick={handleSave} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-400"
                        disabled={!amountToPay || Number(amountToPay) <= 0 || Number(amountToPay) > remainingBalance}
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// --- Main Component ---
interface BookingManagementProps {
  rooms: Room[];
  walkInGuests: WalkInGuest[];
  accommodationBookings: AccommodationBooking[];
  onAddWalkInGuest: (guest: Omit<WalkInGuest, 'id'>) => void;
  onUpdateWalkInGuest: (guest: WalkInGuest) => void;
  onAddAccommodationBooking: (booking: Omit<AccommodationBooking, 'id'>) => void;
  onUpdateAccommodationBooking: (booking: AccommodationBooking) => void;
}

const WalkInManagement: React.FC<BookingManagementProps> = ({ rooms, walkInGuests, accommodationBookings, onAddWalkInGuest, onUpdateWalkInGuest, onAddAccommodationBooking, onUpdateAccommodationBooking }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'walkins'>('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddWalkInModalOpen, setIsAddWalkInModalOpen] = useState(false);
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);

  const roomMap = useMemo(() => new Map(rooms.map(r => [r.id, r.name])), [rooms]);

  const filteredBookings = useMemo(() => 
    accommodationBookings.filter(b => b.guestName.toLowerCase().includes(searchQuery.toLowerCase())),
    [accommodationBookings, searchQuery]
  );
  
  const filteredWalkIns = useMemo(() =>
    walkInGuests.filter(g => g.guestName.toLowerCase().includes(searchQuery.toLowerCase())),
    [walkInGuests, searchQuery]
  );

  const openPaymentModal = (guest: WalkInGuest | AccommodationBooking, type: 'walk-in' | 'booking') => {
      setSelectedGuest({ ...guest, type });
      setIsPaymentModalOpen(true);
  };
  
  const handleSavePayment = (updatedGuest: WalkInGuest | AccommodationBooking) => {
    if ('platform' in updatedGuest) {
        onUpdateAccommodationBooking(updatedGuest as AccommodationBooking);
    } else {
        onUpdateWalkInGuest(updatedGuest as WalkInGuest);
    }
  }

  const GuestCard: React.FC<{guest: WalkInGuest | AccommodationBooking, type: 'walk-in' | 'booking'}> = ({ guest, type }) => {
    const totalCost = type === 'walk-in' ? guest.pricePerNight * guest.numberOfNights : guest.totalPrice;
    const remainingBalance = totalCost - guest.amountPaid;

    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col transition-all duration-300 hover:shadow-lg">
            <div className={`p-4 border-b flex justify-between items-start ${type === 'booking' ? 'bg-blue-50' : 'bg-green-50'}`}>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{guest.guestName}</h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                        {type === 'booking' ? <><GlobeAltIcon className="w-4 h-4 mr-1.5"/> Platform: {guest.platform}</> : <><UserPlusIcon className="w-4 h-4 mr-1.5"/> Walk-in</>}
                    </div>
                </div>
                <Badge status={guest.status} />
            </div>
            <div className="p-4 space-y-3 flex-grow text-sm">
                <div className="flex items-center">
                    <BedIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-600 mr-2">Room:</span>
                    <span>{roomMap.get(guest.roomId) || 'N/A'} {guest.bedNumber ? `(Bed ${guest.bedNumber})` : ''}</span>
                </div>
                <div className="flex items-center">
                    <CalendarDaysIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-600 mr-2">Stay:</span>
                    <span>{guest.checkInDate} for {guest.numberOfNights} night(s)</span>
                </div>
                <div className="pt-2 border-t mt-2 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Total Cost:</span><span className="font-medium text-slate-800">฿{totalCost.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Amount Paid:</span><span className="font-medium text-green-600">฿{guest.amountPaid.toLocaleString()}</span></div>
                    <div className={`flex justify-between font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-slate-800'}`}><span>Balance:</span><span>฿{remainingBalance.toLocaleString()}</span></div>
                </div>
                 {'notes' in guest && guest.notes && (
                    <div className="pt-2 border-t mt-2">
                        <p className="font-semibold text-slate-600 text-xs">Notes:</p>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{guest.notes}</p>
                    </div>
                )}
            </div>
            {remainingBalance > 0 && (
                <div className="p-2 bg-slate-50 border-t">
                    <button onClick={() => openPaymentModal(guest, type)} className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Collect Payment</button>
                </div>
            )}
        </div>
    );
  };

  const renderAddButton = () => {
    if (activeTab === 'bookings') {
      return (
        <button onClick={() => setIsAddBookingModalOpen(true)} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Booking
        </button>
      );
    }
    if (activeTab === 'walkins') {
      return (
        <button onClick={() => setIsAddWalkInModalOpen(true)} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Walk-in
        </button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Booking & Payment</h1>
            {renderAddButton()}
        </div>

        <div className="sticky top-[113px] bg-slate-50 py-3 z-10">
            <div className="border-b border-slate-200 mb-4">
                <nav className="flex space-x-2 sm:space-x-4 -mb-px" aria-label="Tabs">
                    <button onClick={() => setActiveTab('bookings')} className={`${activeTab === 'bookings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Bookings</button>
                    <button onClick={() => setActiveTab('walkins')} className={`${activeTab === 'walkins' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Walk-ins</button>
                </nav>
            </div>
            <div>
                 <input type="text" placeholder="Search by guest name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>

        <div>
            {activeTab === 'bookings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookings.map(booking => <GuestCard key={booking.id} guest={booking} type="booking" />)}
                </div>
            )}
            {activeTab === 'walkins' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWalkIns.map(guest => <GuestCard key={guest.id} guest={guest} type="walk-in" />)}
                </div>
            )}
        </div>

        <Modal isOpen={isAddWalkInModalOpen} onClose={() => setIsAddWalkInModalOpen(false)} title="Add New Walk-in Guest">
            <WalkInForm rooms={rooms} onSubmit={onAddWalkInGuest} onClose={() => setIsAddWalkInModalOpen(false)} />
        </Modal>
        
        <Modal isOpen={isAddBookingModalOpen} onClose={() => setIsAddBookingModalOpen(false)} title="Add New Platform Booking">
            <BookingForm rooms={rooms} onSubmit={onAddAccommodationBooking} onClose={() => setIsAddBookingModalOpen(false)} />
        </Modal>

        <PaymentModal 
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            guestData={selectedGuest}
            onSave={handleSavePayment}
        />
    </div>
  );
};

export default WalkInManagement;