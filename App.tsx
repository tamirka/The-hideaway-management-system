

// Fix: Implement the main App component to manage state and render child components.
import React, { useState } from 'react';
import { StaffManagement } from './components/StaffManagement';
import UtilitiesManagement from './components/UtilitiesManagement';
import RoomManagement from './components/RoomManagement';
import { ActivitiesManagement } from './components/ActivitiesManagement';
import type { Staff, Shift, Task, UtilityRecord, Room, Bed, Absence, Activity, SpeedBoatTrip, Booking, Extra, PaymentMethod, SalaryAdvance, TaxiBoatOption } from './types';
import { EntityCondition, TaskStatus, BedStatus } from './types';

// Mock Data
const MOCK_STAFF_DATA: Staff[] = [
    { id: 'staff1', name: 'John Doe', role: 'Manager', salary: 75000, contact: 'john.d@example.com', employeeId: 'EMP1001' },
    { id: 'staff2', name: 'Jane Smith', role: 'Nurse', salary: 62000, contact: 'jane.s@example.com', employeeId: 'EMP1002' },
    { id: 'staff3', name: 'Peter Jones', role: 'Maintenance', salary: 51000, contact: 'peter.j@example.com', employeeId: 'EMP1003' },
];
const MOCK_SHIFTS_DATA: Shift[] = [
    { id: 'shift1', date: '2024-07-29', staffName: 'Jane Smith', startTime: '07:00', endTime: '15:00' },
    { id: 'shift2', date: '2024-07-29', staffName: 'Peter Jones', startTime: '09:00', endTime: '17:00' },
    { id: 'shift3', date: '2024-07-30', staffName: 'Jane Smith', startTime: '07:00', endTime: '15:00' },
];
const MOCK_TASKS_DATA: Task[] = [
    { id: 'task1', description: 'Fix window latch in Economy Twin', assignedTo: 'staff3', dueDate: '2024-08-01', status: TaskStatus['In Progress'] },
    { id: 'task2', description: 'Monthly fire extinguisher check', assignedTo: 'staff3', dueDate: '2024-08-05', status: TaskStatus.Pending },
    { id: 'task3', description: 'Administer evening medications', assignedTo: 'staff2', dueDate: '2024-07-29', status: TaskStatus.Completed },
];
const MOCK_UTILITIES_DATA: UtilityRecord[] = [
    { id: 'util1', utilityType: 'Electricity', date: '2024-07-01', cost: 150.75, billImage: '' },
    { id: 'util2', utilityType: 'Water', date: '2024-07-01', cost: 80.20, billImage: '' },
    { id: 'util3', utilityType: 'Electricity', date: '2024-06-01', cost: 162.50, billImage: '' },
    { id: 'util4', utilityType: 'Internet', date: '2024-07-05', cost: 59.99, billImage: '' },
];
const MOCK_ABSENCES_DATA: Absence[] = [
    { id: 'abs1', staffId: 'staff2', date: '2024-07-25', reason: 'Sick leave' },
    { id: 'abs2', staffId: 'staff3', date: '2024-07-28', reason: 'Personal day' },
];
const MOCK_SALARY_ADVANCES_DATA: SalaryAdvance[] = [
    { id: 'adv1', staffId: 'staff3', date: '2024-07-15', amount: 500, reason: 'Emergency' },
    { id: 'adv2', staffId: 'staff2', date: '2024-07-20', amount: 1000 },
];


const MOCK_ACTIVITIES_DATA: Activity[] = [
    {
        id: 'activity1',
        name: 'Short Trip',
        description: 'A guided hike through lush jungle trails to a stunning, secluded waterfall. Includes a packed lunch and swimming time.',
        price: 700,
        imageUrl: 'https://placehold.co/600x400/22c55e/ffffff?text=Short+Trip'
    },
    {
        id: 'activity2',
        name: 'Far Trip',
        description: 'Enjoy a relaxing evening on the water with complimentary drinks and snacks as you watch the beautiful sunset over the ocean.',
        price: 800,
        imageUrl: 'https://placehold.co/600x400/f97316/ffffff?text=Far+Trip'
    },
    {
        id: 'activity3',
        name: 'Sunrise Trip',
        description: 'Visit a bustling local market to source fresh ingredients, then learn to cook authentic regional dishes with a local chef.',
        price: 700,
        imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Sunrise+Trip'
    },
];

