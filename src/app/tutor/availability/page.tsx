'use client';

import { useState, useEffect } from 'react';
import { useRequireRole } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Availability } from '@/types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TutorAvailabilityPage() {
  const { user, loading: authLoading } = useRequireRole(['TUTOR']);
  const { showToast } = useToast();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const data = await api.getTutorAvailability(user!.id);
      setAvailability(data);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (dayOfWeek: number) => {
    const newSlot: Partial<Availability> = {
      dayOfWeek,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    };
    setAvailability([...availability, newSlot as Availability]);
  };

  const removeTimeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof Availability, value: any) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateAvailability(
        availability.map(({ dayOfWeek, startTime, endTime, isAvailable }) => ({
          dayOfWeek,
          startTime,
          endTime,
          isAvailable,
        }))
      );
      showToast({
        title: 'Success',
        description: 'Availability updated successfully',
        type: 'success',
      });
    } catch (error: any) {
      showToast({
        title: 'Error',
        description: error.message,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const groupedByDay = DAYS.map((day, dayIndex) => ({
    day,
    dayIndex,
    slots: availability.filter(a => a.dayOfWeek === dayIndex),
  }));

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Availability</h1>
          <p className="text-muted-foreground">Set your available time slots for tutoring sessions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {groupedByDay.map(({ day, dayIndex, slots }) => (
              <div key={dayIndex} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{day}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(dayIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>

                {slots.length > 0 ? (
                  <div className="space-y-3">
                    {slots.map((slot, slotIndex) => {
                      const globalIndex = availability.findIndex(
                        a => a.dayOfWeek === dayIndex && a.startTime === slot.startTime
                      );
                      return (
                        <div key={slotIndex} className="flex items-center gap-4">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs">Start Time</Label>
                              <Input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateTimeSlot(globalIndex, 'startTime', e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-xs">End Time</Label>
                              <Input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateTimeSlot(globalIndex, 'endTime', e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTimeSlot(globalIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No time slots set for this day</p>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={fetchAvailability}>
                Reset
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
