'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Calendar, GraduationCap, Award, BookOpen, DollarSign, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { TutorProfile, Review, Availability } from '@/types';
import BookingForm from '@/components/bookings/BookingForm';

export default function TutorProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTutorData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);
      const [tutorData, reviewsData, availabilityData] = await Promise.all([
        api.getTutorById(id as string),
        api.getTutorReviews(id as string),
        api.getTutorAvailability(id as string)
      ]);
      setTutor(tutorData);
      setReviews(reviewsData.reviews || []);
      setAvailability(availabilityData);
    } catch (error: any) {
      showToast({
        title: 'Error',
        description: error.message || 'Failed to load tutor profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Tutor not found</p>
            <Link href="/tutors">
              <Button className="mt-4">Browse Tutors</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <Link href="/tutors" className="text-primary hover:underline mb-6 inline-flex items-center">
          ← Back to Tutors
        </Link>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {getInitials(tutor.user?.name || 'Tutor')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{tutor.user?.name}</h1>
                    <p className="text-muted-foreground mb-2">{tutor.title}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">New Tutor</span>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {tutor.hourlyRate}/hour
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {tutor.experience} years exp
                      </Badge>
                    </div>
                  </div>
                  
                  {user?.role === 'STUDENT' && (
                    <Button size="lg" onClick={() => setShowBookingForm(true)}>
                      Book a Session
                    </Button>
                  )}
                  {!user && (
                    <Link href="/login">
                      <Button size="lg">Login to Book</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="whitespace-pre-line">{tutor.bio}</p>
                    
                    <div className="space-y-3 pt-4">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Education</p>
                          <p className="text-muted-foreground">{tutor.education}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Experience</p>
                          <p className="text-muted-foreground">{tutor.experience} years</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{review.reviewer?.name}</span>
                            </div>
                            {review.comment && (
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No reviews yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availability.length > 0 ? (
                  <div className="space-y-2">
                    {availability
                      .filter(slot => slot.isAvailable)
                      .map((slot) => (
                        <div key={slot.id} className="flex justify-between text-sm">
                          <span className="font-medium">{getDayName(slot.dayOfWeek)}</span>
                          <span className="text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No availability set</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subjects Taught
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <Badge key={subject} variant="outline">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm
            tutor={tutor}
            availability={availability}
            onClose={() => setShowBookingForm(false)}
            onSuccess={() => {
              setShowBookingForm(false);
              showToast({
                title: 'Success',
                description: 'Booking request sent successfully',
                type: 'success'
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
