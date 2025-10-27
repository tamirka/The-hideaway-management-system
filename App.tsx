// Fix: Implement the main App component to manage state and render child components.
import React, { useState, useEffect, useMemo } from 'react';
import { StaffManagement } from './components/StaffManagement';
import UtilitiesManagement from './components/UtilitiesManagement';
import RoomManagement from './components/RoomManagement';
import { ActivitiesManagement } from './components/activities/ActivitiesManagement';
import WalkInManagement from './components/WalkInManagement';
import type { Staff, Shift, Task, UtilityRecord, Room, Bed, Absence, Activity, SpeedBoatTrip, Booking, Extra, SalaryAdvance, TaxiBoatOption, ExternalSale, PlatformPayment, WalkInGuest, AccommodationBooking, PaymentType } from './types';
import { EntityCondition, TaskStatus, BedStatus, Role, PaymentStatus } from './types';

// Mock Data
const MOCK_STAFF_DATA: Staff[] = [
    { id: 'staff1', name: 'John Doe', role: Role.Admin, salary: 25000, contact: 'john.d@example.com', employeeId: 'EMP1001' },
    { id: 'staff2', name: 'Jane Smith', role: Role.Staff, salary: 20000, contact: 'jane.s@example.com', employeeId: 'EMP1002' },
    { id: 'staff3', name: 'Peter Jones', role: Role.Staff, salary: 17000, contact: 'peter.j@example.com', employeeId: 'EMP1003' },
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
const MOCK_UTILITY_CATEGORIES = ['Food', 'Internet', 'Water', 'Cleaning', 'Transport', 'Electricity', 'Plumber'];

const MOCK_ABSENCES_DATA: Absence[] = [
    { id: 'abs1', staffId: 'staff2', date: '2024-07-25', reason: 'Sick leave' },
    { id: 'abs2', staffId: 'staff3', date: '2024-07-28', reason: 'Personal day' },
];
const MOCK_SALARY_ADVANCES_DATA: SalaryAdvance[] = [
    { id: 'adv1', staffId: 'staff3', date: '2024-07-15', amount: 500, reason: 'Emergency' },
    { id: 'adv2', staffId: 'staff2', date: '2024-07-20', amount: 1000 },
];

const MOCK_EXTERNAL_SALES_DATA: ExternalSale[] = [
    { id: 'ext1', date: '2024-07-28', amount: 12500, description: 'Weekend bar sales' },
    { id: 'ext2', date: '2024-07-27', amount: 9800, description: 'Bar and snacks' },
    { id: 'ext3', date: '2024-06-28', amount: 11000 },
];

const MOCK_PLATFORM_PAYMENTS_DATA: PlatformPayment[] = [
    { id: 'pp1', date: '2024-07-28', platform: 'Booking.com', amount: 45000, bookingReference: 'BKNG12345' },
    { id: 'pp2', date: '2024-07-27', platform: 'Hostelworld', amount: 28000, bookingReference: 'HW54321' },
    { id: 'pp3', date: '2024-06-25', platform: 'Agoda', amount: 19500 },
];


const MOCK_ACTIVITIES_DATA: Activity[] = [
    {
        id: 'activity1',
        name: 'Short Trip',
        type: 'Internal',
        description: 'A guided hike through lush jungle trails to a stunning, secluded waterfall. Includes a packed lunch and swimming time.',
        price: 700,
        imageUrl: 'https://placehold.co/600x400/22c55e/ffffff?text=Short+Trip',
        commission: 100
    },
    {
        id: 'activity2',
        name: 'Far Trip',
        type: 'External',
        description: 'Enjoy a relaxing evening on the water with complimentary drinks and snacks as you watch the beautiful sunset over the ocean.',
        price: 800,
        imageUrl: 'https://placehold.co/600x400/f97316/ffffff?text=Far+Trip',
        commission: 120,
        companyCost: 600,
    },
    {
        id: 'activity3',
        name: 'Sunrise Trip',
        type: 'Internal',
        description: 'Visit a bustling local market to source fresh ingredients, then learn to cook authentic regional dishes with a local chef.',
        price: 700,
        imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Sunrise+Trip'
    },
];

const MOCK_SPEEDBOAT_DATA: SpeedBoatTrip[] = [
    { id: 'sb1', route: 'Lipe - Pakbara', company: 'Satun Pakbara', price: 600, cost: 450, commission: 50 },
    { id: 'sb1b', route: 'Lipe - Pakbara', company: 'Bundhaya', price: 650, cost: 500, commission: 50 },
    { id: 'sb2', route: 'Lipe - Langkawi', company: 'Ferry Langkawi', price: 1400, cost: 1200, commission: 100 },
    { id: 'sb3', route: 'Lipe - Hatyai (speed boat + minivan)', company: 'Tigerline', price: 850, cost: 600 },
    { id: 'sb4', route: 'Lipe - Phuket (speed boat + minivan)', company: 'Bundhaya Speed Boat', price: 2450, cost: 2000, commission: 150 },
    { id: 'sb5', route: 'Lipe - Lanta', company: 'Satun Pakbara', price: 1700, cost: 1400 },
    { id: 'sb6', route: 'Lipe - Phiphi (speed boat)', company: 'Tigerline', price: 2300, cost: 1700, commission: 200 },
];

const MOCK_TAXI_BOAT_OPTIONS: TaxiBoatOption[] = [
    { id: 'taxi1', name: 'One Way', price: 200, commission: 20 },
    { id: 'taxi2', name: 'Round Trip', price: 350, commission: 35 },
];

const MOCK_EXTRAS_DATA: Extra[] = [
    { id: 'fruits', name: 'Fruits set', price: 100 },
    { id: 'veggie', name: 'Veggie option', price: 150 },
    { id: 'lunch', name: 'Lunch set', price: 150 },
    { id: 'musli', name: 'Musli', price: 50 },
    { id: 'snorkel', name: 'Snorkel', price: 50 },
    { id: 'gopro', name: 'Go pro (per day)', price: 600 },
    { id: 'paddle_hour', name: 'Paddle board (per hour)', price: 200, commission: 20 },
    { id: 'paddle_day', name: 'Paddle board (per day)', price: 600, commission: 50 },
];

const MOCK_PAYMENT_TYPES: PaymentType[] = [
    { id: 'pm_cash', name: 'Cash' },
    { id: 'pm_card', name: 'Credit Card' },
    { id: 'pm_inet', name: 'Internet Payment' },
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

const MOCK_WALK_IN_GUESTS_DATA: WalkInGuest[] = [
    { id: 'walkin1', guestName: 'Alex Ray', roomId: 'bungalow1', checkInDate: '2024-07-28', numberOfNights: 2, pricePerNight: 500, amountPaid: 1000, paymentMethod: 'Cash', nationality: 'USA', status: PaymentStatus.Paid },
    { id: 'walkin2', guestName: 'Mia Wong', roomId: 'room2', bedNumber: 2, checkInDate: '2024-07-29', numberOfNights: 3, pricePerNight: 250, amountPaid: 500, paymentMethod: 'Credit Card', nationality: 'Canada', status: PaymentStatus['Deposit Paid'] },
];

const MOCK_ACCOMMODATION_BOOKINGS_DATA: AccommodationBooking[] = [
    { id: 'accbook1', guestName: 'Leo Messi', platform: 'Booking.com', roomId: 'bungalow2', checkInDate: '2024-07-30', numberOfNights: 4, totalPrice: 2200, amountPaid: 220, status: PaymentStatus['Deposit Paid'] },
    { id: 'accbook2', guestName: 'Cristiano Ronaldo', platform: 'Hostelworld', roomId: 'room3', bedNumber: 1, checkInDate: '2024-08-01', numberOfNights: 5, totalPrice: 1500, amountPaid: 1500, status: PaymentStatus.Paid },
    { id: 'accbook3', guestName: 'Neymar Jr', platform: 'Agoda', roomId: 'bungalow4', checkInDate: '2024-08-02', numberOfNights: 2, totalPrice: 1100, amountPaid: 110, status: PaymentStatus['Deposit Paid'] },
];


// Pre-occupy some beds as requested for demonstration
// Bungalow statuses are set during generation. Now set for dorms.
// Dorm A is now at index 14
MOCK_ROOMS_DATA[14].beds[0].status = BedStatus['Needs Cleaning'];
// Dorm B is now at index 15
MOCK_ROOMS_DATA[15].beds[6].status = BedStatus['Needs Cleaning'];
// End Mock Data

type View = 'rooms' | 'staff' | 'utilities' | 'activities' | 'booking';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('activities');
  const [currentUserRole, setCurrentUserRole] = useState<Role>(Role.Admin);

  // State Management
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF_DATA);
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS_DATA);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS_DATA);
  const [utilityRecords, setUtilityRecords] = useState<UtilityRecord[]>(MOCK_UTILITIES_DATA);
  const [utilityCategories, setUtilityCategories] = useState<string[]>(MOCK_UTILITY_CATEGORIES);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS_DATA);
  const [absences, setAbsences] = useState<Absence[]>(MOCK_ABSENCES_DATA);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>(MOCK_SALARY_ADVANCES_DATA);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES_DATA);
  const [speedBoatTrips, setSpeedBoatTrips] = useState<SpeedBoatTrip[]>(MOCK_SPEEDBOAT_DATA);
  const [taxiBoatOptions, setTaxiBoatOptions] = useState<TaxiBoatOption[]>(MOCK_TAXI_BOAT_OPTIONS);
  const [extras, setExtras] = useState<Extra[]>(MOCK_EXTRAS_DATA);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [externalSales, setExternalSales] = useState<ExternalSale[]>(MOCK_EXTERNAL_SALES_DATA);
  const [platformPayments, setPlatformPayments] = useState<PlatformPayment[]>(MOCK_PLATFORM_PAYMENTS_DATA);
  const [walkInGuests, setWalkInGuests] = useState<WalkInGuest[]>(MOCK_WALK_IN_GUESTS_DATA);
  const [accommodationBookings, setAccommodationBookings] = useState<AccommodationBooking[]>(MOCK_ACCOMMODATION_BOOKINGS_DATA);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>(MOCK_PAYMENT_TYPES);


  // Helper for ID generation
  const generateId = () => `id_${new Date().getTime()}`;

  // Booking Handler for Activity
  const handleBookActivity = (activityId: string, staffId: string, numberOfPeople: number, discount: number, extras: Omit<Extra, 'id' | 'commission'>[], paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) {
        console.error("Activity not found!");
        return;
    }

    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    const totalEmployeeCommission = (employeeCommission || 0) * numberOfPeople;
    
    let itemCost: number | undefined = undefined;
    if (activity.type === 'Internal') {
        const internalCost = (fuelCost || 0) + (captainCost || 0);
        if (internalCost > 0) itemCost = internalCost;
    } else { // External
        const externalCost = (activity.companyCost || 0) * numberOfPeople;
        if (externalCost > 0) itemCost = externalCost;
    }

    const newBooking: Booking = {
        id: generateId(),
        itemId: activityId,
        itemType: 'activity',
        itemName: activity.name,
        staffId,
        bookingDate: bookingDate,
        customerPrice: activity.price * numberOfPeople,
        numberOfPeople,
        discount,
        extras,
        extrasTotal,
        paymentMethod,
        receiptImage,
        fuelCost,
        captainCost,
        itemCost: itemCost,
        employeeCommission: totalEmployeeCommission,
    };

    setBookings(prev => [...prev, newBooking]);
    
    const staffMember = staff.find(s => s.id === staffId);
    const basePrice = activity.price * numberOfPeople;
    const finalPrice = basePrice + extrasTotal - (discount || 0);
    
    let costBreakdown = '';
    if (activity.type === 'Internal') {
        costBreakdown = `\nFuel Cost: ${fuelCost || 0} THB\nCaptain Cost: ${captainCost || 0} THB`;
    } else {
        costBreakdown = `\nCompany Cost: ${itemCost || 0} THB`;
    }

    alert(`Booking confirmed for ${activity.name} by ${staffMember?.name}!\n\nBooking Date: ${bookingDate}\n${numberOfPeople} person(s) x ${activity.price} THB = ${basePrice} THB\nExtras: ${extrasTotal} THB\nDiscount: ${discount || 0} THB\nFinal Price: ${finalPrice} THB\nPayment Method: ${paymentMethod}${costBreakdown}\nEmployee Commission: ${totalEmployeeCommission || 0} THB`);
  };
  
  // Booking Handler for Speed Boat
  const handleBookSpeedBoatTrip = (tripId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => {
    const trip = speedBoatTrips.find(t => t.id === tripId);
    if (!trip) {
        console.error("Speed boat trip not found!");
        return;
    }

    const totalEmployeeCommission = (employeeCommission || 0) * numberOfPeople;
    
    const newBooking: Booking = {
        id: generateId(),
        itemId: tripId,
        itemType: 'speedboat',
        itemName: `${trip.route} (${trip.company})`,
        staffId,
        bookingDate: bookingDate,
        customerPrice: trip.price * numberOfPeople,
        numberOfPeople,
        paymentMethod,
        receiptImage,
        itemCost: trip.cost * numberOfPeople,
        employeeCommission: totalEmployeeCommission,
    };

    setBookings(prev => [...prev, newBooking]);
    
    const staffMember = staff.find(s => s.id === staffId);
    const finalPrice = trip.price * numberOfPeople;
    alert(`Booking confirmed for ${trip.route} by ${staffMember?.name}!\n\nBooking Date: ${bookingDate}\n${numberOfPeople} person(s) x ${trip.price} THB = ${finalPrice} THB\nPayment Method: ${paymentMethod}\n\nEmployee Commission: ${totalEmployeeCommission || 0} THB`);
  };

  // Booking Handler for Private Tour
    const handleBookPrivateTour = (tourType: 'Half Day' | 'Full Day', price: number, numberOfPeople: number, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number, hostelCommission?: number) => {
        const newBooking: Booking = {
            id: generateId(),
            itemId: 'private_tour',
            itemType: 'private_tour',
            itemName: `Private Tour - ${tourType}`,
            staffId,
            bookingDate: bookingDate,
            customerPrice: price,
            numberOfPeople,
            paymentMethod,
            receiptImage,
            fuelCost,
            captainCost,
            itemCost: (fuelCost || 0) + (captainCost || 0),
            employeeCommission,
            hostelCommission,
        };

        setBookings(prev => [...prev, newBooking]);
        
        const staffMember = staff.find(s => s.id === staffId);
        alert(`Private Tour booking confirmed by ${staffMember?.name}!\n\nBooking Date: ${bookingDate}\nType: ${tourType}\nFor: ${numberOfPeople} person(s)\nPrice: ${price} THB\nPayment Method: ${paymentMethod}\n\nFuel Cost: ${fuelCost || 0} THB\nCaptain Cost: ${captainCost || 0} THB\nHostel Commission: ${hostelCommission || 0} THB\nEmployee Commission: ${employeeCommission || 0} THB`);
    };

    // Booking Handler for Standalone Extra
    const handleBookStandaloneExtra = (extra: Extra, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, quantity: number = 1, employeeCommission?: number) => {
        const finalPrice = extra.price * quantity;
        
        let itemName = extra.name;
        if (extra.id === 'paddle_hour' && quantity > 1) {
            itemName = `${extra.name} (${quantity} hours)`;
        } else if (extra.id === 'paddle_day' && quantity > 1) {
            itemName = `${extra.name} (${quantity} days)`;
        } else if (quantity > 1) {
            itemName = `${extra.name} (x${quantity})`;
        }

        const totalEmployeeCommission = employeeCommission ? employeeCommission * quantity : undefined;

        const newBooking: Booking = {
            id: generateId(),
            itemId: extra.id,
            itemType: 'extra',
            itemName: itemName,
            staffId,
            bookingDate: bookingDate,
            customerPrice: finalPrice,
            numberOfPeople: quantity, // Using this field to store quantity/hours
            paymentMethod,
            receiptImage,
            employeeCommission: totalEmployeeCommission,
        };
        setBookings(prev => [...prev, newBooking]);
        const staffMember = staff.find(s => s.id === staffId);
        
        let alertMessage = `Sold ${itemName} for ${finalPrice} THB by ${staffMember?.name} on ${bookingDate}.`;
        if (totalEmployeeCommission) {
            alertMessage += `\nEmployee Commission: ${totalEmployeeCommission} THB`;
        }
        alert(alertMessage);
    };

    // Booking Handler for Taxi Boat
    const handleBookTaxiBoat = (taxiOptionId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => {
        const taxiOption = taxiBoatOptions.find(t => t.id === taxiOptionId);
        if (!taxiOption) return;

        const totalEmployeeCommission = (employeeCommission || 0) * numberOfPeople;

        const newBooking: Booking = {
            id: generateId(),
            itemId: taxiOption.id,
            itemType: 'taxi_boat',
            itemName: `Taxi Boat - ${taxiOption.name}`,
            staffId,
            bookingDate: bookingDate,
            customerPrice: taxiOption.price * numberOfPeople,
            numberOfPeople,
            paymentMethod,
            receiptImage,
            employeeCommission: totalEmployeeCommission,
        };
        setBookings(prev => [...prev, newBooking]);
        const staffMember = staff.find(s => s.id === staffId);
        alert(`Taxi Boat (${taxiOption.name}) booked for ${numberOfPeople} person(s) at ${taxiOption.price * numberOfPeople} THB by ${staffMember?.name} on ${bookingDate}.\nEmployee Commission: ${totalEmployeeCommission || 0} THB`);
    };

    // CRUD Handlers for Bookings
    const handleUpdateBooking = (updatedBooking: Booking) => {
        setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    };

    const handleDeleteBooking = (bookingId: string) => {
        setBookings(bookings.filter(b => b.id !== bookingId));
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
  
  // CRUD Handlers for Utility Categories
  const handleAddUtilityCategory = (newCategory: string) => {
    if (newCategory && !utilityCategories.map(c => c.toLowerCase()).includes(newCategory.toLowerCase())) {
        setUtilityCategories([...utilityCategories, newCategory].sort());
    }
  };
  const handleDeleteUtilityCategory = (categoryToDelete: string) => {
      setUtilityCategories(utilityCategories.filter(c => c !== categoryToDelete));
  };

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
  
  // CRUD Handlers for External Sales
  const handleAddExternalSale = (newSale: Omit<ExternalSale, 'id'>) => setExternalSales([...externalSales, { ...newSale, id: generateId() }]);
  const handleUpdateExternalSale = (updatedSale: ExternalSale) => setExternalSales(externalSales.map(s => s.id === updatedSale.id ? updatedSale : s));
  // Fix: Corrected the handleDeleteExternalSale to use externalSales.filter instead of a non-existent global filter function.
  const handleDeleteExternalSale = (saleId: string) => setExternalSales(externalSales.filter(s => s.id !== saleId));
  
  // CRUD Handlers for Platform Payments
  const handleAddPlatformPayment = (newPayment: Omit<PlatformPayment, 'id'>) => setPlatformPayments([...platformPayments, { ...newPayment, id: generateId() }]);
  const handleUpdatePlatformPayment = (updatedPayment: PlatformPayment) => setPlatformPayments(platformPayments.map(p => p.id === updatedPayment.id ? updatedPayment : p));
  const handleDeletePlatformPayment = (paymentId: string) => setPlatformPayments(platformPayments.filter(p => p.id !== paymentId));

  // CRUD Handlers for Walk-in Guests
  const handleAddWalkInGuest = (newGuest: Omit<WalkInGuest, 'id'>) => setWalkInGuests([...walkInGuests, { ...newGuest, id: generateId() }]);
  const handleUpdateWalkInGuest = (updatedGuest: WalkInGuest) => setWalkInGuests(walkInGuests.map(g => g.id === updatedGuest.id ? updatedGuest : g));
  const handleDeleteWalkInGuest = (guestId: string) => setWalkInGuests(walkInGuests.filter(g => g.id !== guestId));
  
  // CRUD Handlers for Accommodation Bookings
  const handleAddAccommodationBooking = (newBooking: Omit<AccommodationBooking, 'id'>) => setAccommodationBookings([...accommodationBookings, { ...newBooking, id: generateId() }]);
  const handleUpdateAccommodationBooking = (updatedBooking: AccommodationBooking) => setAccommodationBookings(accommodationBookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  const handleDeleteAccommodationBooking = (bookingId: string) => setAccommodationBookings(accommodationBookings.filter(b => b.id !== bookingId));

  // CRUD Handlers for Speed Boat Trips
  const handleAddSpeedBoatTrip = (newTrip: Omit<SpeedBoatTrip, 'id'>) => setSpeedBoatTrips([...speedBoatTrips, { ...newTrip, id: generateId() }]);
  const handleUpdateSpeedBoatTrip = (updatedTrip: SpeedBoatTrip) => setSpeedBoatTrips(speedBoatTrips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  const handleDeleteSpeedBoatTrip = (tripId: string) => setSpeedBoatTrips(speedBoatTrips.filter(t => t.id !== tripId));

  // CRUD Handlers for Activities
  const handleAddActivity = (newActivity: Omit<Activity, 'id'>) => setActivities([...activities, { ...newActivity, id: generateId() }]);
  const handleUpdateActivity = (updatedActivity: Activity) => {
      setActivities(activities.map(a => a.id === updatedActivity.id ? updatedActivity : a));
  };
  const handleDeleteActivity = (activityId: string) => setActivities(activities.filter(a => a.id !== activityId));

  // CRUD Handlers for Taxi Boat Options
  const handleAddTaxiBoatOption = (newOption: Omit<TaxiBoatOption, 'id'>) => setTaxiBoatOptions([...taxiBoatOptions, { ...newOption, id: generateId() }]);
  const handleUpdateTaxiBoatOption = (updatedOption: TaxiBoatOption) => {
      setTaxiBoatOptions(taxiBoatOptions.map(o => o.id === updatedOption.id ? updatedOption : o));
  };
  const handleDeleteTaxiBoatOption = (optionId: string) => setTaxiBoatOptions(taxiBoatOptions.filter(o => o.id !== optionId));
  
  // CRUD Handlers for Extras
  const handleAddExtra = (newExtra: Omit<Extra, 'id'>) => setExtras([...extras, { ...newExtra, id: generateId() }]);
  const handleUpdateExtra = (updatedExtra: Extra) => {
      setExtras(extras.map(e => e.id === updatedExtra.id ? updatedExtra : e));
  };
  const handleDeleteExtra = (extraId: string) => setExtras(extras.filter(e => e.id !== extraId));
  
  // CRUD Handlers for Payment Types
  const handleAddPaymentType = (newType: Omit<PaymentType, 'id'>) => setPaymentTypes([...paymentTypes, { ...newType, id: generateId() }]);
  const handleUpdatePaymentType = (updatedType: PaymentType) => setPaymentTypes(paymentTypes.map(p => p.id === updatedType.id ? updatedType : p));
  const handleDeletePaymentType = (typeId: string) => setPaymentTypes(paymentTypes.filter(p => p.id !== typeId));

  const TABS: { id: View; label: string }[] = [
    { id: 'rooms', label: 'Rooms & Beds' },
    { id: 'booking', label: 'Booking' },
    { id: 'staff', label: 'Staff & HR' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'activities', label: 'Activities' },
  ];
  
  const visibleTabs = useMemo(() => {
    if (currentUserRole === Role.Admin) {
      return TABS;
    }
    return TABS.filter(tab => ['rooms', 'booking', 'activities', 'utilities'].includes(tab.id));
  }, [currentUserRole]);

  useEffect(() => {
      const isCurrentViewVisible = visibleTabs.some(tab => tab.id === currentView);
      if (!isCurrentViewVisible) {
          setCurrentView(visibleTabs[0].id);
      }
  }, [currentUserRole, currentView, visibleTabs]);


  const renderContent = () => {
    switch (currentView) {
      case 'rooms':
        return <RoomManagement rooms={rooms} onAddRoom={handleAddRoom} onUpdateRoom={handleUpdateRoom} onDeleteRoom={handleDeleteRoom} currentUserRole={currentUserRole} />;
      case 'booking':
        return <WalkInManagement 
                    rooms={rooms}
                    walkInGuests={walkInGuests}
                    accommodationBookings={accommodationBookings}
                    paymentTypes={paymentTypes}
                    onAddWalkInGuest={handleAddWalkInGuest}
                    onUpdateWalkInGuest={handleUpdateWalkInGuest}
                    onDeleteWalkInGuest={handleDeleteWalkInGuest}
                    onAddAccommodationBooking={handleAddAccommodationBooking}
                    onUpdateAccommodationBooking={handleUpdateAccommodationBooking}
                    onDeleteAccommodationBooking={handleDeleteAccommodationBooking}
                />;
      case 'staff':
        return currentUserRole === Role.Admin ? <StaffManagement staff={staff} shifts={shifts} tasks={tasks} absences={absences} salaryAdvances={salaryAdvances} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onAddAbsence={handleAddAbsence} onUpdateAbsence={handleUpdateAbsence} onDeleteAbsence={handleDeleteAbsence} onAddSalaryAdvance={handleAddSalaryAdvance} onUpdateSalaryAdvance={handleUpdateSalaryAdvance} onDeleteSalaryAdvance={handleDeleteSalaryAdvance} /> : null;
      case 'utilities':
          return <UtilitiesManagement 
                    records={utilityRecords} 
                    onAddRecord={handleAddUtilityRecord} 
                    onUpdateRecord={handleUpdateUtilityRecord} 
                    onDeleteRecord={handleDeleteUtilityRecord}
                    utilityCategories={utilityCategories}
                    onAddCategory={handleAddUtilityCategory}
                    onDeleteCategory={handleDeleteUtilityCategory}
                    currentUserRole={currentUserRole}
                 />;
      case 'activities':
          return <ActivitiesManagement 
                    activities={activities} 
                    speedBoatTrips={speedBoatTrips} 
                    taxiBoatOptions={taxiBoatOptions}
                    extras={extras}
                    staff={staff} 
                    bookings={bookings} 
                    externalSales={externalSales}
                    platformPayments={platformPayments}
                    utilityRecords={utilityRecords}
                    salaryAdvances={salaryAdvances}
                    walkInGuests={walkInGuests}
                    accommodationBookings={accommodationBookings}
                    rooms={rooms}
                    paymentTypes={paymentTypes}
                    onBookActivity={handleBookActivity} 
                    onBookSpeedBoat={handleBookSpeedBoatTrip} 
                    onBookPrivateTour={handleBookPrivateTour}
                    onBookStandaloneExtra={handleBookStandaloneExtra}
                    onBookTaxiBoat={handleBookTaxiBoat}
                    onUpdateBooking={handleUpdateBooking}
                    onDeleteBooking={handleDeleteBooking}
                    onAddExternalSale={handleAddExternalSale}
                    onUpdateExternalSale={handleUpdateExternalSale}
                    onDeleteExternalSale={handleDeleteExternalSale}
                    onAddPlatformPayment={handleAddPlatformPayment}
                    onUpdatePlatformPayment={handleUpdatePlatformPayment}
                    onDeletePlatformPayment={handleDeletePlatformPayment}
                    onAddSpeedBoatTrip={handleAddSpeedBoatTrip}
                    onUpdateSpeedBoatTrip={handleUpdateSpeedBoatTrip}
                    onDeleteSpeedBoatTrip={handleDeleteSpeedBoatTrip}
                    onAddActivity={handleAddActivity}
                    onUpdateActivity={handleUpdateActivity}
                    onDeleteActivity={handleDeleteActivity}
                    onAddTaxiBoatOption={handleAddTaxiBoatOption}
                    onUpdateTaxiBoatOption={handleUpdateTaxiBoatOption}
                    onDeleteTaxiBoatOption={handleDeleteTaxiBoatOption}
                    onAddExtra={handleAddExtra}
                    onUpdateExtra={handleUpdateExtra}
                    onDeleteExtra={handleDeleteExtra}
                    onAddPaymentType={handleAddPaymentType}
                    onUpdatePaymentType={handleUpdatePaymentType}
                    onDeletePaymentType={handleDeletePaymentType}
                    currentUserRole={currentUserRole}
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
                 <div className="flex items-center space-x-2">
                    <label htmlFor="role-switcher" className="text-sm font-medium text-slate-600">Viewing as:</label>
                    <select
                        id="role-switcher"
                        value={currentUserRole}
                        onChange={(e) => setCurrentUserRole(e.target.value as Role)}
                        className="rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1"
                    >
                        <option value={Role.Admin}>Admin</option>
                        <option value={Role.Staff}>Staff</option>
                    </select>
                 </div>
            </div>
            <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto -mb-px" aria-label="Tabs">
                {visibleTabs.map(tab => (
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