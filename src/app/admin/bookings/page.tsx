'use client';

import { useState, useEffect } from 'react';
import { useRequireRole } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { Booking } from '@/types';

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useRequireRole(['ADMIN']);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.subject.toLowerCase().includes(searchLower) ||
      booking.student?.name.toLowerCase().includes(searchLower) ||
      booking.tutor?.name.toLowerCase().includes(searchLower)
    );
  });

  const confirmedBookings = filteredBookings.filter(b => b.status === 'CONFIRMED');
  const completedBookings = filteredBookings.filter(b => b.status === 'COMPLETED');
  const cancelledBookings = filteredBookings.filter(b => b.status === 'CANCELLED');
  const pendingBookings = filteredBookings.filter(b => b.status === 'PENDING');

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{booking.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  Student: {booking.student?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tutor: {booking.tutor?.name}
                </p>
              </div>
              <Badge
                variant={
                  booking.status === 'COMPLETED' ? 'default' :
                  booking.status === 'CONFIRMED' ? 'secondary' :
                  'secondary'
                }
              >
                {booking.status}
              </Badge>
            </div>
            
            <div className="space-y-1 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(booking.date), 'EEEE, MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{booking.startTime} - {booking.endTime}</span>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-3 p-2 bg-muted rounded text-sm">
                <span className="font-medium">Notes:</span> {booking.notes}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
              </span>
              <span className="font-semibold">${booking.totalAmount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Bookings</h1>
          <p className="text-muted-foreground">View and manage all tutoring sessions</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by subject, student, or tutor..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({filteredBookings.length})</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {filteredBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {filteredBookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No bookings found</p>
                )}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-4 mt-4">
                {confirmedBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {confirmedBookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No confirmed bookings</p>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4 mt-4">
                {pendingBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {pendingBookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No pending bookings</p>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-4">
                {completedBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {completedBookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No completed bookings</p>
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="space-y-4 mt-4">
                {cancelledBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {cancelledBookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No cancelled bookings</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
