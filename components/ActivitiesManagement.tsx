import React, { useState, useMemo, useEffect } from 'react';
import type { Activity, SpeedBoatTrip, Staff, Booking, Extra, PaymentMethod, TaxiBoatOption, ExternalSale, PlatformPayment, UtilityRecord, SalaryAdvance, WalkInGuest, AccommodationBooking, Room } from '../types';
import { Role } from '../types';
import Modal from './Modal';
import { EyeIcon, EditIcon, PlusIcon, TrashIcon, CashRegisterIcon, GlobeAltIcon, ReceiptPercentIcon } from '../constants';


// --- SVG Icons for UI Enhancement ---
const TicketIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-1.5m2.25-9h.01M7.5 15h3m-3 0h-1.5m-1.5 0h5.25m0 0h1.5m-5.25 0h-3m-1.5-9H5.25m0 0h1.5M5.25 6H7.5M5.25 6H3M7.5 6H5.25m6.75 0h1.5m-1.5 0h-3m1.5 0h-1.5m-1.5 0H9M12 6h3.75m-3.75 0h-1.5m-1.5 0h-3.75" />
    </svg>
);
const CurrencyDollarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11c-.77 0-1.536.21-2.121.659L9 12.25m6-3.25l-2.121.659-2.121-.659m0 0l2.121-.659 2.121.659M9 12.25l2.121.659 2.121.659M15 12.25l-2.121.659-2.121-.659" />
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

// --- Item Creation Forms ---
interface ActivityFormProps {
    onSave: (activity: Omit<Activity, 'id'>) => void;
    onClose: () => void;
}
const ActivityForm: React.FC<ActivityFormProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, price: Number(formData.price) });
        onClose();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label><textarea id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label><input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL</label><input type="text" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full input-field" placeholder="https://placehold.co/..." /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Activity</button>
            </div>
        </form>
    );
};

interface ExtraFormProps {
    onSave: (extra: Omit<Extra, 'id'>) => void;
    onClose: () => void;
}
const ExtraForm: React.FC<ExtraFormProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', price: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, price: Number(formData.price) });
        onClose();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-slate-700">Extra Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label><input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Extra</button>
            </div>
        </form>
    );
};

interface TaxiBoatOptionFormProps {
    onSave: (option: Omit<TaxiBoatOption, 'id'>) => void;
    onClose: () => void;
}
const TaxiBoatOptionForm: React.FC<TaxiBoatOptionFormProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: 'One Way' as 'One Way' | 'Round Trip', price: '' });
    const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, name: e.target.value as 'One Way' | 'Round Trip' }));
    };
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, price: e.target.value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, price: Number(formData.price) });
        onClose();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-slate-700">Trip Type</label><select id="name" value={formData.name} onChange={handleNameChange} required className="mt-1 block w-full input-field"><option value="One Way">One Way</option><option value="Round Trip">Round Trip</option></select></div>
            <div><label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label><input type="number" id="price" value={formData.price} onChange={handlePriceChange} required className="mt-1 block w-full input-field" /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Option</button>
            </div>
        </form>
    );
};

// --- Price Management Components (Admin only) ---
interface EditablePriceItemProps<T extends { id: string; name: string; price: number }> {
  item: T;
  onSave: (item: T) => void;
  onDelete: (id: string) => void;
  currencySymbol?: string;
}

// Fix: Changed to a standard function declaration to correctly handle generic props with JSX, which resolves type-checking issues with the 'key' prop in lists.
// Fix: Added explicit return type to the generic component.
function EditablePriceItem<T extends { id: string; name: string; price: number }>({
  item,
  onSave,
  onDelete,
  currencySymbol = 'THB',
}: EditablePriceItemProps<T>): JSX.Element {
  const [price, setPrice] = useState(item.price.toString());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const newPrice = Number(price);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onSave({ ...item, price: newPrice });
      setIsEditing(false);
    } else {
      alert('Please enter a valid price.');
      setPrice(item.price.toString()); // Revert on invalid input
    }
  };
  
  const handleEdit = () => {
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
  }

  const handleDelete = () => {
      if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
          onDelete(item.id);
      }
  };

  return (
    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
      <span className="text-sm font-medium text-slate-800">{item.name}</span>
      <div className="flex items-center space-x-2">
        {isEditing ? (
             <input
                ref={inputRef}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setIsEditing(false); }}
                className="w-24 text-sm px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        ) : (
            <span className="text-sm font-semibold text-slate-600 w-24 text-right pr-2">{currencySymbol}{item.price.toLocaleString()}</span>
        )}
        {isEditing ? (
             <button onClick={handleSave} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Save</button>
        ) : (
            <>
                <button onClick={handleEdit} className="text-slate-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                <button onClick={handleDelete} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
            </>
        )}
      </div>
    </div>
  );
}

interface EditableSpeedBoatPriceItemProps {
  trip: SpeedBoatTrip;
  onSave: (trip: SpeedBoatTrip) => void;
  onDelete: (id: string) => void;
}

