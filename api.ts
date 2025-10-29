import { supabase } from './src/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { 
    Activity, 
    Booking, 
    Room, 
    Bed, 
    Staff, 
    Shift, 
    Task, 
    Absence, 
    SalaryAdvance, 
    UtilityRecord, 
    WalkInGuest, 
    AccommodationBooking,
    ExternalSale,
    PlatformPayment,
    TaxiBoatOption,
    SpeedBoatTrip,
    Extra,
    PaymentType,
    Profile,
    Role
} from './types';

// Generic error handler
const handleSupabaseError = (error: any, context: string) => {
    if (error) {
        console.error(`Error in ${context}:`, error.message);
        throw new Error(`Supabase error in ${context}: ${error.message}`);
    }
};

// --- Auth & Profiles ---
export const getProfileForUser = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "exact one row not found"
        console.error('Error fetching profile:', error.message);
        throw new Error(`Supabase error in getProfileForUser: ${error.message}`);
    }
    return data;
}

// This function should be called when a new user logs in for the first time and has no profile.
// It invokes a Supabase Edge Function to create the profile server-side.
export const createProfileForUser = async (user: User): Promise<Profile> => {
    // We assume an Edge Function named 'create-profile' exists.
    const { data, error } = await supabase.functions.invoke('create-profile', {
        body: { user },
    });
    
    if (error) {
        handleSupabaseError(error, 'createProfileForUser (invoking edge function)');
    }

    if (!data) {
        throw new Error('Edge function did not return a profile.');
    }

    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    handleSupabaseError(error, 'signOut');
};


// --- Storage Helpers ---

/**
 * Uploads an image or file to a specified Supabase Storage bucket.
 * @param bucket - The name of the storage bucket.
 * @param file - The file object to upload.
 * @param path - The path and filename for the file in the bucket.
 * @returns The public URL of the uploaded file.
 */
export const uploadImage = async (bucket: string, file: File, path: string): Promise<string> => {
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite file if it exists
    });
    handleSupabaseError(uploadError, `uploadImage (uploading to ${bucket})`);

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    if (!data || !data.publicUrl) {
        throw new Error('Could not get public URL for uploaded image.');
    }
    
    return data.publicUrl;
};

// --- Activities ---

export const fetchAllActivities = async (): Promise<Activity[]> => {
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    handleSupabaseError(error, 'fetchAllActivities');
    return data || [];
};
export const createActivity = async (activityData: Omit<Activity, 'id'>): Promise<Activity> => {
    const { data, error } = await supabase.from('activities').insert(activityData).select().single();
    handleSupabaseError(error, 'createActivity');
    return data;
};
export const updateActivity = async (id: string, activityData: Partial<Activity>): Promise<Activity> => {
    const { data, error } = await supabase.from('activities').update(activityData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateActivity');
    return data;
};
export const removeActivity = async (id: string): Promise<void> => {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    handleSupabaseError(error, 'removeActivity');
};

// --- Bookings ---

export const fetchAllBookings = async (): Promise<Booking[]> => {
    const { data, error } = await supabase.from('bookings').select('*').order('bookingDate', { ascending: false });
    handleSupabaseError(error, 'fetchAllBookings');
    return data || [];
};
export const createBooking = async (payload: Omit<Booking, 'id'>): Promise<Booking> => {
    const { data, error } = await supabase.from('bookings').insert(payload).select().single();
    handleSupabaseError(error, 'createBooking');
    return data;
};
export const updateBooking = async (id: string, payload: Partial<Booking>): Promise<Booking> => {
    const { data, error } = await supabase.from('bookings').update(payload).eq('id', id).select().single();
    handleSupabaseError(error, 'updateBooking');
    return data;
};
export const removeBooking = async (id: string): Promise<void> => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    handleSupabaseError(error, 'removeBooking');
};

// --- Rooms and Beds ---

