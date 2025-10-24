import React, { useState, useEffect } from 'react';
import type { WalkInGuest, Room, PaymentMethod } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, CalendarDaysIcon, CurrencyDollarIcon, BedIcon } from '../constants';

// --- Form Component ---
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
  const [totalPaid, setTotalPaid] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  const selectedRoom = rooms.find(r => r.id === roomId);
  const isDorm = selectedRoom && selectedRoom.beds.length > 1;

  useEffect(() => {
    const nights = Number(numberOfNights) || 0;
    const price = Number(pricePerNight) || 0;
    setTotalPaid((nights * price).toString());
  }, [numberOfNights, pricePerNight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
        alert("Please select a room.");
        return;
    }
    onSubmit({
      guestName,
      nationality,
      idNumber,
      roomId,
      bedNumber,
      checkInDate,
      numberOfNights: Number(numberOfNights),
      pricePerNight: Number(pricePerNight),
      totalPaid: Number(totalPaid),
      paymentMethod,
      notes,
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
            <label htmlFor="totalPaid" className="block text-sm font-medium text-slate-700">Total Paid (THB)</label>
            <input type="number" id="totalPaid" value={totalPaid} onChange={e => setTotalPaid(e.target.value)} required className="mt-1 block w-full input-field" />
        </div>
      </div>
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">Payment Method</label>
        <select id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="mt-1 block w-full input-field">
            <option>Cash</option>
            <option>Credit Card</option>
            <option>Internet Payment</option>
        </select>
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


// --- Main Component ---
interface WalkInManagementProps {
  rooms: Room[];
  walkInGuests: WalkInGuest[];
  onAddWalkInGuest: (guest: Omit<WalkInGuest, 'id'>) => void;
}

const WalkInManagement: React.FC<WalkInManagementProps> = ({ rooms, walkInGuests, onAddWalkInGuest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const roomMap = new Map(rooms.map(r => [r.id, r.name]));

  const totalWalkInRevenue = walkInGuests.reduce((sum, guest) => sum + guest.totalPaid, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Walk-in Guests</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Walk-in
        </button>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm flex items-center space-x-4 mb-6">
        <div className="bg-green-100 text-green-600 rounded-full p-3">
            <CurrencyDollarIcon className="w-8 h-8"/>
        </div>
        <div>
            <h4 className="text-sm font-medium text-slate-500">Total Revenue from Walk-ins</h4>
            <p className="text-3xl font-semibold text-slate-800 mt-1">฿{totalWalkInRevenue.toLocaleString()}</p>
        </div>
    </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {walkInGuests.map(guest => (
          <div key={guest.id} className="bg-white rounded-lg shadow-md flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-slate-800">{guest.guestName}</h3>
              <p className="text-sm text-slate-500">{guest.nationality || 'N/A'}</p>
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
                 <div className="flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-600 mr-2">Paid:</span>
                    <span className="font-bold text-green-600">฿{guest.totalPaid.toLocaleString()}</span>
                    <span className="text-slate-500 ml-1">({guest.paymentMethod})</span>
                </div>
                {guest.notes && (
                    <div className="pt-2 border-t mt-2">
                        <p className="font-semibold text-slate-600 text-xs">Notes:</p>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{guest.notes}</p>
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
      {walkInGuests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-slate-800">No walk-in guests currently checked in.</h3>
              <p className="text-slate-500 mt-2">Click "Add Walk-in" to get started.</p>
          </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Walk-in Guest">
        <WalkInForm rooms={rooms} onSubmit={onAddWalkInGuest} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default WalkInManagement;