const MOCK_SPEEDBOAT_DATA: SpeedBoatTrip[] = [
    { id: 'sb1', route: 'Lipe - Pakbara', price: 600, cost: 150 },
    { id: 'sb2', route: 'Lipe - Langkawi', price: 1400, cost: 200 },
    { id: 'sb3', route: 'Lipe - Hatyai (speed boat + minivan)', price: 850, cost: 250 },
    { id: 'sb4', route: 'Lipe - Phuket (speed boat + minivan)', price: 2450, cost: 450 },
    { id: 'sb5', route: 'Lipe - Lanta', price: 1700, cost: 300 },
    { id: 'sb6', route: 'Lipe - Phiphi (speed boat)', price: 2300, cost: 600 },
];

const MOCK_TAXI_BOAT_OPTIONS: TaxiBoatOption[] = [
    { id: 'taxi1', name: 'One Way', price: 200 },
    { id: 'taxi2', name: 'Round Trip', price: 350 },
];


const generateBeds = (roomId: string, count: number): Bed[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${roomId}-bed${i + 1}`,
        number: i + 1,
        status: BedStatus.Ready,
    }));
};

// Generate 14 bungalows
const bungalows: Room[] = Array.from({ length: 14 }, (_, i) => {
    const bungalowNumber = i + 1;
    let condition = EntityCondition.Good;
    let maintenanceNotes = '';
    let bedStatus = BedStatus.Ready;

    // Add some variety for demonstration
    if (bungalowNumber === 3) {
        condition = EntityCondition.Fair;
        maintenanceNotes = 'Leaky faucet in the bathroom.';
    }
    if (bungalowNumber === 5) {
        bedStatus = BedStatus['Needs Cleaning'];
    }
    if (bungalowNumber === 8) {
        maintenanceNotes = 'AC unit filter needs cleaning.';
    }
    if (bungalowNumber === 11) {
        bedStatus = BedStatus['Needs Cleaning'];
    }
    if (bungalowNumber === 12) {
        condition = EntityCondition['Needs Repair'];
        maintenanceNotes = 'Front door lock is broken.';
    }

    return {
        id: `bungalow${bungalowNumber}`,
        name: `Bungalow ${bungalowNumber}`,
        condition: condition,
        maintenanceNotes: maintenanceNotes,
        beds: [{
            id: `bungalow${bungalowNumber}-bed1`,
            number: 1,
            status: bedStatus,
        }],
    };
});

const MOCK_ROOMS_DATA: Room[] = [
    ...bungalows,
    {
        id: 'room2',
        name: 'Dorm A',
        condition: EntityCondition.Excellent,
        maintenanceNotes: '',
        beds: generateBeds('room2', 6),
    },
    {
        id: 'room3',
        name: 'Dorm B',
        condition: EntityCondition.Fair,
        maintenanceNotes: 'Window latch is loose on bed 3 window.',
        beds: generateBeds('room3', 7),
    }
];

// Pre-occupy some beds as requested for demonstration
// Bungalow statuses are set during generation. Now set for dorms.
// Dorm A is now at index 14
MOCK_ROOMS_DATA[14].beds[0].status = BedStatus['Needs Cleaning'];
// Dorm B is now at index 15
MOCK_ROOMS_DATA[15].beds[6].status = BedStatus['Needs Cleaning'];
// End Mock Data

type View = 'rooms' | 'staff' | 'utilities' | 'activities';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('activities');

  // State Management
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF_DATA);
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS_DATA);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS_DATA);
  const [utilityRecords, setUtilityRecords] = useState<UtilityRecord[]>(MOCK_UTILITIES_DATA);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS_DATA);
  const [absences, setAbsences] = useState<Absence[]>(MOCK_ABSENCES_DATA);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>(MOCK_SALARY_ADVANCES_DATA);
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES_DATA);
  const [speedBoatTrips] = useState<SpeedBoatTrip[]>(MOCK_SPEEDBOAT_DATA);
  const [taxiBoatOptions] = useState<TaxiBoatOption[]>(MOCK_TAXI_BOAT_OPTIONS);
  const [bookings, setBookings] = useState<Booking[]>([]);


  // Helper for ID generation
  const generateId = () => `id_${new Date().getTime()}`;

  // Booking Handler for Activity
  const handleBookActivity = (activityId: string, staffId: string, discount: number, extras: Omit<Extra, 'id'>[], paymentMethod: PaymentMethod, receiptImage?: string, fuelCost?: number, captainCost?: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) {
        console.error("Activity not found!");
        return;
    }

    const EMPLOYEE_COMMISSION = 50;
    const HOSTEL_COMMISSION = 50;
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    
    const newBooking: Booking = {
        id: generateId(),
        itemId: activityId,
        itemType: 'activity',
        itemName: activity.name,
        staffId,
        bookingDate: new Date().toISOString().split('T')[0],
        customerPrice: activity.price,
        employeeCommission: EMPLOYEE_COMMISSION,
        hostelCommission: HOSTEL_COMMISSION,
        discount,
        extras,
        extrasTotal,
        paymentMethod,
        receiptImage,
        fuelCost,
        captainCost,
    };

    setBookings(prev => [...prev, newBooking]);
    
    const staffMember = staff.find(s => s.id === staffId);
    const finalPrice = activity.price + extrasTotal - discount;
    alert(`Booking confirmed for ${activity.name} by ${staffMember?.name}!\n\nOriginal Price: ${activity.price} THB\nExtras: ${extrasTotal} THB\nDiscount: ${discount} THB\nFinal Price: ${finalPrice} THB\nPayment Method: ${paymentMethod}\n\nFuel Cost: ${fuelCost || 0} THB\nCaptain Cost: ${captainCost || 0} THB\n\nEmployee Commission: ${EMPLOYEE_COMMISSION} THB\nHostel Commission: ${HOSTEL_COMMISSION} THB`);
  };

  // Booking Handler for External Activity
  const handleBookExternalActivity = (activityId: string, staffId: string, totalCommission: number, discount: number, extras: Omit<Extra, 'id'>[], paymentMethod: PaymentMethod, receiptImage?: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) {
        console.error("Activity not found!");
        return;
    }

    const commissionSplit = totalCommission / 2;
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    
    const newBooking: Booking = {
        id: generateId(),
        itemId: activityId,
        itemType: 'external_activity',
        itemName: activity.name,
        staffId,
        bookingDate: new Date().toISOString().split('T')[0],
        customerPrice: activity.price,
        employeeCommission: commissionSplit,
        hostelCommission: commissionSplit,
        discount,
        extras,
        extrasTotal,
        paymentMethod,
        receiptImage,
    };

    setBookings(prev => [...prev, newBooking]);
    
    const staffMember = staff.find(s => s.id === staffId);
    const finalPrice = activity.price + extrasTotal - discount;
    alert(`External booking for ${activity.name} by ${staffMember?.name} confirmed!\n\nOriginal Price: ${activity.price} THB\nExtras: ${extrasTotal} THB\nDiscount: ${discount} THB\nFinal Price: ${finalPrice} THB\nPayment Method: ${paymentMethod}\n\nTotal Commission: ${totalCommission} THB\nEmployee Commission: ${commissionSplit} THB\nHostel Commission: ${commissionSplit} THB`);
  };
  
  // Booking Handler for Speed Boat
  const handleBookSpeedBoatTrip = (tripId: string, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, receiptImage?: string) => {
    const trip = speedBoatTrips.find(t => t.id === tripId);
    if (!trip) {
        console.error("Speed boat trip not found!");
        return;
    }

    const commissionSplit = totalCommission / 2;
    
    const newBooking: Booking = {
        id: generateId(),
        itemId: tripId,
        itemType: 'speedboat',
        itemName: trip.route,
        staffId,
        bookingDate: new Date().toISOString().split('T')[0],
        customerPrice: trip.price,
        employeeCommission: commissionSplit,
        hostelCommission: commissionSplit,
        paymentMethod,
        receiptImage,
    };

    setBookings(prev => [...prev, newBooking]);
    
    const staffMember = staff.find(s => s.id === staffId);
    alert(`Booking confirmed for ${trip.route} by ${staffMember?.name}!\n\nPayment Method: ${paymentMethod}\nTotal Commission: ${totalCommission} THB\nEmployee Commission: ${commissionSplit} THB\nHostel Commission: ${commissionSplit} THB`);
  };

  // Booking Handler for Private Tour
    const handleBookPrivateTour = (tourType: 'Half Day' | 'Full Day', price: number, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, receiptImage?: string, fuelCost?: number, captainCost?: number) => {
        const commissionSplit = totalCommission / 2;
        
        const newBooking: Booking = {
            id: generateId(),
            itemId: 'private_tour',
            itemType: 'private_tour',
            itemName: `Private Tour - ${tourType}`,
            staffId,
            bookingDate: new Date().toISOString().split('T')[0],
            customerPrice: price,
            employeeCommission: commissionSplit,
            hostelCommission: commissionSplit,
            paymentMethod,
            receiptImage,
            fuelCost,
            captainCost,
        };

        setBookings(prev => [...prev, newBooking]);
        
        const staffMember = staff.find(s => s.id === staffId);
        alert(`Private Tour booking confirmed by ${staffMember?.name}!\n\nType: ${tourType}\nPrice: ${price} THB\nPayment Method: ${paymentMethod}\n\nFuel Cost: ${fuelCost || 0} THB\nCaptain Cost: ${captainCost || 0} THB\n\nTotal Commission: ${totalCommission} THB\nEmployee Commission: ${commissionSplit} THB\nHostel Commission: ${commissionSplit} THB`);
    };

    // Booking Handler for Standalone Extra
    const handleBookStandaloneExtra = (extra: Extra, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, receiptImage?: string) => {
        const commissionSplit = totalCommission / 2;
        const newBooking: Booking = {
            id: generateId(),
            itemId: extra.id,
            itemType: 'extra',
            itemName: extra.name,
            staffId,
            bookingDate: new Date().toISOString().split('T')[0],
            customerPrice: extra.price,
            employeeCommission: commissionSplit,
            hostelCommission: commissionSplit,
            paymentMethod,
            receiptImage,
        };
        setBookings(prev => [...prev, newBooking]);
        const staffMember = staff.find(s => s.id === staffId);
        alert(`Sold ${extra.name} for ${extra.price} THB by ${staffMember?.name}.\n\nTotal Commission: ${totalCommission} THB\nEmployee Commission: ${commissionSplit} THB\nHostel Commission: ${commissionSplit} THB`);
    };

    // Booking Handler for Taxi Boat
    const handleBookTaxiBoat = (taxiOptionId: string, staffId: string, totalCommission: number, paymentMethod: PaymentMethod, receiptImage?: string) => {
        const taxiOption = taxiBoatOptions.find(t => t.id === taxiOptionId);
        if (!taxiOption) return;

        const commissionSplit = totalCommission / 2;

        const newBooking: Booking = {
            id: generateId(),
            itemId: taxiOption.id,
            itemType: 'taxi_boat',
            itemName: `Taxi Boat - ${taxiOption.name}`,
            staffId,
            bookingDate: new Date().toISOString().split('T')[0],
            customerPrice: taxiOption.price,
            employeeCommission: commissionSplit,
            hostelCommission: commissionSplit,
            paymentMethod,
            receiptImage,
        };
        setBookings(prev => [...prev, newBooking]);
        const staffMember = staff.find(s => s.id === staffId);
        alert(`Taxi Boat (${taxiOption.name}) booked for ${taxiOption.price} THB by ${staffMember?.name}.\n\nTotal Commission: ${totalCommission} THB\nEmployee Commission: ${commissionSplit} THB\nHostel Commission: ${commissionSplit} THB`);
    };


  // CRUD Handlers for Staff
  const handleAddStaff = (newStaff: Omit<Staff, 'id'>) => setStaff([...staff, { ...newStaff, id: generateId() }]);
  const handleUpdateStaff = (updatedStaff: Staff) => setStaff(staff.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  const handleDeleteStaff = (staffId: string) => setStaff(staff.filter(s => s.id !== staffId));

  // CRUD Handlers for Tasks
  const handleAddTask = (newTask: Omit<Task, 'id'>) => setTasks([...tasks, { ...newTask, id: generateId() }]);
  const handleUpdateTask = (updatedTask: Task) => setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  const handleDeleteTask = (taskId: string) => setTasks(tasks.filter(t => t.id !== taskId));

  // CRUD Handlers for Utilities
  const handleAddUtilityRecord = (newRecord: Omit<UtilityRecord, 'id'>) => setUtilityRecords([...utilityRecords, { ...newRecord, id: generateId() }]);
  const handleUpdateUtilityRecord = (updatedRecord: UtilityRecord) => setUtilityRecords(utilityRecords.map(u => u.id === updatedRecord.id ? updatedRecord : u));
  const handleDeleteUtilityRecord = (recordId: string) => setUtilityRecords(utilityRecords.filter(u => u.id !== recordId));
  
  // CRUD Handlers for Rooms
  const handleAddRoom = (newRoom: Omit<Room, 'id'>) => setRooms([...rooms, { ...newRoom, id: generateId() }]);
  const handleUpdateRoom = (updatedRoom: Room) => setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  const handleDeleteRoom = (roomId: string) => setRooms(rooms.filter(r => r.id !== roomId));
  
  // CRUD Handlers for Absences
  const handleAddAbsence = (newAbsence: Omit<Absence, 'id'>) => setAbsences([...absences, { ...newAbsence, id: generateId() }]);
  const handleUpdateAbsence = (updatedAbsence: Absence) => setAbsences(absences.map(a => a.id === updatedAbsence.id ? updatedAbsence : a));
  const handleDeleteAbsence = (absenceId: string) => setAbsences(absences.filter(a => a.id !== absenceId));

  // CRUD Handlers for Salary Advances
  const handleAddSalaryAdvance = (newAdvance: Omit<SalaryAdvance, 'id'>) => setSalaryAdvances([...salaryAdvances, { ...newAdvance, id: generateId() }]);
  const handleUpdateSalaryAdvance = (updatedAdvance: SalaryAdvance) => setSalaryAdvances(salaryAdvances.map(a => a.id === updatedAdvance.id ? updatedAdvance : a));
  const handleDeleteSalaryAdvance = (advanceId: string) => setSalaryAdvances(salaryAdvances.filter(a => a.id !== advanceId));


  const TABS: { id: View; label: string }[] = [
    { id: 'rooms', label: 'Rooms & Beds' },
    { id: 'staff', label: 'Staff & HR' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'activities', label: 'Activities' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'rooms':
        return <RoomManagement rooms={rooms} onAddRoom={handleAddRoom} onUpdateRoom={handleUpdateRoom} onDeleteRoom={handleDeleteRoom} />;
      case 'staff':
        return <StaffManagement staff={staff} shifts={shifts} tasks={tasks} absences={absences} salaryAdvances={salaryAdvances} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onAddAbsence={handleAddAbsence} onUpdateAbsence={handleUpdateAbsence} onDeleteAbsence={handleDeleteAbsence} onAddSalaryAdvance={handleAddSalaryAdvance} onUpdateSalaryAdvance={handleUpdateSalaryAdvance} onDeleteSalaryAdvance={handleDeleteSalaryAdvance} />;
      case 'utilities':
          return <UtilitiesManagement records={utilityRecords} onAddRecord={handleAddUtilityRecord} onUpdateRecord={handleUpdateUtilityRecord} onDeleteRecord={handleDeleteUtilityRecord} />;
      case 'activities':
          return <ActivitiesManagement 
                    activities={activities} 
                    speedBoatTrips={speedBoatTrips} 
                    taxiBoatOptions={taxiBoatOptions}
                    staff={staff} 
                    bookings={bookings} 
                    onBookActivity={handleBookActivity} 
                    onBookSpeedBoat={handleBookSpeedBoatTrip} 
                    onBookExternalActivity={handleBookExternalActivity} 
                    onBookPrivateTour={handleBookPrivateTour}
                    onBookStandaloneExtra={handleBookStandaloneExtra}
                    onBookTaxiBoat={handleBookTaxiBoat}
                 />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                 <h1 className="text-xl font-bold text-slate-800">Facility Management Dashboard</h1>
            </div>
            <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto -mb-px" aria-label="Tabs">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setCurrentView(tab.id)}
                        className={`${
                            currentView === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;