export const fetchAllRoomsWithBeds = async (): Promise<Room[]> => {
    const { data: rooms, error: roomsError } = await supabase.from('rooms').select('*').order('name', { ascending: true });
    handleSupabaseError(roomsError, 'fetchAllRoomsWithBeds (rooms)');
    if (!rooms) return [];

    const roomIds = rooms.map(r => r.id);
    const { data: beds, error: bedsError } = await supabase.from('beds').select('*').in('room_id', roomIds);
    handleSupabaseError(bedsError, 'fetchAllRoomsWithBeds (beds)');

    const bedsByRoomId = (beds || []).reduce((acc, bed) => {
        const roomId = (bed as any).room_id;
        if (!acc[roomId]) acc[roomId] = [];
        acc[roomId].push(bed);
        return acc;
    }, {} as Record<string, Bed[]>);

    return rooms.map(room => ({
        ...room,
        beds: bedsByRoomId[room.id] || []
    }));
};
export const createRoom = async (roomData: Omit<Room, 'id' | 'beds'>): Promise<Room> => {
    const { data, error } = await supabase.from('rooms').insert(roomData).select().single();
    handleSupabaseError(error, 'createRoom');
    return { ...data, beds: [] };
};
export const updateRoom = async (id: string, roomData: Partial<Omit<Room, 'beds'>>): Promise<Room> => {
    const { data, error } = await supabase.from('rooms').update(roomData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateRoom');
    return data;
};
export const removeRoom = async (id: string): Promise<void> => {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    handleSupabaseError(error, 'removeRoom');
};
export const updateBed = async (id: string, bedData: Partial<Bed>): Promise<Bed> => {
    const { data, error } = await supabase.from('beds').update(bedData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateBed');
    return data;
};

// --- Staff & HR ---

export const fetchAllStaff = async (): Promise<Staff[]> => {
    const { data, error } = await supabase.from('staff').select('*').order('name', { ascending: true });
    handleSupabaseError(error, 'fetchAllStaff');
    return data || [];
};
export const createStaff = async (staffData: Omit<Staff, 'id'>): Promise<Staff> => {
    const { data, error } = await supabase.from('staff').insert(staffData).select().single();
    handleSupabaseError(error, 'createStaff');
    return data;
};
export const updateStaff = async (id: string, staffData: Partial<Staff>): Promise<Staff> => {
    const { data, error } = await supabase.from('staff').update(staffData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateStaff');
    return data;
};
export const removeStaff = async (id: string): Promise<void> => {
    const { error } = await supabase.from('staff').delete().eq('id', id);
    handleSupabaseError(error, 'removeStaff');
};

// --- Shifts ---

export const fetchAllShifts = async (): Promise<Shift[]> => {
    const { data, error } = await supabase.from('shifts').select('*').order('date', { ascending: false });
    handleSupabaseError(error, 'fetchAllShifts');
    return data || [];
};

// --- Tasks ---

export const fetchAllTasks = async (): Promise<Task[]> => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    handleSupabaseError(error, 'fetchAllTasks');
    return data || [];
};
export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const { data, error } = await supabase.from('tasks').insert(taskData).select().single();
    handleSupabaseError(error, 'createTask');
    return data;
};
export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase.from('tasks').update(taskData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateTask');
    return data;
};
export const removeTask = async (id: string): Promise<void> => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    handleSupabaseError(error, 'removeTask');
};

// --- Absences ---

