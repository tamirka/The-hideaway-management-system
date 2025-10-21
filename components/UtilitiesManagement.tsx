// Fix: Create the UtilitiesManagement component.
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { UtilityRecord } from '../types';
import Modal from './Modal';
import SimpleBarChart from './SimpleBarChart';
import { PlusIcon, EditIcon, TrashIcon, UtilityIcon, EyeIcon } from '../constants';

// --- Form ---
interface UtilityFormProps {
  onSubmit: (record: Omit<UtilityRecord, 'id'> | UtilityRecord) => void;
  onClose: () => void;
  initialData?: UtilityRecord | null;
}

const UtilityForm: React.FC<UtilityFormProps> = ({ onSubmit, onClose, initialData }) => {
  const UTILITY_CATEGORIES = ['Food', 'Internet', 'Water', 'Cleaning', 'Transport', 'Electricity', 'Plumber'];
  
  const [category, setCategory] = useState('');
  const [otherType, setOtherType] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [billImage, setBillImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      if (UTILITY_CATEGORIES.includes(initialData.utilityType)) {
        setCategory(initialData.utilityType);
        setOtherType('');
      } else {
        setCategory('Other');
        setOtherType(initialData.utilityType);
      }
      setDate(initialData.date);
      setCost(String(initialData.cost));
      setBillImage(initialData.billImage || null);
    } else {
      setCategory('');
      setOtherType('');
      setDate('');
      setCost('');
      setBillImage(null);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUtilityType = category === 'Other' ? otherType : category;
    if (!finalUtilityType) {
        alert("Please specify a category or name for the utility.");
        return;
    }

    const recordData = {
        utilityType: finalUtilityType,
        date,
        cost: Number(cost),
        billImage: billImage || '',
    };

    if (initialData) {
      onSubmit({ ...initialData, ...recordData });
    } else {
      onSubmit(recordData);
    }
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full input-field">
                <option value="">Select a category...</option>
                {UTILITY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other</option>
            </select>
        </div>

        {category === 'Other' && (
            <div>
                <label htmlFor="otherType" className="block text-sm font-medium text-slate-700">Specify Name</label>
                <input 
                    type="text" 
                    id="otherType" 
                    value={otherType} 
                    onChange={(e) => setOtherType(e.target.value)} 
                    placeholder="e.g., Office Supplies" 
                    required 
                    className="mt-1 block w-full input-field" 
                />
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
             <div>
                <label htmlFor="cost" className="block text-sm font-medium text-slate-700">Price ($)</label>
                <input type="number" step="0.01" id="cost" value={cost} onChange={(e) => setCost(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700">Bill Image (Optional)</label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {billImage ? (
                        <>
                            <img src={billImage} alt="Bill preview" className="mx-auto h-24 w-auto rounded-md" />
                            <button type="button" onClick={() => setBillImage(null)} className="text-xs text-red-500 hover:text-red-700">Remove image</button>
                        </>
                    ) : (
                        <>
                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-slate-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} ref={fileInputRef} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                        </>
                    )}
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Record' : 'Add Record'}</button>
        </div>
        <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
  )
}


// --- Main Component ---
interface UtilitiesManagementProps {
  records: UtilityRecord[];
  onAddRecord: (newRecord: Omit<UtilityRecord, 'id'>) => void;
  onUpdateRecord: (updatedRecord: UtilityRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}

const UtilitiesManagement: React.FC<UtilitiesManagementProps> = ({ records, onAddRecord, onUpdateRecord, onDeleteRecord }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<UtilityRecord | null>(null);
    const [viewingBill, setViewingBill] = useState<string | null>(null);

    const handleOpenModal = (record?: UtilityRecord) => {
        setEditingRecord(record || null);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = (recordData: Omit<UtilityRecord, 'id'> | UtilityRecord) => {
        if ('id' in recordData) {
            onUpdateRecord(recordData);
        } else {
            onAddRecord(recordData);
        }
    };
    
    const chartData = useMemo(() => {
        const monthlyCosts = records.reduce((acc, record) => {
            const month = new Date(record.date + 'T00:00:00').toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + record.cost;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(monthlyCosts).map(([label, value]) => ({ label, value })).sort((a, b) => new Date(a.label + ' 1, 2000').getTime() - new Date(b.label + ' 1, 2000').getTime());
    }, [records]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Utilities Tracking</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Record
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <SimpleBarChart data={chartData} title="Monthly Utility Costs" color="#3b82f6" />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Category / Name</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Bill</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                        <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                                <UtilityIcon className="w-4 h-4 mr-2 text-slate-400" />
                                {record.utilityType}
                            </td>
                            <td className="px-6 py-4">{record.date}</td>
                            <td className="px-6 py-4">${record.cost.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                {record.billImage ? (
                                    <button onClick={() => setViewingBill(record.billImage)} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                                        <EyeIcon className="w-4 h-4 mr-1" />
                                        View
                                    </button>
                                ) : (
                                    <span className="text-xs text-slate-400">N/A</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-3">
                                    <button onClick={() => handleOpenModal(record)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                    <button onClick={() => onDeleteRecord(record.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRecord ? 'Edit Record' : 'Add New Record'}>
                <UtilityForm onSubmit={handleSubmit} onClose={handleCloseModal} initialData={editingRecord} />
            </Modal>
            
            <Modal isOpen={!!viewingBill} onClose={() => setViewingBill(null)} title="View Bill">
                {viewingBill && <img src={viewingBill} alt="Utility bill" className="w-full h-auto rounded-md" />}
            </Modal>
        </div>
    );
};

export default UtilitiesManagement;