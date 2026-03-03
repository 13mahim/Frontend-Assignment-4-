'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireRole } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, BookOpen, Star, ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user, loading: authLoading } = useRequireRole(['STUDENT']);
  const { bookings, loading: bookingsLoading } = useBookings();

  const stats = {
    totalSessions: bookings.filter(b => b.status === 'COMPLETED').length,
    upcomingSessions: bookings.filter(b => b.status === 'CONFIRMED').length,
    totalHours: bookings.filter(b => b.status === 'COMPLETED').length,
    subjects: new Set(bookings.map(b => b.subject)).size,
  };

  const upcomingBookings = bookings
    .filter(b => b.status === 'CONFIRMED' && new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastBookings = bookings
    .filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Track your learning progress and manage your sessions</p>
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
              <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHours}</div>
              <p className="text-xs text-muted-foreground">Total learning hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.subjects}</div>
              <p className="text-xs text-muted-foreground">Different subjects</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>Manage your upcoming and past sessions</CardDescription>
                  </div>
                  <Link href="/student/bookings">
                    <Button variant="ghost" size="sm">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">
                      Upcoming ({upcomingBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="past">
                      Past ({pastBookings.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4 mt-4">
                    {upcomingBookings.length > 0 ? (
                      upcomingBookings.slice(0, 3).map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{booking.subject}</h4>
                                <p className="text-sm text-muted-foreground">
                                  with {booking.tutor?.name}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                                  <Clock className="h-4 w-4 ml-2" />
                                  <span>{booking.startTime}</span>
                                </div>
                              </div>
                              <Badge>{booking.status}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                        <Link href="/tutors">
                          <Button>Find a Tutor</Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-4 mt-4">
                    {pastBookings.length > 0 ? (
                      pastBookings.slice(0, 3).map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{booking.subject}</h4>
                                <p className="text-sm text-muted-foreground">
                                  with {booking.tutor?.name}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                                </div>
                              </div>
                              <Badge variant={booking.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No past bookings yet
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
                <Link href="/tutors">
                  <Button className="w-full">Find a Tutor</Button>
                </Link>
                <Link href="/student/bookings">
                  <Button variant="outline" className="w-full">View All Bookings</Button>
                </Link>
                <Link href="/student/profile">
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This month</span>
                    <span className="font-medium">{stats.upcomingSessions} sessions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total completed</span>
                    <span className="font-medium">{stats.totalSessions} sessions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subjects learning</span>
                    <span className="font-medium">{stats.subjects} subjects</span>
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