export const fetchAllAbsences = async (): Promise<Absence[]> => {
    const { data, error } = await supabase.from('absences').select('*').order('date', { ascending: false });
    handleSupabaseError(error, 'fetchAllAbsences');
    return data || [];
};
export const createAbsence = async (absenceData: Omit<Absence, 'id'>): Promise<Absence> => {
    const { data, error } = await supabase.from('absences').insert(absenceData).select().single();
    handleSupabaseError(error, 'createAbsence');
    return data;
};
export const updateAbsence = async (id: string, absenceData: Partial<Absence>): Promise<Absence> => {
    const { data, error } = await supabase.from('absences').update(absenceData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateAbsence');
    return data;
};
export const removeAbsence = async (id: string): Promise<void> => {
    const { error } = await supabase.from('absences').delete().eq('id', id);
    handleSupabaseError(error, 'removeAbsence');
};

// --- Salary Advances ---

export const fetchAllSalaryAdvances = async (): Promise<SalaryAdvance[]> => {
    const { data, error } = await supabase.from('salary_advances').select('*').order('date', { ascending: false });
    handleSupabaseError(error, 'fetchAllSalaryAdvances');
    return data || [];
};
export const createSalaryAdvance = async (advanceData: Omit<SalaryAdvance, 'id'>): Promise<SalaryAdvance> => {
    const { data, error } = await supabase.from('salary_advances').insert(advanceData).select().single();
    handleSupabaseError(error, 'createSalaryAdvance');
    return data;
};
export const updateSalaryAdvance = async (id: string, advanceData: Partial<SalaryAdvance>): Promise<SalaryAdvance> => {
    const { data, error } = await supabase.from('salary_advances').update(advanceData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateSalaryAdvance');
    return data;
};
export const removeSalaryAdvance = async (id: string): Promise<void> => {
    const { error } = await supabase.from('salary_advances').delete().eq('id', id);
    handleSupabaseError(error, 'removeSalaryAdvance');
};

// --- Utilities ---

export const fetchAllUtilityRecords = async (): Promise<UtilityRecord[]> => {
    const { data, error } = await supabase.from('utility_records').select('*').order('date', { ascending: false });
    handleSupabaseError(error, 'fetchAllUtilityRecords');
    return data || [];
};
export const createUtilityRecord = async (recordData: Omit<UtilityRecord, 'id'>): Promise<UtilityRecord> => {
    const { data, error } = await supabase.from('utility_records').insert(recordData).select().single();
    handleSupabaseError(error, 'createUtilityRecord');
    return data;
};
export const updateUtilityRecord = async (id: string, recordData: Partial<UtilityRecord>): Promise<UtilityRecord> => {
    const { data, error } = await supabase.from('utility_records').update(recordData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateUtilityRecord');
    return data;
};
export const removeUtilityRecord = async (id: string): Promise<void> => {
    const { error } = await supabase.from('utility_records').delete().eq('id', id);
    handleSupabaseError(error, 'removeUtilityRecord');
};

// --- Utility Categories ---

export const fetchAllUtilityCategories = async (): Promise<{name: string}[]> => {
    const { data, error } = await supabase.from('utility_categories').select('name').order('name');
    handleSupabaseError(error, 'fetchAllUtilityCategories');
    return data || [];
};
export const createUtilityCategory = async (categoryName: string): Promise<{name: string}> => {
    const { data, error } = await supabase.from('utility_categories').insert({ name: categoryName }).select().single();
    handleSupabaseError(error, 'createUtilityCategory');
    return data;
};
export const removeUtilityCategory = async (categoryName: string): Promise<void> => {
    const { error } = await supabase.from('utility_categories').delete().eq('name', categoryName);
    handleSupabaseError(error, 'removeUtilityCategory');
};

// --- Direct Accommodation ---

export const fetchAllWalkInGuests = async (): Promise<WalkInGuest[]> => {
    const { data, error } = await supabase.from('walk_in_guests').select('*').order('checkInDate', { ascending: false });
    handleSupabaseError(error, 'fetchAllWalkInGuests');
    return data || [];
};
export const createWalkInGuest = async (guestData: Omit<WalkInGuest, 'id'>): Promise<WalkInGuest> => {
    const { data, error } = await supabase.from('walk_in_guests').insert(guestData).select().single();
    handleSupabaseError(error, 'createWalkInGuest');
    return data;
};
export const updateWalkInGuest = async (id: string, guestData: Partial<WalkInGuest>): Promise<WalkInGuest> => {
    const { data, error } = await supabase.from('walk_in_guests').update(guestData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateWalkInGuest');
    return data;
};
export const removeWalkInGuest = async (id: string): Promise<void> => {
    const { error } = await supabase.from('walk_in_guests').delete().eq('id', id);
    handleSupabaseError(error, 'removeWalkInGuest');
};

// --- Accommodation Bookings ---

export const fetchAllAccommodationBookings = async (): Promise<AccommodationBooking[]> => {
    const { data, error } = await supabase.from('accommodation_bookings').select('*').order('checkInDate', { ascending: false });
    handleSupabaseError(error, 'fetchAllAccommodationBookings');
    return data || [];
};
export const createAccommodationBooking = async (bookingData: Omit<AccommodationBooking, 'id'>): Promise<AccommodationBooking> => {
    const { data, error } = await supabase.from('accommodation_bookings').insert(bookingData).select().single();
    handleSupabaseError(error, 'createAccommodationBooking');
    return data;
};
export const updateAccommodationBooking = async (id: string, bookingData: Partial<AccommodationBooking>): Promise<AccommodationBooking> => {
    const { data, error } = await supabase.from('accommodation_bookings').update(bookingData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateAccommodationBooking');
    return data;
};
export const removeAccommodationBooking = async (id: string): Promise<void> => {
    const { error } = await supabase.from('accommodation_bookings').delete().eq('id', id);
    handleSupabaseError(error, 'removeAccommodationBooking');
};

// --- Financial Records ---

export const fetchAllExternalSales = async (): Promise<ExternalSale[]> => {
    const { data, error } = await supabase.from('external_sales').select('*').order('date', { ascending: false });
    handleSupabaseError(error, 'fetchAllExternalSales');
    return data || [];
};
export const createExternalSale = async (saleData: Omit<ExternalSale, 'id'>): Promise<ExternalSale> => {
    const { data, error } = await supabase.from('external_sales').insert(saleData).select().single();
    handleSupabaseError(error, 'createExternalSale');
    return data;
};
export const updateExternalSale = async (id: string, saleData: Partial<ExternalSale>): Promise<ExternalSale> => {
    const { data, error } = await supabase.from('external_sales').update(saleData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateExternalSale');
    return data;
};
export const removeExternalSale = async (id: string): Promise<void> => {
    const { error } = await supabase.from('external_sales').delete().eq('id', id);
    handleSupabaseError(error, 'removeExternalSale');
};

// --- Platform Payments ---

export const fetchAllPlatformPayments = async (): Promise<PlatformPayment[]> => {
    const { data, error } = await supabase.from('platform_payments').select('*').order('date', { ascending: false });
    handleSupabaseError(error, 'fetchAllPlatformPayments');
    return data || [];
};
export const createPlatformPayment = async (paymentData: Omit<PlatformPayment, 'id'>): Promise<PlatformPayment> => {
    const { data, error } = await supabase.from('platform_payments').insert(paymentData).select().single();
    handleSupabaseError(error, 'createPlatformPayment');
    return data;
};
export const updatePlatformPayment = async (id: string, paymentData: Partial<PlatformPayment>): Promise<PlatformPayment> => {
    const { data, error } = await supabase.from('platform_payments').update(paymentData).eq('id', id).select().single();
    handleSupabaseError(error, 'updatePlatformPayment');
    return data;
};
export const removePlatformPayment = async (id: string): Promise<void> => {
    const { error } = await supabase.from('platform_payments').delete().eq('id', id);
    handleSupabaseError(error, 'removePlatformPayment');
};

// --- Pricing Items (Speedboat, Taxi, Extras, Payment Types) ---

export const fetchAllSpeedBoatTrips = async (): Promise<SpeedBoatTrip[]> => {
    const { data, error } = await supabase.from('speedboat_trips').select('*').order('route').order('company');
    handleSupabaseError(error, 'fetchAllSpeedBoatTrips');
    return data || [];
};
export const createSpeedBoatTrip = async (tripData: Omit<SpeedBoatTrip, 'id'>): Promise<SpeedBoatTrip> => {
    const { data, error } = await supabase.from('speedboat_trips').insert(tripData).select().single();
    handleSupabaseError(error, 'createSpeedBoatTrip');
    return data;
};
export const updateSpeedBoatTrip = async (id: string, tripData: Partial<SpeedBoatTrip>): Promise<SpeedBoatTrip> => {
    const { data, error } = await supabase.from('speedboat_trips').update(tripData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateSpeedBoatTrip');
    return data;
};
export const removeSpeedBoatTrip = async (id: string): Promise<void> => {
    const { error } = await supabase.from('speedboat_trips').delete().eq('id', id);
    handleSupabaseError(error, 'removeSpeedBoatTrip');
};

export const fetchAllTaxiBoatOptions = async (): Promise<TaxiBoatOption[]> => {
    const { data, error } = await supabase.from('taxi_boat_options').select('*').order('price');
    handleSupabaseError(error, 'fetchAllTaxiBoatOptions');
    return data || [];
};
export const createTaxiBoatOption = async (optionData: Omit<TaxiBoatOption, 'id'>): Promise<TaxiBoatOption> => {
    const { data, error } = await supabase.from('taxi_boat_options').insert(optionData).select().single();
    handleSupabaseError(error, 'createTaxiBoatOption');
    return data;
};
export const updateTaxiBoatOption = async (id: string, optionData: Partial<TaxiBoatOption>): Promise<TaxiBoatOption> => {
    const { data, error } = await supabase.from('taxi_boat_options').update(optionData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateTaxiBoatOption');
    return data;
};
export const removeTaxiBoatOption = async (id: string): Promise<void> => {
    const { error } = await supabase.from('taxi_boat_options').delete().eq('id', id);
    handleSupabaseError(error, 'removeTaxiBoatOption');
};

export const fetchAllExtras = async (): Promise<Extra[]> => {
    const { data, error } = await supabase.from('extras').select('*').order('name');
    handleSupabaseError(error, 'fetchAllExtras');
    return data || [];
};
export const createExtra = async (extraData: Omit<Extra, 'id'>): Promise<Extra> => {
    const { data, error } = await supabase.from('extras').insert(extraData).select().single();
    handleSupabaseError(error, 'createExtra');
    return data;
};
export const updateExtra = async (id: string, extraData: Partial<Extra>): Promise<Extra> => {
    const { data, error } = await supabase.from('extras').update(extraData).eq('id', id).select().single();
    handleSupabaseError(error, 'updateExtra');
    return data;
};
export const removeExtra = async (id: string): Promise<void> => {
    const { error } = await supabase.from('extras').delete().eq('id', id);
    handleSupabaseError(error, 'removeExtra');
};

export const fetchAllPaymentTypes = async (): Promise<PaymentType[]> => {
    const { data, error } = await supabase.from('payment_types').select('*').order('name');
    handleSupabaseError(error, 'fetchAllPaymentTypes');
    return data || [];
};
export const createPaymentType = async (paymentTypeData: Omit<PaymentType, 'id'>): Promise<PaymentType> => {
    const { data, error } = await supabase.from('payment_types').insert(paymentTypeData).select().single();
    handleSupabaseError(error, 'createPaymentType');
    return data;
};
export const updatePaymentType = async (id: string, paymentTypeData: Partial<PaymentType>): Promise<PaymentType> => {
    const { data, error } = await supabase.from('payment_types').update(paymentTypeData).eq('id', id).select().single();
    handleSupabaseError(error, 'updatePaymentType');
    return data;
};
export const removePaymentType = async (id: string): Promise<void> => {
    const { error } = await supabase.from('payment_types').delete().eq('id', id);
    handleSupabaseError(error, 'removePaymentType');
};