'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireRole } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, DollarSign, Users, Star, Loader2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { Booking } from '@/types';

export default function TutorDashboard() {
  const { user, loading: authLoading } = useRequireRole(['TUTOR']);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingSessions = bookings.filter(
    b => b.status === 'CONFIRMED' && new Date(b.date) >= new Date()
  );

  const completedSessions = bookings.filter(b => b.status === 'COMPLETED');

  const stats = {
    totalSessions: completedSessions.length,
    upcomingSessions: upcomingSessions.length,
    totalEarnings: completedSessions.reduce((sum, b) => sum + b.totalAmount, 0),
    averageRating: 4.8,
  };

  if (authLoading || loading) {
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
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your tutoring sessions and track your progress</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">Completed sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
              <p className="text-xs text-muted-foreground">Scheduled sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings}</div>
              <p className="text-xs text-muted-foreground">From completed sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Sessions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">
                      Upcoming ({upcomingSessions.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedSessions.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4 mt-4">
                    {upcomingSessions.length > 0 ? (
                      upcomingSessions.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{booking.subject}</h4>
                                <p className="text-sm text-muted-foreground">
                                  with {booking.student?.name}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                                  <Clock className="h-4 w-4 ml-2" />
                                  <span>{booking.startTime} - {booking.endTime}</span>
                                </div>
                                {booking.notes && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Notes: {booking.notes}
                                  </p>
                                )}
                              </div>
                              <Badge>{booking.status}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No upcoming sessions</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-4">
                    {completedSessions.length > 0 ? (
                      completedSessions.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{booking.subject}</h4>
                                <p className="text-sm text-muted-foreground">
                                  with {booking.student?.name}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="default">{booking.status}</Badge>
                                <p className="text-sm font-medium mt-2">${booking.totalAmount}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No completed sessions yet
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tutor/availability">
                  <Button className="w-full">Manage Availability</Button>
                </Link>
                <Link href="/tutor/profile">
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sessions</span>
                    <span className="font-medium">{stats.upcomingSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Earnings</span>
                    <span className="font-medium">${stats.totalEarnings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <span className="font-medium">{stats.averageRating} ⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