const EditableSpeedBoatPriceItem: React.FC<EditableSpeedBoatPriceItemProps> = ({ trip, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState(trip.price.toString());
    const [cost, setCost] = useState(trip.cost.toString());

    const handleSave = () => {
        const newPrice = Number(price);
        const newCost = Number(cost);
        if (!isNaN(newPrice) && newPrice >= 0 && !isNaN(newCost) && newCost >= 0) {
            onSave({ ...trip, price: newPrice, cost: newCost });
            setIsEditing(false);
        } else {
            alert('Please enter valid price and cost values.');
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete the trip "${trip.route}" by ${trip.company}?`)) {
            onDelete(trip.id);
        }
    };

    return (
        <div className="flex flex-wrap justify-between items-center p-3 bg-slate-50 rounded-lg border gap-2">
            <div className="flex-grow">
                <p className="text-sm font-medium text-slate-800">{trip.route}</p>
                <p className="text-xs text-slate-500">{trip.company}</p>
            </div>
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">Price:</span>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-28 text-sm pl-12 pr-2 py-1 border border-slate-300 rounded-md" />
                        </div>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">Cost:</span>
                            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-28 text-sm pl-12 pr-2 py-1 border border-slate-300 rounded-md" />
                        </div>
                    </>
                ) : (
                    <>
                        <span className="text-sm text-slate-600 w-28 text-right">Price: THB {trip.price.toLocaleString()}</span>
                        <span className="text-sm text-slate-600 w-28 text-right">Cost: THB {trip.cost.toLocaleString()}</span>
                    </>
                )}

                {isEditing ? (
                    <button onClick={handleSave} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Save</button>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                        <button onClick={handleDelete} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                    </>
                )}
            </div>
        </div>
    );
};

interface PriceManagementProps {
    activities: Activity[];
    speedBoatTrips: SpeedBoatTrip[];
    taxiBoatOptions: TaxiBoatOption[];
    extras: Extra[];
    onAddActivity: (activity: Omit<Activity, 'id'>) => void;
    onUpdateActivity: (activity: Activity) => void;
    onDeleteActivity: (id: string) => void;
    onAddSpeedBoatTrip: (trip: Omit<SpeedBoatTrip, 'id'>) => void;
    onUpdateSpeedBoatTrip: (trip: SpeedBoatTrip) => void;
    onDeleteSpeedBoatTrip: (id: string) => void;
    onAddTaxiBoatOption: (option: Omit<TaxiBoatOption, 'id'>) => void;
    onUpdateTaxiBoatOption: (option: TaxiBoatOption) => void;
    onDeleteTaxiBoatOption: (id: string) => void;
    onAddExtra: (extra: Omit<Extra, 'id'>) => void;
    onUpdateExtra: (extra: Extra) => void;
    onDeleteExtra: (id: string) => void;
}

const PriceManagement: React.FC<PriceManagementProps> = ({ activities, speedBoatTrips, taxiBoatOptions, extras, onAddActivity, onUpdateActivity, onDeleteActivity, onAddSpeedBoatTrip, onUpdateSpeedBoatTrip, onDeleteSpeedBoatTrip, onAddTaxiBoatOption, onUpdateTaxiBoatOption, onDeleteTaxiBoatOption, onAddExtra, onUpdateExtra, onDeleteExtra }) => {
    const [modal, setModal] = useState<'activity' | 'speedboat' | 'taxi' | 'extra' | null>(null);

    const handleSaveActivity = (activity: Omit<Activity, 'id'>) => {
        onAddActivity(activity);
        setModal(null);
    }
    const handleSaveExtra = (extra: Omit<Extra, 'id'>) => {
        onAddExtra(extra);
        setModal(null);
    }
    const handleSaveTaxi = (option: Omit<TaxiBoatOption, 'id'>) => {
        onAddTaxiBoatOption(option);
        setModal(null);
    }
    const handleSaveSpeedboat = (trip: Omit<SpeedBoatTrip, 'id'>) => {
        onAddSpeedBoatTrip(trip);
        setModal(null);
    }

    return (
        <div className="space-y-8">
            <Modal isOpen={modal === 'activity'} onClose={() => setModal(null)} title="Add New Activity">
                <ActivityForm onSave={handleSaveActivity} onClose={() => setModal(null)} />
            </Modal>
            <Modal isOpen={modal === 'speedboat'} onClose={() => setModal(null)} title="Add New Speed Boat Trip">
                <SpeedBoatTripForm onSave={handleSaveSpeedboat} onClose={() => setModal(null)} />
            </Modal>
            <Modal isOpen={modal === 'taxi'} onClose={() => setModal(null)} title="Add New Taxi Boat Option">
                <TaxiBoatOptionForm onSave={handleSaveTaxi} onClose={() => setModal(null)} />
            </Modal>
            <Modal isOpen={modal === 'extra'} onClose={() => setModal(null)} title="Add New Extra">
                <ExtraForm onSave={handleSaveExtra} onClose={() => setModal(null)} />
            </Modal>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-800">Activity Prices</h2>
                    <button onClick={() => setModal('activity')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                        <PlusIcon className="w-4 h-4 mr-1"/> Add Activity
                    </button>
                </div>
                <div className="space-y-3">
                    {activities.map(activity => (
                        <EditablePriceItem key={activity.id} item={activity} onSave={onUpdateActivity} onDelete={onDeleteActivity} />
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-800">Speed Boat Prices</h2>
                    <button onClick={() => setModal('speedboat')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                        <PlusIcon className="w-4 h-4 mr-1"/> Add Speed Boat
                    </button>
                </div>
                <div className="space-y-3">
                    {speedBoatTrips.map(trip => (
                        <EditableSpeedBoatPriceItem key={trip.id} trip={trip} onSave={onUpdateSpeedBoatTrip} onDelete={onDeleteSpeedBoatTrip} />
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-800">Taxi Boat Prices</h2>
                    <button onClick={() => setModal('taxi')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                        <PlusIcon className="w-4 h-4 mr-1"/> Add Taxi Option
                    </button>
                </div>
                <div className="space-y-3">
                    {taxiBoatOptions.map(option => (
                        <EditablePriceItem key={option.id} item={option} onSave={onUpdateTaxiBoatOption} onDelete={onDeleteTaxiBoatOption} />
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-slate-800">Extras Prices</h2>
                    <button onClick={() => setModal('extra')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                        <PlusIcon className="w-4 h-4 mr-1"/> Add Extra
                    </button>
                </div>
                <div className="space-y-3">
                    {extras.map(extra => (
                        <EditablePriceItem key={extra.id} item={extra} onSave={onUpdateExtra} onDelete={onDeleteExtra} />
                    ))}
                </div>
            </div>
        </div>
    )
}


interface ActivitiesManagementProps {
  activities: Activity[];
  speedBoatTrips: SpeedBoatTrip[];
  taxiBoatOptions: TaxiBoatOption[];
  extras: Extra[];
  staff: Staff[];
  bookings: Booking[];
  externalSales: ExternalSale[];
  platformPayments: PlatformPayment[];
  utilityRecords: UtilityRecord[];
  salaryAdvances: SalaryAdvance[];
  walkInGuests: WalkInGuest[];
  accommodationBookings: AccommodationBooking[];
  rooms: Room[];
  onBookActivity: (activityId: string, staffId: string, numberOfPeople: number, discount: number, extras: Omit<Extra, 'id'>[], paymentMethod: PaymentMethod, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number, hostelCommission?: number) => void;
  onBookSpeedBoat: (tripId: string, staffId: string, numberOfPeople: number, paymentMethod: PaymentMethod, bookingDate: string, receiptImage?: string) => void;
  onBookExternalActivity: (activityId: string, staffId: string, numberOfPeople: number, totalCommission: number, discount: number, extras: Omit<Extra, 'id'>[], paymentMethod: PaymentMethod, bookingDate: string, receiptImage?: string) => void;
  onBookPrivateTour: (tourType: 'Half Day' | 'Full Day', price: number, numberOfPeople: number, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number) => void;
  onBookStandaloneExtra: (extra: Extra, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, bookingDate: string, receiptImage?: string) => void;
  onBookTaxiBoat: (taxiOptionId: string, staffId: string, numberOfPeople: number, totalCommission: number, paymentMethod: PaymentMethod, bookingDate: string, receiptImage?: string) => void;
  onUpdateBooking: (updatedBooking: Booking) => void;
  onAddExternalSale: (newSale: Omit<ExternalSale, 'id'>) => void;
  onUpdateExternalSale: (updatedSale: ExternalSale) => void;
  onDeleteExternalSale: (saleId: string) => void;
  onAddPlatformPayment: (newPayment: Omit<PlatformPayment, 'id'>) => void;
  onUpdatePlatformPayment: (updatedPayment: PlatformPayment) => void;
  onDeletePlatformPayment: (paymentId: string) => void;
  onAddSpeedBoatTrip: (newTrip: Omit<SpeedBoatTrip, 'id'>) => void;
  onUpdateSpeedBoatTrip: (updatedTrip: SpeedBoatTrip) => void;
  onDeleteSpeedBoatTrip: (tripId: string) => void;
  onAddActivity: (newActivity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (updatedActivity: Activity) => void;
  onDeleteActivity: (activityId: string) => void;
  onAddTaxiBoatOption: (newOption: Omit<TaxiBoatOption, 'id'>) => void;
  onUpdateTaxiBoatOption: (updatedOption: TaxiBoatOption) => void;
  onDeleteTaxiBoatOption: (optionId: string) => void;
  onAddExtra: (newExtra: Omit<Extra, 'id'>) => void;
  onUpdateExtra: (updatedExtra: Extra) => void;
  onDeleteExtra: (extraId: string) => void;
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

// Form for editing booking commissions
interface EditBookingFormProps {
    booking: Booking;
    onSave: (updatedBooking: Booking) => void;
    onClose: () => void;
}

const EditBookingForm: React.FC<EditBookingFormProps> = ({ booking, onSave, onClose }) => {
    const [employeeCommission, setEmployeeCommission] = useState(booking.employeeCommission.toString());
    const [hostelCommission, setHostelCommission] = useState(booking.hostelCommission.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...booking,
            employeeCommission: Number(employeeCommission) || 0,
            hostelCommission: Number(hostelCommission) || 0,
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission (THB)</label>
                <input 
                    type="number" 
                    id="employeeCommission" 
                    value={employeeCommission} 
                    onChange={(e) => setEmployeeCommission(e.target.value)} 
                    className="mt-1 block w-full input-field" 
                />
            </div>
            <div>
                <label htmlFor="hostelCommission" className="block text-sm font-medium text-slate-700">Hostel Commission (THB)</label>
                <input 
                    type="number" 
                    id="hostelCommission" 
                    value={hostelCommission} 
                    onChange={(e) => setHostelCommission(e.target.value)} 
                    className="mt-1 block w-full input-field" 
                />
            </div>
             <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
            </div>
        </form>
    );
};

// Form for adding/editing external POS sales
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
        const saleData = {
            date,
            amount: Number(amount) || 0,
            description
        };
        if (initialData) {
            onSave({ ...initialData, ...saleData });
        } else {
            onSave(saleData);
        }
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

// Form for adding/editing platform payments
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
        if (!finalPlatform) {
            alert('Please select or specify a platform.');
            return;
        }

        const paymentData = {
            date,
            platform: finalPlatform,
            amount: Number(amount) || 0,
            bookingReference
        };
        if (initialData) {
            onSave({ ...initialData, ...paymentData });
        } else {
            onSave(paymentData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" id="paymentDate" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="platform" className="block text-sm font-medium text-slate-700">Platform</label>
                <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} required className="mt-1 block w-full input-field">
                    <option value="">Select a platform...</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="Other">Other</option>
                </select>
            </div>
            {platform === 'Other' && (
                <div>
                    <label htmlFor="otherPlatform" className="block text-sm font-medium text-slate-700">Specify Platform Name</label>
                    <input type="text" id="otherPlatform" value={otherPlatform} onChange={(e) => setOtherPlatform(e.target.value)} required className="mt-1 block w-full input-field" />
                </div>
            )}
            <div>
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-slate-700">Total Amount (THB)</label>
                <input type="number" id="paymentAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="bookingReference" className="block text-sm font-medium text-slate-700">Booking Reference (Optional)</label>
                <input type="text" id="bookingReference" value={bookingReference} onChange={(e) => setBookingReference(e.target.value)} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Payment'}</button>
            </div>
        </form>
    );
};

// Form for adding/editing SpeedBoatTrip
interface SpeedBoatTripFormProps {
    onSave: (trip: Omit<SpeedBoatTrip, 'id'> | SpeedBoatTrip) => void;
    onClose: () => void;
    initialData?: SpeedBoatTrip | null;
}

const SpeedBoatTripForm: React.FC<SpeedBoatTripFormProps> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        route: initialData?.route || '',
        company: initialData?.company || '',
        price: initialData?.price.toString() || '',
        cost: initialData?.cost.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tripData = {
            ...formData,
            price: Number(formData.price) || 0,
            cost: Number(formData.cost) || 0,
        };
        if (initialData) {
            onSave({ ...initialData, ...tripData });
        } else {
            onSave(tripData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="route" className="block text-sm font-medium text-slate-700">Route</label>
                    <input type="text" id="route" value={formData.route} onChange={handleChange} required className="mt-1 block w-full input-field" placeholder="e.g., Lipe - Pakbara"/>
                </div>
                 <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company</label>
                    <input type="text" id="company" value={formData.company} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
                 <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label>
                    <input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
                <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-slate-700">Cost (THB)</label>
                    <input type="number" id="cost" value={formData.cost} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Trip'}</button>
            </div>
        </form>
    )
}


type SubView = 'tours' | 'boats' | 'extras' | 'report' | 'pricing';
type PrivateTourType = 'Half Day' | 'Full Day';

const initialExtrasState = {
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
  const { activities, speedBoatTrips, taxiBoatOptions, extras, staff, bookings, externalSales, platformPayments, utilityRecords, salaryAdvances, walkInGuests, accommodationBookings, rooms, onBookActivity, onBookSpeedBoat, onBookExternalActivity, onBookPrivateTour, onBookStandaloneExtra, onBookTaxiBoat, onUpdateBooking, onAddExternalSale, onUpdateExternalSale, onDeleteExternalSale, onAddPlatformPayment, onUpdatePlatformPayment, onDeletePlatformPayment, onAddSpeedBoatTrip, onUpdateSpeedBoatTrip, onDeleteSpeedBoatTrip, onAddActivity, onUpdateActivity, onDeleteActivity, onAddTaxiBoatOption, onUpdateTaxiBoatOption, onDeleteTaxiBoatOption, onAddExtra, onUpdateExtra, onDeleteExtra, currentUserRole } = props;
  const [activeTab, setActiveTab] = useState<SubView>('tours');
  
  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  const [isSpeedBoatModalOpen, setIsSpeedBoatModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<SpeedBoatTrip | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [availableTripsForRoute, setAvailableTripsForRoute] = useState<SpeedBoatTrip[]>([]);
  
  const [isExternalBookingModalOpen, setIsExternalBookingModalOpen] = useState(false);
  const [selectedExternalActivity, setSelectedExternalActivity] = useState<Activity | null>(null);

  const [isPrivateTourModalOpen, setIsPrivateTourModalOpen] = useState(false);

  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);

  const [isTaxiModalOpen, setIsTaxiModalOpen] = useState(false);
  const [selectedTaxiOption, setSelectedTaxiOption] = useState<TaxiBoatOption | null>(null);
  
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  
  const [isExternalSaleModalOpen, setIsExternalSaleModalOpen] = useState(false);
  const [editingExternalSale, setEditingExternalSale] = useState<ExternalSale | null>(null);

  const [isPlatformPaymentModalOpen, setIsPlatformPaymentModalOpen] = useState(false);
  const [editingPlatformPayment, setEditingPlatformPayment] = useState<PlatformPayment | null>(null);

  const [isManageTripsModalOpen, setIsManageTripsModalOpen] = useState(false);
  const [editingSpeedBoatTrip, setEditingSpeedBoatTrip] = useState<SpeedBoatTrip | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);


  // Common form states
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [commission, setCommission] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  // Fix: Removed explicit 'any' type to allow for better type inference.
  const [selectedExtras, setSelectedExtras] = useState(initialExtrasState);
  const [paymentDetails, setPaymentDetails] = useState(initialPaymentState);
  const [privateTourDetails, setPrivateTourDetails] = useState(initialPrivateTourState);
  const [fuelCost, setFuelCost] = useState('');
  const [captainCost, setCaptainCost] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [employeeCommission, setEmployeeCommission] = useState('');
  const [hostelCommission, setHostelCommission] = useState('');

  // Report states
  const [reportGranularity, setReportGranularity] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedDay, setSelectedDay] = useState<string>(''); // YYYY-MM-DD

  const TOUR_EXTRAS = useMemo(() => {
    const simple = extras.filter(e => !e.id.startsWith('paddle'));
    const paddle_hour = extras.find(e => e.id === 'paddle_hour');
    const paddle_day = extras.find(e => e.id === 'paddle_day');

    return {
        simple: simple,
        special: {
            paddleboard: {
                hour: paddle_hour || { id: 'paddle_hour', name: 'Paddle board (per hour)', price: 0 },
                day: paddle_day || { id: 'paddle_day', name: 'Paddle board (per day)', price: 0 },
            },
        },
    };
  }, [extras]);

  // Dynamically create the initial state for extras checkboxes
  const dynamicInitialExtrasState = useMemo(() => ({
    ...extras.reduce((acc, extra) => ({ ...acc, [extra.id]: false }), {}),
    ...initialExtrasState,
  }), [extras]);

  useEffect(() => {
    setSelectedExtras(dynamicInitialExtrasState);
  }, [dynamicInitialExtrasState]);


  const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s.name])), [staff]);
  const roomMap = useMemo(() => new Map(rooms.map(r => [r.id, r.name])), [rooms]);

  const TABS: { id: SubView; label: string; icon: React.ReactNode; }[] = [
    { id: 'tours', label: 'Tours & Activities', icon: <RocketLaunchIcon className="w-5 h-5" /> },
    { id: 'boats', label: 'Boat Tickets', icon: <ShipIcon className="w-5 h-5" /> },
    { id: 'extras', label: 'Sell Extras', icon: <TagIcon className="w-5 h-5" /> },
    { id: 'report', label: 'Bookings Report', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'pricing', label: 'Manage Prices', icon: <CurrencyDollarIcon className="w-5 h-5" /> },
  ];

  const visibleTabs = useMemo(() => {
    if (currentUserRole === Role.Admin) {
      return TABS;
    }
    return TABS.filter(tab => tab.id !== 'report' && tab.id !== 'pricing');
  }, [currentUserRole]);

  useEffect(() => {
    const isCurrentTabVisible = visibleTabs.some(tab => tab.id === activeTab);
    if (!isCurrentTabVisible) {
        setActiveTab(visibleTabs[0]?.id || 'tours');
    }
  }, [currentUserRole, activeTab, visibleTabs]);

  // Clear day selection when month or granularity changes
  useEffect(() => {
    setSelectedDay('');
  }, [selectedMonth, reportGranularity]);


  // Fix: Updated the `calculateExtras` function to accept a more specific type.
  const calculateExtras = (currentExtras: Record<string, any>): { list: Omit<Extra, 'id'>[], total: number } => {
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
    setSelectedExtras(dynamicInitialExtrasState);
    setPaymentDetails(initialPaymentState);
    setPrivateTourDetails(initialPrivateTourState);
    setFuelCost('');
    setCaptainCost('');
    setNumberOfPeople('1');
    setBookingDate(new Date().toISOString().split('T')[0]);
    setEmployeeCommission('');
    setHostelCommission('');
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
  
  // Fix: Correctly typed the initial value for the reduce function to resolve type inference issues.
  const groupedSpeedBoatTrips = useMemo(() => {
    return speedBoatTrips.reduce((acc, trip) => {
        const { route } = trip;
        if (!acc[route]) {
            acc[route] = [];
        }
        acc[route].push(trip);
        return acc;
    // Fix: Explicitly type the accumulator in the reduce callback to ensure correct type inference.
    }, {} as Record<string, SpeedBoatTrip[]>);
  }, [speedBoatTrips]);

  const handleOpenSpeedBoatModalForRoute = (route: string, trips: SpeedBoatTrip[]) => {
    resetCommonStates();
    setSelectedRoute(route);
    setAvailableTripsForRoute(trips);
    setSelectedTrip(trips[0] || null);
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
    setSelectedRoute(null);
    setAvailableTripsForRoute([]);
    setSelectedExtra(null);
    setSelectedTaxiOption(null);
    setIsEditBookingModalOpen(false);
    setEditingBooking(null);
    setIsExternalSaleModalOpen(false);
    setEditingExternalSale(null);
    setIsPlatformPaymentModalOpen(false);
    setEditingPlatformPayment(null);
    setIsManageTripsModalOpen(false);
    setEditingSpeedBoatTrip(null);
    setShowTripForm(false);
  };

  const handleOpenEditBookingModal = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditBookingModalOpen(true);
  };

  const handleSaveBookingUpdate = (updatedBooking: Booking) => {
      onUpdateBooking(updatedBooking);
      handleCloseModals();
  };
  
  const handleOpenExternalSaleModal = (sale?: ExternalSale) => {
    setEditingExternalSale(sale || null);
    setIsExternalSaleModalOpen(true);
  };
  
  const handleSaveExternalSale = (saleData: Omit<ExternalSale, 'id'> | ExternalSale) => {
      if ('id' in saleData) {
          onUpdateExternalSale(saleData);
      } else {
          onAddExternalSale(saleData);
      }
      handleCloseModals();
  };
  
  const handleOpenPlatformPaymentModal = (payment?: PlatformPayment) => {
    setEditingPlatformPayment(payment || null);
    setIsPlatformPaymentModalOpen(true);
  };

  const handleSavePlatformPayment = (paymentData: Omit<PlatformPayment, 'id'> | PlatformPayment) => {
      if ('id' in paymentData) {
          onUpdatePlatformPayment(paymentData);
      } else {
          onAddPlatformPayment(paymentData);
      }
      handleCloseModals();
  };

    const handleOpenManageTripsModal = () => {
        setIsManageTripsModalOpen(true);
    };

    const handleEditTrip = (trip: SpeedBoatTrip) => {
        setEditingSpeedBoatTrip(trip);
        setShowTripForm(true);
    };

    const handleAddNewTrip = () => {
        setEditingSpeedBoatTrip(null);
        setShowTripForm(true);
    };

    const handleSaveSpeedBoatTrip = (tripData: Omit<SpeedBoatTrip, 'id'> | SpeedBoatTrip) => {
        if ('id' in tripData) {
            onUpdateSpeedBoatTrip(tripData);
        } else {
            onAddSpeedBoatTrip(tripData);
        }
        setEditingSpeedBoatTrip(null);
        setShowTripForm(false);
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
    onBookActivity(selectedActivity.id, selectedStaffId, Number(numberOfPeople), Number(discount) || 0, extrasList, paymentDetails.method, bookingDate, paymentDetails.receiptImage, Number(fuelCost) || undefined, Number(captainCost) || undefined, Number(employeeCommission) || undefined, Number(hostelCommission) || undefined);
    handleCloseModals();
  };

  const handleBookExternal = () => {
    if (!selectedExternalActivity || !selectedStaffId) return alert('Please select a staff member.');
    const { list: extrasList } = calculateExtras(selectedExtras);
    onBookExternalActivity(selectedExternalActivity.id, selectedStaffId, Number(numberOfPeople), Number(commission) || 0, Number(discount) || 0, extrasList, paymentDetails.method, bookingDate, paymentDetails.receiptImage);
    handleCloseModals();
  };
  
  const handleBookSpeedBoat = () => {
    if (!selectedTrip || !selectedStaffId) return alert('Please select a staff member.');
    onBookSpeedBoat(selectedTrip.id, selectedStaffId, Number(numberOfPeople), paymentDetails.method, bookingDate, paymentDetails.receiptImage);
    handleCloseModals();
  };

  const handleBookPrivate = () => {
    if (!selectedStaffId) return alert('Please select a staff member.');
    onBookPrivateTour(privateTourDetails.type, Number(privateTourDetails.price), Number(numberOfPeople), selectedStaffId, Number(commission) || 0, paymentDetails.method, bookingDate, paymentDetails.receiptImage, Number(fuelCost) || undefined, Number(captainCost) || undefined);
    handleCloseModals();
  };
  
  const handleBookExtra = () => {
    if (!selectedExtra || !selectedStaffId) return alert('Please select a staff member.');
    onBookStandaloneExtra(selectedExtra, selectedStaffId, Number(commission) || 0, paymentDetails.method, bookingDate, paymentDetails.receiptImage);
    handleCloseModals();
  };

  const handleBookTaxi = () => {
    if (!selectedTaxiOption || !selectedStaffId) return alert('Please select a staff member.');
    onBookTaxiBoat(selectedTaxiOption.id, selectedStaffId, Number(numberOfPeople), Number(commission) || 0, paymentDetails.method, bookingDate, paymentDetails.receiptImage);
    handleCloseModals();
  };

  // Report data logic
    const currentFilter = useMemo(() => {
        if (reportGranularity === 'yearly') {
            if (selectedYear && /^\d{4}$/.test(selectedYear)) {
                return selectedYear;
            }
            return new Date().getFullYear().toString();
        }
        return selectedMonth;
    }, [reportGranularity, selectedMonth, selectedYear]);

    const reportPeriodTitle = useMemo(() => {
        if (reportGranularity === 'yearly') {
            return currentFilter;
        }
        try {
            return new Date(selectedMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' });
        } catch {
            return 'Invalid Date';
        }
    }, [reportGranularity, selectedMonth, currentFilter]);
    
    const filteredBookings = useMemo(() => {
        if (!currentFilter) return [];
        return bookings.filter(b => b.bookingDate.startsWith(currentFilter));
    }, [bookings, currentFilter]);
    
    const filteredExternalSales = useMemo(() => {
        if (!currentFilter) return [];
        return externalSales.filter(s => s.date.startsWith(currentFilter));
    }, [externalSales, currentFilter]);
    
    const filteredPlatformPayments = useMemo(() => {
        if (!currentFilter) return [];
        return platformPayments.filter(p => p.date.startsWith(currentFilter));
    }, [platformPayments, currentFilter]);
    
    const filteredUtilityRecords = useMemo(() => {
        if (!currentFilter) return [];
        return utilityRecords.filter(r => r.date.startsWith(currentFilter));
    }, [utilityRecords, currentFilter]);

    const filteredSalaryAdvances = useMemo(() => {
        if (!currentFilter) return [];
        return salaryAdvances.filter(a => a.date.startsWith(currentFilter));
    }, [salaryAdvances, currentFilter]);
    
    const filteredWalkInGuests = useMemo(() => {
        if (!currentFilter) return [];
        return walkInGuests.filter(g => g.checkInDate.startsWith(currentFilter));
    }, [walkInGuests, currentFilter]);

    const filteredAccommodationBookings = useMemo(() => {
        if (!currentFilter) return [];
        return accommodationBookings.filter(b => b.checkInDate.startsWith(currentFilter));
    }, [accommodationBookings, currentFilter]);

    const reportData = useMemo(() => {
        // REVENUE
        const totalBookingRevenue = filteredBookings.reduce((sum, b) => sum + b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0), 0);
        const totalHostelBookingCommission = filteredBookings.reduce((sum, b) => sum + b.hostelCommission, 0);
        const totalExternalSales = filteredExternalSales.reduce((sum, s) => sum + s.amount, 0);
        const totalPlatformRevenue = filteredPlatformPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalWalkInRevenue = filteredWalkInGuests.reduce((sum, g) => sum + (g.pricePerNight * g.numberOfNights), 0);
        const totalPlatformBookingRevenue = filteredAccommodationBookings.reduce((sum, b) => sum + b.totalPrice, 0);
        const totalAccommodationRevenue = totalWalkInRevenue + totalPlatformBookingRevenue;
        const totalRevenue = totalHostelBookingCommission + totalExternalSales + totalPlatformRevenue + totalAccommodationRevenue;
        
        // EXPENSES
        const totalUtilitiesCost = filteredUtilityRecords.reduce((sum, r) => sum + r.cost, 0);
        const totalOperationalCosts = filteredBookings.reduce((sum, b) => sum + (b.fuelCost || 0) + (b.captainCost || 0), 0);
        const totalEmployeeCommission = filteredBookings.reduce((sum, b) => sum + b.employeeCommission, 0);
        const totalSalaries = staff.reduce((sum, s) => sum + s.salary, 0);
        const totalCalculatedSalaries = reportGranularity === 'yearly' ? totalSalaries : totalSalaries / 12;
        const totalSalaryAdvances = filteredSalaryAdvances.reduce((sum, a) => sum + a.amount, 0);
        const totalExpenses = totalUtilitiesCost + totalOperationalCosts + totalEmployeeCommission + totalCalculatedSalaries + totalSalaryAdvances;

        // PROFIT
        const netProfit = totalRevenue - totalExpenses;

        const staffPerformance = staff.map(s => {
            const staffBookings = filteredBookings.filter(b => b.staffId === s.id);
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

        const companyDebts = filteredBookings
            .filter(b => b.itemType === 'speedboat')
            .reduce<Record<string, number>>((acc, booking) => {
                const trip = speedBoatTrips.find(t => t.id === booking.itemId);
                if (trip) {
                    const company = trip.company;
                    if (!acc[company]) {
                        acc[company] = 0;
                    }
                    acc[company] += booking.itemCost || 0;
                }
                return acc;
            }, {});
    
        return {
            totalRevenue,
            totalBookingRevenue,
            totalHostelBookingCommission,
            totalExternalSales,
            totalPlatformRevenue,
            totalAccommodationRevenue,
            totalExpenses,
            totalUtilitiesCost,
            totalOperationalCosts,
            totalEmployeeCommission,
            totalMonthlySalaries: totalCalculatedSalaries,
            totalSalaryAdvances,
            netProfit,
            staffPerformance,
            companyDebts,
        };
    }, [filteredBookings, filteredExternalSales, filteredPlatformPayments, filteredUtilityRecords, filteredSalaryAdvances, filteredWalkInGuests, filteredAccommodationBookings, staff, speedBoatTrips, reportGranularity]);

    // Daily Report Logic
     const dailyFilteredBookings = useMemo(() => {
        if (!selectedDay) return [];
        return bookings.filter(b => b.bookingDate === selectedDay);
    }, [bookings, selectedDay]);
    const dailyFilteredExternalSales = useMemo(() => {
        if (!selectedDay) return [];
        return externalSales.filter(s => s.date === selectedDay);
    }, [externalSales, selectedDay]);
    const dailyFilteredPlatformPayments = useMemo(() => {
        if (!selectedDay) return [];
        return platformPayments.filter(p => p.date === selectedDay);
    }, [platformPayments, selectedDay]);
    const dailyFilteredWalkInGuests = useMemo(() => {
        if (!selectedDay) return [];
        return walkInGuests.filter(g => g.checkInDate === selectedDay);
    }, [walkInGuests, selectedDay]);
    const dailyFilteredAccommodationBookings = useMemo(() => {
        if (!selectedDay) return [];
        return accommodationBookings.filter(b => b.checkInDate === selectedDay);
    }, [accommodationBookings, selectedDay]);
    
    const dailyReportData = useMemo(() => {
        if (!selectedDay) return null;

        const bookingTransactions = dailyFilteredBookings.map(b => ({
            id: `b-${b.id}`,
            type: 'Activity/Tour',
            description: b.itemName,
            staffName: staffMap.get(b.staffId) || 'N/A',
            total: b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0),
            hostelProfit: b.hostelCommission,
            employeeCommission: b.employeeCommission
        }));

        const externalSaleTransactions = dailyFilteredExternalSales.map(s => ({
            id: `s-${s.id}`,
            type: 'External Sale',
            description: s.description || 'POS Sale',
            staffName: 'N/A',
            total: s.amount,
            hostelProfit: s.amount,
            employeeCommission: 0
        }));
        
        const platformPaymentTransactions = dailyFilteredPlatformPayments.map(p => ({
            id: `p-${p.id}`,
            type: 'Platform Payment',
            description: p.platform,
            staffName: 'N/A',
            total: p.amount,
            hostelProfit: p.amount,
            employeeCommission: 0
        }));

        const walkInTransactions = dailyFilteredWalkInGuests.map(g => ({
            id: `wi-${g.id}`,
            type: 'Walk-In Check-in',
            description: `${g.guestName} - ${roomMap.get(g.roomId) || 'N/A'}`,
            staffName: 'N/A',
            total: g.pricePerNight * g.numberOfNights,
            hostelProfit: g.pricePerNight * g.numberOfNights,
            employeeCommission: 0
        }));

        const accommodationBookingTransactions = dailyFilteredAccommodationBookings.map(b => ({
            id: `ab-${b.id}`,
            type: 'Booking Check-in',
            description: `${b.guestName} - ${b.platform}`,
            staffName: 'N/A',
            total: b.totalPrice,
            hostelProfit: b.totalPrice,
            employeeCommission: 0
        }));

        const allTransactions = [...bookingTransactions, ...externalSaleTransactions, ...platformPaymentTransactions, ...walkInTransactions, ...accommodationBookingTransactions];

        const totalDailyRevenue = allTransactions.reduce((sum, t) => sum + t.hostelProfit, 0);
        const totalDailyEmployeeCommission = allTransactions.reduce((sum, t) => sum + t.employeeCommission, 0);
        const dailyOpCosts = dailyFilteredBookings.reduce((sum, b) => sum + (b.fuelCost || 0) + (b.captainCost || 0), 0);
        const totalDailyExpenses = totalDailyEmployeeCommission + dailyOpCosts;
        const dailyNetProfit = totalDailyRevenue - totalDailyExpenses;

        return {
            totalDailyRevenue,
            totalDailyExpenses,
            dailyNetProfit,
            allTransactions,
        };
    }, [selectedDay, staffMap, roomMap, dailyFilteredBookings, dailyFilteredExternalSales, dailyFilteredPlatformPayments, dailyFilteredWalkInGuests, dailyFilteredAccommodationBookings]);


  const currencyFormat = (value: number) => `฿${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Form Components
  const CommonFormFields = ({ includeCommission = false, includeDiscount = false, includeFuelAndCaptain = false, includePeopleCount = false }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Booking Staff</label>
            <select id="staffId" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required className="mt-1 block w-full input-field">
                <option value="">Select Staff</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
        </div>
        {includePeopleCount && (
             <div>
                <label htmlFor="numberOfPeople" className="block text-sm font-medium text-slate-700">Number of People</label>
                <input type="number" id="numberOfPeople" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} min="1" required className="mt-1 block w-full input-field" />
            </div>
        )}
        {includeCommission && currentUserRole === Role.Admin && (
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
        {includeFuelAndCaptain && currentUserRole === Role.Admin && (
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
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-slate-800">Speed Boat Routes</h3>
                            {currentUserRole === Role.Admin && (
                                <button onClick={handleOpenManageTripsModal} className="px-3 py-1.5 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700">Manage Trips</button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {Object.entries(groupedSpeedBoatTrips).map(([route, trips]) => (
                                <div key={route} className="flex justify-between items-center p-3 rounded-md bg-slate-50 border">
                                    <div>
                                        <p className="font-semibold text-slate-800">{route}</p>
                                        <p className="text-xs text-slate-500">{trips.length} {trips.length > 1 ? 'companies' : 'company'} available</p>
                                    </div>
                                    <button onClick={() => handleOpenSpeedBoatModalForRoute(route, trips)} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Book</button>
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
            )}
            {activeTab === 'report' && currentUserRole === Role.Admin && (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-center gap-x-6 gap-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-slate-600">View Report By:</span>
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center space-x-1 cursor-pointer">
                                    <input type="radio" name="granularity" value="monthly" checked={reportGranularity === 'monthly'} onChange={() => setReportGranularity('monthly')} className="form-radio text-blue-600" />
                                    <span className="text-sm">Monthly</span>
                                </label>
                                <label className="flex items-center space-x-1 cursor-pointer">
                                    <input type="radio" name="granularity" value="yearly" checked={reportGranularity === 'yearly'} onChange={() => setReportGranularity('yearly')} className="form-radio text-blue-600" />
                                    <span className="text-sm">Yearly</span>
                                </label>
                            </div>
                        </div>

                        {reportGranularity === 'monthly' && (
                            <div className="flex items-center gap-4">
                                <div>
                                    <label htmlFor="month-filter" className="text-sm font-medium text-slate-600">Month:</label>
                                    <input 
                                        type="month" 
                                        id="month-filter"
                                        value={selectedMonth}
                                        onChange={e => setSelectedMonth(e.target.value)}
                                        className="ml-2 rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="day-filter" className="text-sm font-medium text-slate-600">Day:</label>
                                    <input 
                                        type="date" 
                                        id="day-filter"
                                        value={selectedDay}
                                        onChange={e => setSelectedDay(e.target.value)}
                                        className="ml-2 rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1"
                                    />
                                </div>
                                {selectedDay && (
                                    <button onClick={() => setSelectedDay('')} className="text-sm text-blue-600 hover:underline">
                                        View Full Month
                                    </button>
                                )}
                            </div>
                        )}

                        {reportGranularity === 'yearly' && (
                            <div>
                                <label htmlFor="year-filter" className="text-sm font-medium text-slate-600">Year:</label>
                                <input 
                                    type="number"
                                    id="year-filter"
                                    value={selectedYear}
                                    onChange={e => setSelectedYear(e.target.value)}
                                    className="ml-2 rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1 w-24"
                                    min="2020"
                                    max={new Date().getFullYear() + 5}
                                    step="1"
                                />
                            </div>
                        )}
                    </div>

                    {/* Daily Report View */}
                    {dailyReportData && reportGranularity === 'monthly' && (
                        <div className="mt-6 space-y-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <h2 className="text-xl font-bold text-slate-800">
                                Daily Report for {new Date(selectedDay + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <SummaryCard title="Daily Revenue" value={currencyFormat(dailyReportData.totalDailyRevenue)} icon={<CurrencyDollarIcon />} />
                                <SummaryCard title="Daily Expenses" value={currencyFormat(dailyReportData.totalDailyExpenses)} icon={<ReceiptPercentIcon />} />
                                <SummaryCard title="Daily Net Profit" value={currencyFormat(dailyReportData.dailyNetProfit)} icon={<TrendingUpIcon />} />
                            </div>
                            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                                <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Daily Transactions Log</h3>
                                <table className="w-full text-sm text-left text-slate-500">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Description</th>
                                            <th className="px-6 py-3">Staff</th>
                                            <th className="px-6 py-3">Total Sale</th>
                                            <th className="px-6 py-3">Hostel Profit</th>
                                            <th className="px-6 py-3">Emp. Commission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyReportData.allTransactions.map(t => (
                                            <tr key={t.id} className="bg-white border-b hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium">{t.type}</td>
                                                <td className="px-6 py-4">{t.description}</td>
                                                <td className="px-6 py-4">{t.staffName}</td>
                                                <td className="px-6 py-4">{currencyFormat(t.total)}</td>
                                                <td className="px-6 py-4 font-bold text-green-600">{currencyFormat(t.hostelProfit)}</td>
                                                <td className="px-6 py-4 font-medium text-orange-600">{currencyFormat(t.employeeCommission)}</td>
                                            </tr>
                                        ))}
                                        {dailyReportData.allTransactions.length === 0 && (
                                            <tr><td colSpan={6} className="text-center p-4 text-slate-500">No transactions for this day.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Monthly/Yearly Report View */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        <SummaryCard title="Total Revenue" value={currencyFormat(reportData.totalRevenue)} icon={<CurrencyDollarIcon />} />
                        <SummaryCard title="Accommodation Revenue" value={currencyFormat(reportData.totalAccommodationRevenue)} icon={<BuildingOfficeIcon />} />
                        <SummaryCard title="Total Expenses" value={currencyFormat(reportData.totalExpenses)} icon={<ReceiptPercentIcon />} />
                        <SummaryCard title="Net Profit" value={currencyFormat(reportData.netProfit)} icon={<TrendingUpIcon />} />
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Financial Breakdown - {reportPeriodTitle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200">
                            <div className="bg-white p-4">
                                <h4 className="font-semibold text-green-600 mb-2">Revenue Streams</h4>
                                <ul className="space-y-1 text-sm">
                                    <li className="flex justify-between"><span>Accommodation Revenue:</span> <span className="font-medium">{currencyFormat(reportData.totalAccommodationRevenue)}</span></li>
                                    <li className="flex justify-between"><span>Hostel Booking Commissions:</span> <span className="font-medium">{currencyFormat(reportData.totalHostelBookingCommission)}</span></li>
                                    <li className="flex justify-between"><span>External POS Sales:</span> <span className="font-medium">{currencyFormat(reportData.totalExternalSales)}</span></li>
                                    <li className="flex justify-between"><span>Platform Payments:</span> <span className="font-medium">{currencyFormat(reportData.totalPlatformRevenue)}</span></li>
                                    <li className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total Revenue:</span> <span>{currencyFormat(reportData.totalRevenue)}</span></li>
                                </ul>
                            </div>
                            <div className="bg-white p-4">
                                <h4 className="font-semibold text-red-600 mb-2">Expense Streams</h4>
                                <ul className="space-y-1 text-sm">
                                    <li className="flex justify-between"><span>Staff Salaries ({reportGranularity === 'yearly' ? 'Annual' : 'Monthly'} Est.):</span> <span className="font-medium">{currencyFormat(reportData.totalMonthlySalaries)}</span></li>
                                    <li className="flex justify-between"><span>Employee Commissions:</span> <span className="font-medium">{currencyFormat(reportData.totalEmployeeCommission)}</span></li>
                                    <li className="flex justify-between"><span>Utility Bills:</span> <span className="font-medium">{currencyFormat(reportData.totalUtilitiesCost)}</span></li>
                                    <li className="flex justify-between"><span>Operational Costs (Fuel/Captain):</span> <span className="font-medium">{currencyFormat(reportData.totalOperationalCosts)}</span></li>
                                    <li className="flex justify-between"><span>Salary Advances:</span> <span className="font-medium">{currencyFormat(reportData.totalSalaryAdvances)}</span></li>
                                    <li className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total Expenses:</span> <span>{currencyFormat(reportData.totalExpenses)}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Boat Company Payments Due - {reportPeriodTitle}</h3>
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Company Name</th>
                                    <th className="px-6 py-3">Amount to Pay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(reportData.companyDebts).map(([company, amount]) => (
                                    <tr key={company} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{company}</td>
                                        <td className="px-6 py-4 font-bold text-red-600">{currencyFormat(amount)}</td>
                                    </tr>
                                ))}
                                {Object.keys(reportData.companyDebts).length === 0 && (
                                     <tr><td colSpan={2} className="text-center p-4 text-slate-500">No payments due for this period.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                     <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-slate-800">Platform Payments - {reportPeriodTitle}</h3>
                            <button onClick={() => handleOpenPlatformPaymentModal()} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 text-sm">
                                <PlusIcon className="w-4 h-4 mr-2" /> Add Platform Payment
                            </button>
                        </div>
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Platform</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Reference</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                             </thead>
                             <tbody>
                                {filteredPlatformPayments.map(p => (
                                    <tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4">{p.date}</td>
                                        <td className="px-6 py-4 font-medium">{p.platform}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{currencyFormat(p.amount)}</td>
                                        <td className="px-6 py-4">{p.bookingReference || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button onClick={() => handleOpenPlatformPaymentModal(p)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                                <button onClick={() => onDeletePlatformPayment(p.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                 {filteredPlatformPayments.length === 0 && (
                                     <tr><td colSpan={5} className="text-center p-4 text-slate-500">No platform payments for this period.</td></tr>
                                )}
                             </tbody>
                        </table>
                    </div>
                     <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-slate-800">External POS Sales - {reportPeriodTitle}</h3>
                            <button onClick={() => handleOpenExternalSaleModal()} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 text-sm">
                                <PlusIcon className="w-4 h-4 mr-2" /> Add POS Sale
                            </button>
                        </div>
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                             </thead>
                             <tbody>
                                {filteredExternalSales.map(s => (
                                    <tr key={s.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4">{s.date}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{currencyFormat(s.amount)}</td>
                                        <td className="px-6 py-4">{s.description || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button onClick={() => handleOpenExternalSaleModal(s)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                                <button onClick={() => onDeleteExternalSale(s.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredExternalSales.length === 0 && (
                                     <tr><td colSpan={4} className="text-center p-4 text-slate-500">No external sales for this period.</td></tr>
                                )}
                             </tbody>
                        </table>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Staff Performance - {reportPeriodTitle}</h3>
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Staff Name</th>
                                    <th className="px-6 py-3">Bookings</th>
                                    <th className="px-6 py-3">Revenue Generated</th>
                                    <th className="px-6 py-3">Commission Earned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.staffPerformance.map(perf => (
                                    <tr key={perf.staffId} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{perf.staffName}</td>
                                        <td className="px-6 py-4">{perf.bookingsCount}</td>
                                        <td className="px-6 py-4">{currencyFormat(perf.totalRevenue)}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">{currencyFormat(perf.totalCommission)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">All Bookings - {reportPeriodTitle}</h3>
                        <table className="w-full text-sm text-left text-slate-500">
                             <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Booking ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Item Name</th>
                                    <th className="px-6 py-3">Staff</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Receipt</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                             </thead>
                             <tbody>
                                {filteredBookings.map(b => (
                                    <tr key={b.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-mono text-xs">{b.id.slice(-6)}</td>
                                        <td className="px-6 py-4">{b.bookingDate}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{b.itemName}</td>
                                        <td className="px-6 py-4">{staffMap.get(b.staffId) || 'N/A'}</td>
                                        <td className="px-6 py-4">{currencyFormat(b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0))}</td>
                                        <td className="px-6 py-4">
                                            {b.receiptImage ? <button onClick={() => setViewingReceipt(b.receiptImage)} className="text-blue-600 hover:text-blue-800"><EyeIcon /></button> : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleOpenEditBookingModal(b)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                                 {filteredBookings.length === 0 && (
                                     <tr><td colSpan={7} className="text-center p-4 text-slate-500">No bookings for this period.</td></tr>
                                )}
                             </tbody>
                        </table>
                    </div>
                </div>
            )}
            {activeTab === 'pricing' && currentUserRole === Role.Admin && (
                <PriceManagement
                    activities={activities}
                    speedBoatTrips={speedBoatTrips}
                    taxiBoatOptions={taxiBoatOptions}
                    extras={extras}
                    onAddActivity={onAddActivity}
                    onUpdateActivity={onUpdateActivity}
                    onDeleteActivity={onDeleteActivity}
                    onAddSpeedBoatTrip={onAddSpeedBoatTrip}
                    onUpdateSpeedBoatTrip={onUpdateSpeedBoatTrip}
                    onDeleteSpeedBoatTrip={onDeleteSpeedBoatTrip}
                    onAddTaxiBoatOption={onAddTaxiBoatOption}
                    onUpdateTaxiBoatOption={onUpdateTaxiBoatOption}
                    onDeleteTaxiBoatOption={onDeleteTaxiBoatOption}
                    onAddExtra={onAddExtra}
                    onUpdateExtra={onUpdateExtra}
                    onDeleteExtra={onDeleteExtra}
                />
            )}
        </div>

        {/* --- Modals --- */}
        <Modal isOpen={isBookingModalOpen} onClose={handleCloseModals} title={`Book: ${selectedActivity?.name}`}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label>
                    <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                </div>
                <CommonFormFields includeDiscount includeFuelAndCaptain includePeopleCount />
                 {currentUserRole === Role.Admin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission (THB)</label>
                            <input type="number" id="employeeCommission" value={employeeCommission} onChange={(e) => setEmployeeCommission(e.target.value)} className="mt-1 block w-full input-field" />
                        </div>
                        <div>
                            <label htmlFor="hostelCommission" className="block text-sm font-medium text-slate-700">Hostel Commission (THB)</label>
                            <input type="number" id="hostelCommission" value={hostelCommission} onChange={(e) => setHostelCommission(e.target.value)} className="mt-1 block w-full input-field" />
                        </div>
                    </div>
                )}
                <ExtrasFormFields />
                <PaymentFormFields />
                
                {(() => {
                    const numPeople = Number(numberOfPeople) || 1;
                    const baseTotal = (selectedActivity?.price || 0) * numPeople;
                    const { list: extrasList, total: extrasTotal } = calculateExtras(selectedExtras);
                    // Fix: Explicitly type finalTotal to ensure it's a number.
                    const finalTotal: number = baseTotal + extrasTotal - (Number(discount) || 0);

                    return (
                        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Booking Summary</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>{selectedActivity?.name} ({numPeople} x {currencyFormat(selectedActivity?.price || 0)})</span>
                                    <span>{currencyFormat(baseTotal)}</span>
                                </div>
                                {extrasList.length > 0 && (
                                <div className="flex justify-between border-t mt-1 pt-1">
                                    <span>Extras Total</span>
                                    <span>{currencyFormat(extrasTotal)}</span>
                                </div>
                                )}
                                {(Number(discount) || 0) > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Discount</span>
                                    <span>-{currencyFormat(Number(discount) || 0)}</span>
                                </div>
                                )}
                                <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span>{currencyFormat(finalTotal)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                <div className="flex justify-end pt-4">
                    <button onClick={handleBookInternalActivity} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isExternalBookingModalOpen} onClose={handleCloseModals} title={`Book External: ${selectedExternalActivity?.name}`}>
             <div className="space-y-6">
                <div>
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label>
                    <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                </div>
                <CommonFormFields includeCommission includeDiscount includePeopleCount />
                <ExtrasFormFields />
                <PaymentFormFields />
                 {(() => {
                    const numPeople = Number(numberOfPeople) || 1;
                    const baseTotal = (selectedExternalActivity?.price || 0) * numPeople;
                    const { list: extrasList, total: extrasTotal } = calculateExtras(selectedExtras);
                    // Fix: Explicitly type finalTotal to ensure it's a number.
                    const finalTotal: number = baseTotal + extrasTotal - (Number(discount) || 0);

                    return (
                        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Booking Summary</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>{selectedExternalActivity?.name} ({numPeople} x {currencyFormat(selectedExternalActivity?.price || 0)})</span>
                                    <span>{currencyFormat(baseTotal)}</span>
                                </div>
                                {extrasList.length > 0 && (
                                <div className="flex justify-between border-t mt-1 pt-1">
                                    <span>Extras Total</span>
                                    <span>{currencyFormat(extrasTotal)}</span>
                                </div>
                                )}
                                {(Number(discount) || 0) > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Discount</span>
                                    <span>-{currencyFormat(Number(discount) || 0)}</span>
                                </div>
                                )}
                                <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span>{currencyFormat(finalTotal)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })()}
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookExternal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

         <Modal isOpen={isSpeedBoatModalOpen} onClose={handleCloseModals} title={`Book: ${selectedRoute}`}>
             <div className="space-y-6">
                <div>
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label>
                    <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                </div>
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company</label>
                    <select 
                        id="company" 
                        value={selectedTrip?.id || ''} 
                        onChange={(e) => {
                            const trip = availableTripsForRoute.find(t => t.id === e.target.value);
                            if (trip) setSelectedTrip(trip);
                        }} 
                        required 
                        className="mt-1 block w-full input-field"
                    >
                        {availableTripsForRoute.map(trip => (
                            <option key={trip.id} value={trip.id}>{trip.company} - {trip.price} THB</option>
                        ))}
                    </select>
                </div>
                <CommonFormFields includePeopleCount />
                <PaymentFormFields />
                 {(() => {
                    const numPeople = Number(numberOfPeople) || 1;
                    const finalTotal = (selectedTrip?.price || 0) * numPeople;

                    return (
                        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Booking Summary</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between font-bold text-base">
                                    <span>Total</span>
                                    <span>{currencyFormat(finalTotal)}</span>
                                </div>
                                {selectedTrip && (
                                    <p className="text-xs text-slate-500 text-right">
                                        Hostel Profit: {currencyFormat((selectedTrip.price - selectedTrip.cost) * numPeople)}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })()}
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookSpeedBoat} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isPrivateTourModalOpen} onClose={handleCloseModals} title="Book Private Tour">
            <div className="space-y-6">
                 <div>
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label>
                    <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                </div>
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
                <CommonFormFields includeCommission includeFuelAndCaptain includePeopleCount />
                <PaymentFormFields />
                 <div className="flex justify-end pt-4">
                    <button onClick={handleBookPrivate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isExtraModalOpen} onClose={handleCloseModals} title={`Sell: ${selectedExtra?.name}`}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Sale Date</label>
                    <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                </div>
                <CommonFormFields includeCommission />
                <PaymentFormFields />
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookExtra} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Sale</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isTaxiModalOpen} onClose={handleCloseModals} title={`Book Taxi: ${selectedTaxiOption?.name}`}>
             <div className="space-y-6">
                <div>
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label>
                    <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                </div>
                <CommonFormFields includeCommission includePeopleCount />
                <PaymentFormFields />
                <div className="flex justify-end pt-4">
                    <button onClick={handleBookTaxi} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={!!viewingReceipt} onClose={() => setViewingReceipt(null)} title="View Receipt">
            {viewingReceipt && <img src={viewingReceipt} alt="Receipt" className="w-full h-auto rounded-md" />}
        </Modal>
        
        <Modal isOpen={isEditBookingModalOpen} onClose={handleCloseModals} title={`Edit Booking: ${editingBooking?.id?.slice(-6)}`}>
            {editingBooking && (
                <EditBookingForm 
                    booking={editingBooking}
                    onSave={handleSaveBookingUpdate}
                    onClose={handleCloseModals}
                />
            )}
        </Modal>
        
        <Modal isOpen={isExternalSaleModalOpen} onClose={handleCloseModals} title={editingExternalSale ? 'Edit POS Sale' : 'Add POS Sale'}>
            <ExternalSaleForm 
                onSave={handleSaveExternalSale}
                onClose={handleCloseModals}
                initialData={editingExternalSale}
            />
        </Modal>

        <Modal isOpen={isPlatformPaymentModalOpen} onClose={handleCloseModals} title={editingPlatformPayment ? 'Edit Platform Payment' : 'Add Platform Payment'}>
            <PlatformPaymentForm 
                onSave={handleSavePlatformPayment}
                onClose={handleCloseModals}
                initialData={editingPlatformPayment}
            />
        </Modal>

        <Modal isOpen={isManageTripsModalOpen} onClose={handleCloseModals} title="Manage Speed Boat Trips">
            <div className="space-y-4">
                <div className="flex justify-end">
                    <button onClick={() => setShowTripForm(prev => !prev)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                        {showTripForm ? 'Close Form' : 'Add New Trip'}
                    </button>
                </div>

                {showTripForm && (
                     <div className="p-4 bg-slate-50 rounded-lg border">
                        <h4 className="text-md font-semibold text-slate-800 mb-3">{editingSpeedBoatTrip ? 'Edit Trip' : 'Add New Trip'}</h4>
                        <SpeedBoatTripForm 
                            onSave={handleSaveSpeedBoatTrip}
                            onClose={() => { setShowTripForm(false); setEditingSpeedBoatTrip(null); }}
                            initialData={editingSpeedBoatTrip}
                        />
                    </div>
                )}
               
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {speedBoatTrips.map(trip => (
                        <div key={trip.id} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm border">
                            <div>
                                <p className="font-medium text-slate-800">{trip.route}</p>
                                <p className="text-xs text-slate-500">{trip.company} - Price: {trip.price} THB, Cost: {trip.cost} THB</p>
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => handleEditTrip(trip)} className="text-slate-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                                <button onClick={() => onDeleteSpeedBoatTrip(trip.id)} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>

         <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </div>
  );
};