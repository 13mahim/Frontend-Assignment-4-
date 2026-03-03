'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Users, Clock, Award, BookOpen, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { TutorProfile, Category } from '@/types';

export default function HomePage() {
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorsData, categoriesData] = await Promise.all([
          api.getTutors(),
          api.getCategories()
        ]);
        setFeaturedTutors(tutorsData.slice(0, 3));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: Users, value: '500+', label: 'Expert Tutors' },
    { icon: Users, value: '10k+', label: 'Happy Students' },
    { icon: BookOpen, value: '50+', label: 'Subjects' },
    { icon: Clock, value: '24/7', label: 'Flexible Learning' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Expert Tutors',
      description: 'Learn from qualified professionals with years of experience',
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book sessions at times that work best for you',
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Satisfaction guaranteed with our review system',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Connect with Expert Tutors,
              <span className="text-primary"> Learn Anything</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find the perfect tutor for your learning needs. Book sessions instantly and learn at your own pace.
            </p>
            
            {/* Search Bar */}
            <div className="flex max-w-2xl mx-auto gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search for subjects or tutors..."
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Link href="/tutors">
                <Button size="lg" className="h-12 px-8">
                  Search
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkillBridge?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who are already learning with SkillBridge
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register?role=STUDENT">
              <Button size="lg" variant="secondary">
                Sign Up as Student
              </Button>
            </Link>
            <Link href="/register?role=TUTOR">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
