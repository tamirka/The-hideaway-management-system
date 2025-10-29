import React, { useState, useEffect, useMemo } from 'react';
import { StaffManagement } from './components/StaffManagement';
import UtilitiesManagement from './components/UtilitiesManagement';
import RoomManagement from './components/RoomManagement';
import { ActivitiesManagement } from './components/activities/ActivitiesManagement';
import WalkInManagement from './components/WalkInManagement';
import type { Staff, Shift, Task, UtilityRecord, Room, Absence, Activity, SpeedBoatTrip, Booking, Extra, SalaryAdvance, TaxiBoatOption, ExternalSale, PlatformPayment, WalkInGuest, AccommodationBooking, PaymentType } from './types';
import { Role } from './types';
import * as api from './api';
import { useAuth } from './components/Auth';
import LoginPage from './components/LoginPage';

type View = 'rooms' | 'staff' | 'utilities' | 'activities' | 'booking';

const App: React.FC = () => {
  const { session, user, loading: authLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  
  const [currentView, setCurrentView] = useState<View>('activities');
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);

  // State Management
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [utilityRecords, setUtilityRecords] = useState<UtilityRecord[]>([]);
  const [utilityCategories, setUtilityCategories] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [speedBoatTrips, setSpeedBoatTrips] = useState<SpeedBoatTrip[]>([]);
  const [taxiBoatOptions, setTaxiBoatOptions] = useState<TaxiBoatOption[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [externalSales, setExternalSales] = useState<ExternalSale[]>([]);
  const [platformPayments, setPlatformPayments] = useState<PlatformPayment[]>([]);
  const [walkInGuests, setWalkInGuests] = useState<WalkInGuest[]>([]);
  const [accommodationBookings, setAccommodationBookings] = useState<AccommodationBooking[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

   useEffect(() => {
    if (user) {
      setProfileLoading(true);
      api.getProfileForUser(user.id)
        .then(async (profile) => {
          if (profile) {
            setCurrentUserRole(profile.role);
          } else {
            // No profile exists, likely a new user. Let's create one via an Edge Function.
            console.log("No profile found for user, creating one.");
            try {
              const newProfile = await api.createProfileForUser(user);
              setCurrentUserRole(newProfile.role);
            } catch (creationError) {
              console.error("Failed to create profile for new user:", creationError);
              // Sign out if profile creation fails to prevent being in a broken state.
              api.signOut();
            }
          }
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
          api.signOut();
        })
        .finally(() => {
          setProfileLoading(false);
        });
    } else if (!authLoading) {
      setProfileLoading(false);
      setCurrentUserRole(null);
    }
  }, [user, authLoading]);

  useEffect(() => {
    const loadData = async () => {
        try {
            const [
                staffData, shiftsData, tasksData, utilityRecordsData, utilityCategoriesData,
                roomsData, absencesData, salaryAdvancesData, activitiesData, speedBoatTripsData,
                taxiBoatOptionsData, extrasData, bookingsData, externalSalesData,
                platformPaymentsData, walkInGuestsData, accommodationBookingsData, paymentTypesData
            ] = await Promise.all([
                api.fetchAllStaff(), api.fetchAllShifts(), api.fetchAllTasks(), api.fetchAllUtilityRecords(),
                api.fetchAllUtilityCategories(), api.fetchAllRoomsWithBeds(), api.fetchAllAbsences(),
                api.fetchAllSalaryAdvances(), api.fetchAllActivities(), api.fetchAllSpeedBoatTrips(),
                api.fetchAllTaxiBoatOptions(), api.fetchAllExtras(), api.fetchAllBookings(),
                api.fetchAllExternalSales(), api.fetchAllPlatformPayments(), api.fetchAllWalkInGuests(),
                api.fetchAllAccommodationBookings(), api.fetchAllPaymentTypes()
            ]);

            setStaff(staffData);
            setShifts(shiftsData);
            setTasks(tasksData);
            setUtilityRecords(utilityRecordsData);
            setUtilityCategories(utilityCategoriesData.map(c => c.name));
            setRooms(roomsData);
            setAbsences(absencesData);
            setSalaryAdvances(salaryAdvancesData);
            setActivities(activitiesData);
            setSpeedBoatTrips(speedBoatTripsData);
            setTaxiBoatOptions(taxiBoatOptionsData);
            setExtras(extrasData);
            setBookings(bookingsData);
            setExternalSales(externalSalesData);
            setPlatformPayments(platformPaymentsData);
            setWalkInGuests(walkInGuestsData);
            setAccommodationBookings(accommodationBookingsData);
            setPaymentTypes(paymentTypesData);
        } catch (error) {
            console.error("Failed to load initial data:", error);
            alert("Could not load data from the database. Please check your connection and refresh.");
        }
    };
    if (currentUserRole) {
      loadData();
    }
  }, [currentUserRole]);

  // --- Booking Handlers ---
  const createGenericBooking = async (bookingPayload: Omit<Booking, 'id'>, alertMessage: string) => {
    try {
        const newBooking = await api.createBooking(bookingPayload);
        setBookings(prev => [newBooking, ...prev]);
        alert(alertMessage);
    } catch (error) {
        console.error("Failed to create booking:", error);
        alert("Error: Could not save booking.");
    }
  };

  const handleBookActivity = async (activityId: string, staffId: string, numberOfPeople: number, discount: number, selectedExtras: Omit<Extra, 'id' | 'commission'>[], paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    const totalEmployeeCommission = (employeeCommission || 0) * numberOfPeople;
    let itemCost: number | undefined;
    if (activity.type === 'Internal') {
        itemCost = (fuelCost || 0) + (captainCost || 0);
    } else {
        itemCost = (activity.companyCost || 0) * numberOfPeople;
    }
    
    const newBooking: Omit<Booking, 'id'> = {
        itemId: activityId, itemType: 'activity', itemName: activity.name, staffId, bookingDate,
        customerPrice: activity.price * numberOfPeople, numberOfPeople, discount, extras: selectedExtras,
        extrasTotal, paymentMethod, receiptImage, fuelCost, captainCost, itemCost,
        employeeCommission: totalEmployeeCommission,
    };
    const finalPrice = newBooking.customerPrice + (newBooking.extrasTotal || 0) - (newBooking.discount || 0);
    await createGenericBooking(newBooking, `Booking confirmed for ${activity.name}!\nFinal Price: ${finalPrice} THB`);
  };

  const handleBookSpeedBoatTrip = async (tripId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => {
    const trip = speedBoatTrips.find(t => t.id === tripId);
    if (!trip) return;

    const newBooking: Omit<Booking, 'id'> = {
        itemId: tripId, itemType: 'speedboat', itemName: `${trip.route} (${trip.company})`, staffId, bookingDate,
        customerPrice: trip.price * numberOfPeople, numberOfPeople, paymentMethod, receiptImage,
        itemCost: trip.cost * numberOfPeople,
        employeeCommission: (employeeCommission || 0) * numberOfPeople,
    };
    const finalPrice = newBooking.customerPrice;
    await createGenericBooking(newBooking, `Booking confirmed for ${trip.route}!\nFinal Price: ${finalPrice} THB`);
  };

  const handleBookPrivateTour = async (tourType: 'Half Day' | 'Full Day', price: number, numberOfPeople: number, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number, hostelCommission?: number) => {
    const newBooking: Omit<Booking, 'id'> = {
        itemId: 'private_tour', itemType: 'private_tour', itemName: `Private Tour - ${tourType}`, staffId, bookingDate,
        customerPrice: price, numberOfPeople, paymentMethod, receiptImage, fuelCost, captainCost,
        itemCost: (fuelCost || 0) + (captainCost || 0), employeeCommission, hostelCommission,
    };
    await createGenericBooking(newBooking, `Private Tour booking confirmed!\nPrice: ${price} THB`);
  };

  const handleBookStandaloneExtra = async (extra: Extra, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, quantity: number = 1, employeeCommission?: number) => {
    let itemName = extra.name;
    if (quantity > 1) itemName = `${extra.name} (x${quantity})`;

    const newBooking: Omit<Booking, 'id'> = {
        itemId: extra.id, itemType: 'extra', itemName: itemName, staffId, bookingDate,
        customerPrice: extra.price * quantity, numberOfPeople: quantity, paymentMethod, receiptImage,
        employeeCommission: employeeCommission ? employeeCommission * quantity : undefined,
    };
    await createGenericBooking(newBooking, `Sold ${itemName} for ${newBooking.customerPrice} THB.`);
  };

  const handleBookTaxiBoat = async (taxiOptionId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => {
    const taxiOption = taxiBoatOptions.find(t => t.id === taxiOptionId);
    if (!taxiOption) return;

    const newBooking: Omit<Booking, 'id'> = {
        itemId: taxiOption.id, itemType: 'taxi_boat', itemName: `Taxi Boat - ${taxiOption.name}`, staffId, bookingDate,
        customerPrice: taxiOption.price * numberOfPeople, numberOfPeople, paymentMethod, receiptImage,
        employeeCommission: (employeeCommission || 0) * numberOfPeople,
    };
    await createGenericBooking(newBooking, `Taxi Boat (${taxiOption.name}) booked for ${numberOfPeople} person(s).`);
  };
  
  const handleUpdateBooking = async (updatedBooking: Booking) => {
    try {
        const returnedBooking = await api.updateBooking(updatedBooking.id, updatedBooking);
        setBookings(prev => prev.map(b => b.id === returnedBooking.id ? returnedBooking : b));
    } catch (error) { alert("Failed to update booking."); }
  };
  
  const handleDeleteBooking = async (bookingId: string) => {
    try {
        await api.removeBooking(bookingId);
        setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (error) { alert("Failed to delete booking."); }
  };

  // --- Generic CRUD Handlers ---
  const createHandler = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>, createFn: (item: Omit<T, 'id'>) => Promise<T>) => async (item: Omit<T, 'id'>) => {
    try {
        const newItem = await createFn(item);
        setter(prev => [newItem, ...prev]);
    } catch (error) { alert(`Failed to create item.`); }
  };
  
  const updateHandler = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>, updateFn: (id: string, item: Partial<T>) => Promise<T>) => async (item: T) => {
    try {
        const updatedItem = await updateFn(item.id, item);
        setter(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    } catch (error) { alert(`Failed to update item.`); }
  };
  
  const deleteHandler = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>, deleteFn: (id: string) => Promise<void>) => async (id: string) => {
    try {
        await deleteFn(id);
        setter(prev => prev.filter(i => i.id !== id));
    } catch (error) { alert(`Failed to delete item.`); }
  };
  
  // --- Specific CRUD Implementations ---
  const handleAddStaff = createHandler(setStaff, api.createStaff);
  const handleUpdateStaff = updateHandler(setStaff, api.updateStaff);
  const handleDeleteStaff = deleteHandler(setStaff, api.removeStaff);

  const handleAddTask = createHandler(setTasks, api.createTask);
  const handleUpdateTask = updateHandler(setTasks, api.updateTask);
  const handleDeleteTask = deleteHandler(setTasks, api.removeTask);

  const handleAddUtilityRecord = createHandler(setUtilityRecords, api.createUtilityRecord);
  const handleUpdateUtilityRecord = updateHandler(setUtilityRecords, api.updateUtilityRecord);
  const handleDeleteUtilityRecord = deleteHandler(setUtilityRecords, api.removeUtilityRecord);
  
  const handleAddUtilityCategory = async (newCategory: string) => {
    if (newCategory && !utilityCategories.map(c => c.toLowerCase()).includes(newCategory.toLowerCase())) {
        try {
            await api.createUtilityCategory(newCategory);
            const freshCategories = await api.fetchAllUtilityCategories();
            setUtilityCategories(freshCategories.map(c => c.name));
        } catch (error) { alert("Failed to add category."); }
    }
  };
  const handleDeleteUtilityCategory = async (categoryToDelete: string) => {
    try {
        await api.removeUtilityCategory(categoryToDelete);
        const freshCategories = await api.fetchAllUtilityCategories();
        setUtilityCategories(freshCategories.map(c => c.name));
    } catch(error) { alert("Failed to delete category."); }
  };

  const handleAddRoom = createHandler(setRooms, api.createRoom);
  const handleUpdateRoom = async (updatedRoom: Room) => {
    try {
        const roomUpdatePayload = { name: updatedRoom.name, condition: updatedRoom.condition, maintenanceNotes: updatedRoom.maintenanceNotes };
        await api.updateRoom(updatedRoom.id, roomUpdatePayload);
        
        for (const bed of updatedRoom.beds) {
            await api.updateBed(bed.id, { status: bed.status, number: bed.number });
        }

        const freshRooms = await api.fetchAllRoomsWithBeds();
        setRooms(freshRooms);
    } catch (error) { alert("Failed to update room and its beds."); }
  };
  const handleDeleteRoom = deleteHandler(setRooms, api.removeRoom);
  
  const handleAddAbsence = createHandler(setAbsences, api.createAbsence);
  const handleUpdateAbsence = updateHandler(setAbsences, api.updateAbsence);
  const handleDeleteAbsence = deleteHandler(setAbsences, api.removeAbsence);

  const handleAddSalaryAdvance = createHandler(setSalaryAdvances, api.createSalaryAdvance);
  const handleUpdateSalaryAdvance = updateHandler(setSalaryAdvances, api.updateSalaryAdvance);
  const handleDeleteSalaryAdvance = deleteHandler(setSalaryAdvances, api.removeSalaryAdvance);
  
  const handleAddExternalSale = createHandler(setExternalSales, api.createExternalSale);
  const handleUpdateExternalSale = updateHandler(setExternalSales, api.updateExternalSale);
  const handleDeleteExternalSale = deleteHandler(setExternalSales, api.removeExternalSale);
  
  const handleAddPlatformPayment = createHandler(setPlatformPayments, api.createPlatformPayment);
  const handleUpdatePlatformPayment = updateHandler(setPlatformPayments, api.updatePlatformPayment);
  const handleDeletePlatformPayment = deleteHandler(setPlatformPayments, api.removePlatformPayment);

  const handleAddWalkInGuest = createHandler(setWalkInGuests, api.createWalkInGuest);
  const handleUpdateWalkInGuest = updateHandler(setWalkInGuests, api.updateWalkInGuest);
  const handleDeleteWalkInGuest = deleteHandler(setWalkInGuests, api.removeWalkInGuest);
  
  const handleAddAccommodationBooking = createHandler(setAccommodationBookings, api.createAccommodationBooking);
  const handleUpdateAccommodationBooking = updateHandler(setAccommodationBookings, api.updateAccommodationBooking);
  const handleDeleteAccommodationBooking = deleteHandler(setAccommodationBookings, api.removeAccommodationBooking);

  const handleAddSpeedBoatTrip = createHandler(setSpeedBoatTrips, api.createSpeedBoatTrip);
  const handleUpdateSpeedBoatTrip = updateHandler(setSpeedBoatTrips, api.updateSpeedBoatTrip);
  const handleDeleteSpeedBoatTrip = deleteHandler(setSpeedBoatTrips, api.removeSpeedBoatTrip);

  const handleAddActivity = createHandler(setActivities, api.createActivity);
  const handleUpdateActivity = updateHandler(setActivities, api.updateActivity);
  const handleDeleteActivity = deleteHandler(setActivities, api.removeActivity);

  const handleAddTaxiBoatOption = createHandler(setTaxiBoatOptions, api.createTaxiBoatOption);
  const handleUpdateTaxiBoatOption = updateHandler(setTaxiBoatOptions, api.updateTaxiBoatOption);
  const handleDeleteTaxiBoatOption = deleteHandler(setTaxiBoatOptions, api.removeTaxiBoatOption);
  
  const handleAddExtra = createHandler(setExtras, api.createExtra);
  const handleUpdateExtra = updateHandler(setExtras, api.updateExtra);
  const handleDeleteExtra = deleteHandler(setExtras, api.removeExtra);
  
  const handleAddPaymentType = createHandler(setPaymentTypes, api.createPaymentType);
  const handleUpdatePaymentType = updateHandler(setPaymentTypes, api.updatePaymentType);
  const handleDeletePaymentType = deleteHandler(setPaymentTypes, api.removePaymentType);

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
      if (!currentUserRole) return;
      const isCurrentViewVisible = visibleTabs.some(tab => tab.id === currentView);
      if (!isCurrentViewVisible) {
          setCurrentView(visibleTabs[0].id);
      }
  }, [currentUserRole, currentView, visibleTabs]);

  const handleLogout = async () => {
    await api.signOut();
  };

  const renderContent = () => {
    if (!currentUserRole) return null; // Should not happen if logic is correct, but a good safeguard.
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
        return currentUserRole === Role.Admin ? <StaffManagement staff={staff} shifts={shifts} tasks={tasks} absences={absences} salaryAdvances={salaryAdvances} bookings={bookings} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} onAddAbsence={handleAddAbsence} onUpdateAbsence={handleUpdateAbsence} onDeleteAbsence={handleDeleteAbsence} onAddSalaryAdvance={handleAddSalaryAdvance} onUpdateSalaryAdvance={handleUpdateSalaryAdvance} onDeleteSalaryAdvance={handleDeleteSalaryAdvance} /> : null;
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
                    absences={absences}
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

  if (authLoading || (session && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-xl font-semibold text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!session || !currentUserRole) {
    return <LoginPage />;
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                 <h1 className="text-xl font-bold text-slate-800">Facility Management Dashboard</h1>
                 <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600 hidden sm:inline">
                      {user?.email} (<b className="font-semibold">{currentUserRole}</b>)
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                    >
                      Logout
                    </button>
                    <div id="google_translate_element"></div>
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