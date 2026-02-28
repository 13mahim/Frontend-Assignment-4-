'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, SlidersHorizontal, Loader2, Star, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { TutorProfile } from '@/types';

export default function BrowseTutorsPage() {
  const searchParams = useSearchParams();
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchTutors();
  }, [searchParams]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const data = await api.getTutors();
      setTutors(data);
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = tutors
    .filter(tutor => {
      if (searchQuery) {
        const matchesName = tutor.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = tutor.subjects.some(s => 
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (!matchesName && !matchesSubject) return false;
      }
      
      if (minPrice && tutor.hourlyRate < parseInt(minPrice)) return false;
      if (maxPrice && tutor.hourlyRate > parseInt(maxPrice)) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price_high') return b.hourlyRate - a.hourlyRate;
      if (sortBy === 'experience') return b.experience - a.experience;
      return 0;
    });

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Perfect Tutor</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by tutor name or subject..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSearchQuery('');
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Found {filteredTutors.length} tutors
                </p>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTutors.map((tutor) => (
                    <Card key={tutor.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(tutor.user?.name || 'Tutor')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{tutor.user?.name}</h3>
                              <p className="text-sm text-muted-foreground">{tutor.title}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-sm">
                            ${tutor.hourlyRate}/hr
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {tutor.bio}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {tutor.subjects.slice(0, 3).join(', ')}
                              {tutor.subjects.length > 3 && ` +${tutor.subjects.length - 3} more`}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {tutor.experience} years experience
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">New</span>
                          </div>
                          <Link href={`/tutors/${tutor.userId}`}>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredTutors.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No tutors found matching your criteria</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery('');
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
