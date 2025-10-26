import React, { useState, useMemo, useEffect } from 'react';
import type { Extra, Staff, PaymentType } from '../../types';
import { Role } from '../../types';
import Modal from '../Modal';

const CommonFormFields: React.FC<{ staff: Staff[]; selectedStaffId: string; onStaffChange: (id: string) => void; includeCommission?: boolean; commission: string; onCommissionChange: (value: string) => void, currentUserRole: Role }> = ({ staff, selectedStaffId, onStaffChange, includeCommission = false, commission, onCommissionChange, currentUserRole }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Booking Staff</label>
            <select id="staffId" value={selectedStaffId} onChange={(e) => onStaffChange(e.target.value)} required className="mt-1 block w-full input-field">
                <option value="">Select Staff</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
        </div>
        {includeCommission && currentUserRole === Role.Admin && (
            <div>
                <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Total Commission (THB)</label>
                <input type="number" id="commission" value={commission} onChange={(e) => onCommissionChange(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
        )}
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

interface SellExtrasProps {
    extras: Extra[];
    staff: Staff[];
    paymentTypes: PaymentType[];
    onBookStandaloneExtra: (extra: Extra, staffId: string, totalCommission: number, paymentMethod: string, bookingDate: string, receiptImage?: string) => void;
}

const SellExtras: React.FC<SellExtrasProps> = ({ extras, staff, paymentTypes, onBookStandaloneExtra }) => {
    const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
    const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);

    const initialPaymentState = useMemo(() => ({
        method: paymentTypes[0]?.name || '',
        receiptImage: undefined as string | undefined,
    }), [paymentTypes]);

    // Form states
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [commission, setCommission] = useState<string>('');
    // Fix: Explicitly type the state to ensure `receiptImage` is optional.
    const [paymentDetails, setPaymentDetails] = useState<{ method: string; receiptImage?: string }>(initialPaymentState);
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        setPaymentDetails(initialPaymentState);
    }, [initialPaymentState]);

    const resetFormStates = () => {
        setSelectedStaffId('');
        setCommission('');
        setPaymentDetails(initialPaymentState);
        setBookingDate(new Date().toISOString().split('T')[0]);
    };

    const handleOpenExtraModal = (extra: Extra) => {
        resetFormStates();
        setSelectedExtra(extra);
        setIsExtraModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsExtraModalOpen(false);
        setSelectedExtra(null);
    };

    const handleBookExtra = () => {
        if (!selectedExtra || !selectedStaffId) return alert('Please select a staff member.');
        onBookStandaloneExtra(selectedExtra, selectedStaffId, Number(commission) || 0, paymentDetails.method, bookingDate, paymentDetails.receiptImage);
        handleCloseModals();
    };


    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Sell Standalone Extras</h3>
                <div className="space-y-2">
                    {extras.map(extra => (
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

            <Modal isOpen={isExtraModalOpen} onClose={handleCloseModals} title={`Sell: ${selectedExtra?.name}`}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Sale Date</label>
                        <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                    </div>
                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} includeCommission commission={commission} onCommissionChange={setCommission} currentUserRole={Role.Admin} />
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                    <div className="flex justify-end pt-4">
                        <button onClick={handleBookExtra} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Sale</button>
                    </div>
                </div>
            </Modal>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </>
    );
};

export default SellExtras;