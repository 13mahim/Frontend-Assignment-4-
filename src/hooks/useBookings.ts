import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Booking } from '@/types';
import { useToast } from '@/contexts/ToastContext';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getUserBookings();
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      showToast({
        title: 'Error',
        description: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: any) => {
    try {
      const newBooking = await api.createBooking(bookingData);
      setBookings(prev => [...prev, newBooking]);
      showToast({
        title: 'Success',
        description: 'Booking created successfully',
        type: 'success'
      });
      return newBooking;
    } catch (err: any) {
      showToast({
        title: 'Error',
        description: err.message,
        type: 'error'
      });
      throw err;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await api.cancelBooking(id);
      setBookings(prev => prev.map(b => 
        b.id === id ? { ...b, status: 'CANCELLED' as const } : b
      ));
      showToast({
        title: 'Success',
        description: 'Booking cancelled successfully',
        type: 'success'
      });
    } catch (err: any) {
      showToast({
        title: 'Error',
        description: err.message,
        type: 'error'
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking
  };
}
