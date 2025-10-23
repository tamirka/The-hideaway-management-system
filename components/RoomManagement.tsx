import React, { useState, useEffect } from 'react';
import type { Room, Bed } from '../types';
import { BedStatus, EntityCondition, Role } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { PlusIcon, EditIcon, TrashIcon, BedIcon } from '../constants';

interface RoomFormProps {
  onSubmit: (room: Omit<Room, 'id'> | Room) => void;
  onClose: () => void;
  initialData?: Room | null;
}

const RoomForm: React.FC<RoomFormProps> = ({ onSubmit, onClose, initialData }) => {
  const isEditing = !!initialData;

  // State for the form fields
  const [name, setName] = useState('');
  const [condition, setCondition] = useState<EntityCondition>(EntityCondition.Excellent);
  const [maintenanceNotes, setMaintenanceNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      // We are editing, so set the condition and notes from the existing room data.
      setCondition(initialData.condition);
      setMaintenanceNotes(initialData.maintenanceNotes);
    } else {
      // We are adding, so reset the form to its default state.
      setName('');
      setCondition(EntityCondition.Excellent);
      setMaintenanceNotes('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // If editing, create an updated room object using the initial data
      // and overwriting only the fields that were edited.
      const updatedRoomData = {
          ...initialData,
          condition: condition,
          maintenanceNotes: maintenanceNotes,
      };
      onSubmit(updatedRoomData);
    } else {
      // If adding, create a new room object. The number of beds is not
      // handled by this form and defaults to zero.
      onSubmit({ name, condition, maintenanceNotes, beds: [] });
    }
    onClose();
  };

  // When editing, only "Excellent" and "Needs Repair" are valid conditions.
  // When adding, all conditions are available.
  const conditionOptions = isEditing
    ? [EntityCondition.Excellent, EntityCondition['Needs Repair']]
    : Object.values(EntityCondition);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEditing ? (
        // When editing, display the name of the room being updated instead of an input field.
        <p className="text-sm font-medium text-slate-700">
          Updating maintenance for: <span className="font-bold">{initialData.name}</span>
        </p>
      ) : (
        // When adding a new room, show the name input field.
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-slate-700">Room Name</label>
          <input type="text" id="roomName" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900" />
        </div>
      )}
      
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-slate-700">Condition</label>
        <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as EntityCondition)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-slate-900">
          {conditionOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="maintenanceNotes" className="block text-sm font-medium text-slate-700">Maintenance Notes</label>
        <textarea id="maintenanceNotes" value={maintenanceNotes} onChange={(e) => setMaintenanceNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900"></textarea>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{isEditing ? 'Update' : 'Add Room'}</button>
      </div>
    </form>
  );
};

interface RoomManagementProps {
  rooms: Room[];
  onAddRoom: (newRoom: Omit<Room, 'id'>) => void;
  onUpdateRoom: (updatedRoom: Room) => void;
  onDeleteRoom: (roomId: string) => void;
  currentUserRole: Role;
}

const RoomManagement: React.FC<RoomManagementProps> = ({ rooms, onAddRoom, onUpdateRoom, onDeleteRoom, currentUserRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleOpenModal = (room?: Room) => {
    setEditingRoom(room || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRoom(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (roomData: Omit<Room, 'id'> | Room) => {
    if ('id' in roomData) {
      onUpdateRoom(roomData);
    } else {
      onAddRoom(roomData);
    }
  };

  const handleBedStatusChange = (roomId: string, bedId: string, newStatus: BedStatus) => {
    const roomToUpdate = rooms.find(r => r.id === roomId);
    if (!roomToUpdate) return;

    const updatedBeds = roomToUpdate.beds.map(bed => {
      if (bed.id === bedId) {
        return { ...bed, status: newStatus };
      }
      return bed;
    });

    onUpdateRoom({ ...roomToUpdate, beds: updatedBeds });
  };

  const handleMarkAsFixed = (roomId: string) => {
    const roomToUpdate = rooms.find(r => r.id === roomId);
    if (!roomToUpdate) return;

    onUpdateRoom({ 
      ...roomToUpdate, 
      condition: EntityCondition.Good, 
      maintenanceNotes: '' 
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Rooms & Beds</h1>
        {currentUserRole === Role.Admin && (
            <button onClick={() => handleOpenModal()} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Room
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{room.name}</h3>
                    <Badge status={room.condition} />
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                      <button onClick={() => handleOpenModal(room)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                      {currentUserRole === Role.Admin && (
                        <button onClick={() => onDeleteRoom(room.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                      )}
                  </div>
              </div>
            </div>
            <div className="p-4 space-y-3 flex-grow">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {room.beds.map(bed => (
                       <div key={bed.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border">
                           <div className="flex items-center space-x-2">
                               <BedIcon className="w-5 h-5 text-slate-400 flex-shrink-0"/>
                               <span className="text-sm font-semibold text-slate-800">Bed {bed.number}</span>
                           </div>
                           {bed.status === BedStatus.Ready ? (
                               <button 
                                   onClick={() => handleBedStatusChange(room.id, bed.id, BedStatus['Needs Cleaning'])}
                                   className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                               >
                                   Check Out
                               </button>
                           ) : (
                               <button 
                                   onClick={() => handleBedStatusChange(room.id, bed.id, BedStatus.Ready)}
                                   className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                               >
                                   Mark as Clean
                               </button>
                           )}
                       </div>
                   ))}
               </div>
            </div>
            {room.maintenanceNotes && (
                <div className="p-4 bg-yellow-50 border-t space-y-2">
                    <div>
                        <p className="text-sm font-semibold text-yellow-800">Maintenance Notes:</p>
                        <p className="text-sm text-yellow-700 mt-1">{room.maintenanceNotes}</p>
                    </div>
                    <button
                        onClick={() => handleMarkAsFixed(room.id)}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Mark as Fixed
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRoom ? 'Edit Room' : 'Add New Room'}>
        <RoomForm onSubmit={handleSubmit} onClose={handleCloseModal} initialData={editingRoom} />
      </Modal>
    </div>
  );
};

export default RoomManagement;