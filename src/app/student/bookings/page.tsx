'use client';

import { useState } from 'react';
import { useRequireRole } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Loader2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import ReviewForm from '@/components/reviews/ReviewForm';

export default function StudentBookingsPage() {
  const { user, loading: authLoading } = useRequireRole(['STUDENT']);
  const { bookings, loading: bookingsLoading, cancelBooking, fetchBookings } = useBookings();
  const [reviewingBooking, setReviewingBooking] = useState<string | null>(null);

  const upcomingBookings = bookings
    .filter(b => b.status === 'CONFIRMED' && new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastBookings = bookings
    .filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pendingBookings = bookings
    .filter(b => b.status === 'PENDING')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  if (authLoading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage all your tutoring sessions</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{booking.subject}</h3>
                            <p className="text-muted-foreground">with {booking.tutor?.name}</p>
                          </div>
                          <Badge>{booking.status}</Badge>
                        </div>
                        
                        <div className="space-y-2 mt-4">
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
                          <div className="mt-4 p-3 bg-muted rounded-md">
                            <p className="text-sm"><span className="font-medium">Notes:</span> {booking.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 md:w-40">
                        <Link href={`/tutors/${booking.tutorId}`}>
                          <Button variant="outline" className="w-full">View Tutor</Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground mb-4">Start learning by booking a session with a tutor</p>
                  <Link href="/tutors">
                    <Button>Find a Tutor</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.length > 0 ? (
              pendingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{booking.subject}</h3>
                            <p className="text-muted-foreground">with {booking.tutor?.name}</p>
                          </div>
                          <Badge variant="secondary">{booking.status}</Badge>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(booking.date), 'EEEE, MMMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:w-40">
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No pending bookings</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{booking.subject}</h3>
                            <p className="text-muted-foreground">with {booking.tutor?.name}</p>
                          </div>
                          <Badge variant={booking.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(booking.date), 'EEEE, MMMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                        </div>
                      </div>

                      {booking.status === 'COMPLETED' && !booking.review && (
                        <div className="flex flex-col gap-2 md:w-40">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setReviewingBooking(booking.id)}
                          >
                            Leave Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No past bookings</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {reviewingBooking && (
          <ReviewForm
            bookingId={reviewingBooking}
            tutorName={bookings.find(b => b.id === reviewingBooking)?.tutor?.name || 'Tutor'}
            onClose={() => setReviewingBooking(null)}
            onSuccess={() => {
              setReviewingBooking(null);
              fetchBookings();
            }}
          />
        )}
      </div>
    </div>
  );
}
