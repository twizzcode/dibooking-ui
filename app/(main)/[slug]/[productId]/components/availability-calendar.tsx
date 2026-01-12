"use client";

import { useState, useEffect } from "react";
import Calendar from "@/components/calendar/calendar";
import type { CalendarEvent } from "@/components/calendar/calendar-types";

interface AvailabilityCalendarProps {
  productId: string;
  onDateSelect?: (date: Date) => void;
}

export function AvailabilityCalendar({ productId, onDateSelect }: AvailabilityCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mode, setMode] = useState<"month" | "week">("month");
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookings from database
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/bookings?productId=${productId}&status=CONFIRMED,PENDING`);
        if (res.ok) {
          const data = await res.json();
          
          // Convert bookings to calendar events
          // For multi-day bookings, create separate event for each day
          const bookedEvents: CalendarEvent[] = [];
          
          data.bookings?.forEach((booking: any) => {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            
            // Calculate number of days
            const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            const diffTime = endDay.getTime() - startDay.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // If same day or single day booking
            if (diffDays === 0) {
              bookedEvents.push({
                id: `${booking.id}-0`,
                title: "Sudah Dibooking",
                start: startDate,
                end: endDate,
                color: "red",
              });
            } else {
              // Create event for each day
              for (let i = 0; i <= diffDays; i++) {
                const currentDay = new Date(startDay);
                currentDay.setDate(startDay.getDate() + i);
                
                // Set time for each day
                let dayStart, dayEnd;
                
                if (i === 0) {
                  // First day: use original start time
                  dayStart = new Date(startDate);
                  dayEnd = new Date(currentDay);
                  dayEnd.setHours(23, 59, 59, 999);
                } else if (i === diffDays) {
                  // Last day: use original end time
                  dayStart = new Date(currentDay);
                  dayStart.setHours(0, 0, 0, 0);
                  dayEnd = new Date(endDate);
                } else {
                  // Middle days: full day
                  dayStart = new Date(currentDay);
                  dayStart.setHours(0, 0, 0, 0);
                  dayEnd = new Date(currentDay);
                  dayEnd.setHours(23, 59, 59, 999);
                }
                
                bookedEvents.push({
                  id: `${booking.id}-${i}`,
                  title: "Sudah Dibooking",
                  start: dayStart,
                  end: dayEnd,
                  color: "red",
                });
              }
            }
          });
          
          setEvents(bookedEvents);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      fetchBookings();
    }
  }, [productId]);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    onDateSelect?.(newDate);
  };

  return (
    <div className="space-y-3">
      {/* Info Banner */}
      <div className="px-4 py-3 bg-muted rounded-lg border">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-red-500 rounded mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Tanggal yang ditampilkan dengan warna merah sudah dibooking</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Memuat jadwal..." : `Menampilkan ${events.length} booking yang sudah ada`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="border rounded-lg overflow-hidden bg-card">
      <style jsx global>{`
        /* Override calendar week view height */
        .calendar-week-view {
          max-height: 400px !important;
        }
        .calendar-week-view .calendar-body {
          max-height: 350px !important;
        }
        /* Make week view more compact */
        [data-calendar-mode="week"] {
          font-size: 0.875rem;
        }
        [data-calendar-mode="week"] .calendar-hour-slot {
          height: 40px !important;
          min-height: 40px !important;
        }
      `}</style>
      <Calendar
        events={events}
        setEvents={setEvents}
        mode={mode}
        setMode={setMode}
        date={date}
        setDate={handleDateChange}
        calendarIconIsToday={false}
        />
      </div>
    </div>
  );
}