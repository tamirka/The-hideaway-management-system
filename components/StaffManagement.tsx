import React, { useState, useMemo } from 'react';
import type { Staff, Shift, Task, Absence, SalaryAdvance, Booking } from '../types';
import { TaskStatus, Role } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { PlusIcon, EditIcon, TrashIcon } from '../constants';

// --- Staff Form ---
interface StaffFormProps {
  onSubmit: (staff: Omit<Staff, 'id'> | Staff) => void;
  onClose: () => void;
  initialData?: Staff | null;
}

const StaffForm: React.FC<StaffFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || Role.Staff,
    salary: initialData?.salary?.toString() || '',
    contact: initialData?.contact || '',
    employeeId: initialData?.employeeId || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staffData = {
        ...formData,
        role: formData.role as Role,
        salary: Number(formData.salary)
    };
    if (initialData) {
      onSubmit({ ...initialData, ...staffData });
    } else {
      onSubmit(staffData);
    }
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
                <select id="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full input-field">
                    {Object.values(Role).map(roleValue => (
                        <option key={roleValue} value={roleValue}>{roleValue}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="salary" className="block text-sm font-medium text-slate-700">Salary (Monthly)</label>
                <input type="number" id="salary" value={formData.salary} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="contact" className="block text-sm font-medium text-slate-700">Contact</label>
                <input type="text" id="contact" value={formData.contact} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700">Employee ID</label>
                <input type="text" id="employeeId" value={formData.employeeId} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
        </div>
         <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Employee' : 'Add Employee'}</button>
        </div>
        <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
  )
}

// --- Task Form ---
interface TaskFormProps {
    onSubmit: (task: Omit<Task, 'id'> | Task) => void;
    onClose: () => void;
    staffList: Staff[];
    initialData?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onClose, staffList, initialData }) => {
    const [formData, setFormData] = useState({
        description: initialData?.description || '',
        assignedTo: initialData?.assignedTo || '',
        dueDate: initialData?.dueDate || '',
        status: initialData?.status || TaskStatus.Pending,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSubmit({...initialData, ...formData});
        } else {
            onSubmit(formData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Task Description</label>
                <textarea id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full input-field" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-700">Assign To</label>
                    <select id="assignedTo" value={formData.assignedTo} onChange={handleChange} required className="mt-1 block w-full input-field">
                        <option value="">Select Staff</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Due Date</label>
                    <input type="date" id="dueDate" value={formData.dueDate} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
            </div>
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                <select id="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full input-field">
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Task' : 'Add Task'}</button>
            </div>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
    )
}

// --- Absence Form ---
interface AbsenceFormProps {
    onSubmit: (absence: Omit<Absence, 'id'> | Absence) => void;
    onClose: () => void;
    staffList: Staff[];
    initialData?: Absence | null;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({ onSubmit, onClose, staffList, initialData }) => {
    const [formData, setFormData] = useState({
        staffId: initialData?.staffId || '',
        date: initialData?.date || '',
        reason: initialData?.reason || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.staffId) {
            alert('Please select an employee.');
            return;
        }
        if (initialData) {
            onSubmit({...initialData, ...formData});
        } else {
            onSubmit(formData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Employee</label>
                    <select id="staffId" value={formData.staffId} onChange={handleChange} required className="mt-1 block w-full input-field">
                        <option value="">Select Employee</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date of Absence</label>
                    <input type="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason (Optional)</label>
                <textarea id="reason" value={formData.reason} onChange={handleChange} rows={3} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Absence' : 'Record Absence'}</button>
            </div>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </form>
    );
};


// --- Salary Advance Form ---
interface SalaryAdvanceFormProps {
    onSubmit: (advance: Omit<SalaryAdvance, 'id'> | SalaryAdvance) => void;
    onClose: () => void;
    staffList: Staff[];
    initialData?: SalaryAdvance | null;
}

const SalaryAdvanceForm: React.FC<SalaryAdvanceFormProps> = ({ onSubmit, onClose, staffList, initialData }) => {
    const [formData, setFormData] = useState({
        staffId: initialData?.staffId || '',
        date: initialData?.date || '',
        amount: initialData?.amount?.toString() || '',
        reason: initialData?.reason || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.staffId) {
            alert('Please select an employee.');
            return;
        }
        const advanceData = {
            ...formData,
            amount: Number(formData.amount) || 0
        };
        if (initialData) {
            onSubmit({...initialData, ...advanceData});
        } else {
            onSubmit(advanceData);
        }
        onClose();
    };
    
    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Employee</label>
                    <select id="staffId" value={formData.staffId} onChange={handleChange} required className="mt-1 block w-full input-field">
                        <option value="">Select Employee</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date of Advance</label>
                    <input type="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
            </div>
             <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount (THB)</label>
                <input type="number" id="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason (Optional)</label>
                <textarea id="reason" value={formData.reason} onChange={handleChange} rows={2} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Advance' : 'Give Advance'}</button>
            </div>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </form>
    );
}

// --- Staff Management Component ---
interface StaffManagementProps {
  staff: Staff[];
  shifts: Shift[];
  tasks: Task[];
  absences: Absence[];
  salaryAdvances: SalaryAdvance[];
  bookings: Booking[];
  onAddStaff: (newStaff: Omit<Staff, 'id'>) => void;
  onUpdateStaff: (updatedStaff: Staff) => void;
  onDeleteStaff: (staffId: string) => void;
  onAddTask: (newTask: Omit<Task, 'id'>) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddAbsence: (newAbsence: Omit<Absence, 'id'>) => void;
  onUpdateAbsence: (updatedAbsence: Absence) => void;
  onDeleteAbsence: (absenceId: string) => void;
  onAddSalaryAdvance: (newAdvance: Omit<SalaryAdvance, 'id'>) => void;
  onUpdateSalaryAdvance: (updatedAdvance: SalaryAdvance) => void;
  onDeleteSalaryAdvance: (advanceId: string) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ staff, tasks, absences, salaryAdvances, bookings, onAddStaff, onUpdateStaff, onDeleteStaff, onAddTask, onUpdateTask, onDeleteTask, onAddAbsence, onUpdateAbsence, onDeleteAbsence, onAddSalaryAdvance, onUpdateSalaryAdvance, onDeleteSalaryAdvance }) => {
    const [modal, setModal] = useState<'staff' | 'task' | 'absence' | 'advance' | null>(null);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
    const [editingAdvance, setEditingAdvance] = useState<SalaryAdvance | null>(null);

    const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s.name])), [staff]);

    const handleOpenModal = (type: 'staff' | 'task' | 'absence' | 'advance', data?: any) => {
        if (type === 'staff') setEditingStaff(data || null);
        if (type === 'task') setEditingTask(data || null);
        if (type === 'absence') setEditingAbsence(data || null);
        if (type === 'advance') setEditingAdvance(data || null);
        setModal(type);
    };

    const handleCloseModal = () => {
        setModal(null);
        setEditingStaff(null);
        setEditingTask(null);
        setEditingAbsence(null);
        setEditingAdvance(null);
    };
    
    return (
        <div className="space-y-8">
            {/* Staff List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-slate-800">Employee Management</h2><button onClick={() => handleOpenModal('staff')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"><PlusIcon className="w-5 h-5 mr-2" />Add Employee</button></div>
                 <div className="overflow-x-auto"><table className="w-full text-sm">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Salary</th><th className="px-6 py-3">Contact</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                    <tbody>{staff.map(s => <tr key={s.id} className="border-b"><td className="px-6 py-4 font-medium">{s.name}</td><td className="px-6 py-4">{s.role}</td><td className="px-6 py-4">{s.salary.toLocaleString()} THB</td><td className="px-6 py-4">{s.contact}</td><td className="px-6 py-4 text-right"><div className="flex justify-end space-x-3"><button onClick={() => handleOpenModal('staff', s)}><EditIcon/></button><button onClick={() => onDeleteStaff(s.id)}><TrashIcon/></button></div></td></tr>)}</tbody>
                 </table></div>
            </div>

            {/* Task Management */}
             <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-slate-800">Task Management</h2><button onClick={() => handleOpenModal('task')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"><PlusIcon className="w-5 h-5 mr-2" />Add Task</button></div>
                 <div className="overflow-x-auto"><table className="w-full text-sm">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Description</th><th className="px-6 py-3">Assigned To</th><th className="px-6 py-3">Due Date</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                    <tbody>{tasks.map(t => <tr key={t.id} className="border-b"><td className="px-6 py-4">{t.description}</td><td className="px-6 py-4">{staffMap.get(t.assignedTo) || 'N/A'}</td><td className="px-6 py-4">{t.dueDate}</td><td className="px-6 py-4"><Badge status={t.status}/></td><td className="px-6 py-4 text-right"><div className="flex justify-end space-x-3"><button onClick={() => handleOpenModal('task', t)}><EditIcon/></button><button onClick={() => onDeleteTask(t.id)}><TrashIcon/></button></div></td></tr>)}</tbody>
                 </table></div>
            </div>

            {/* Absence and Salary Advances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-slate-800">Absence Log</h2><button onClick={() => handleOpenModal('absence')} className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md"><PlusIcon className="w-4 h-4 mr-1" />Log Absence</button></div>
                    <div className="overflow-y-auto max-h-60"><ul>{absences.map(a => <li key={a.id} className="flex justify-between items-center p-2 border-b"><div className="text-sm"><strong>{staffMap.get(a.staffId)}</strong> on {a.date}</div><div className="flex space-x-2"><button onClick={() => handleOpenModal('absence', a)}><EditIcon className="w-4 h-4"/></button><button onClick={() => onDeleteAbsence(a.id)}><TrashIcon className="w-4 h-4"/></button></div></li>)}</ul></div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-slate-800">Salary Advances</h2><button onClick={() => handleOpenModal('advance')} className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md"><PlusIcon className="w-4 h-4 mr-1" />Give Advance</button></div>
                    <div className="overflow-y-auto max-h-60"><ul>{salaryAdvances.map(a => <li key={a.id} className="flex justify-between items-center p-2 border-b"><div className="text-sm"><strong>{staffMap.get(a.staffId)}</strong>: {a.amount.toLocaleString()} THB on {a.date}</div><div className="flex space-x-2"><button onClick={() => handleOpenModal('advance', a)}><EditIcon className="w-4 h-4"/></button><button onClick={() => onDeleteSalaryAdvance(a.id)}><TrashIcon className="w-4 h-4"/></button></div></li>)}</ul></div>
                </div>
            </div>
            
            {/* Modals */}
            <Modal isOpen={modal === 'staff'} onClose={handleCloseModal} title={editingStaff ? 'Edit Employee' : 'Add Employee'}><StaffForm onSubmit={editingStaff ? onUpdateStaff : onAddStaff} onClose={handleCloseModal} initialData={editingStaff} /></Modal>
            <Modal isOpen={modal === 'task'} onClose={handleCloseModal} title={editingTask ? 'Edit Task' : 'Add Task'}><TaskForm onSubmit={editingTask ? onUpdateTask : onAddTask} onClose={handleCloseModal} staffList={staff} initialData={editingTask} /></Modal>
            <Modal isOpen={modal === 'absence'} onClose={handleCloseModal} title={editingAbsence ? 'Edit Absence' : 'Log Absence'}><AbsenceForm onSubmit={editingAbsence ? onUpdateAbsence : onAddAbsence} onClose={handleCloseModal} staffList={staff} initialData={editingAbsence} /></Modal>
            <Modal isOpen={modal === 'advance'} onClose={handleCloseModal} title={editingAdvance ? 'Edit Salary Advance' : 'Give Salary Advance'}><SalaryAdvanceForm onSubmit={editingAdvance ? onUpdateSalaryAdvance : onAddSalaryAdvance} onClose={handleCloseModal} staffList={staff} initialData={editingAdvance} /></Modal>
        </div>
    );
};
