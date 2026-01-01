"use client";

import { useState } from "react";
import Calendar from "@/components/calendar/calendar";
import type { CalendarEvent } from "@/components/calendar/calendar-types";

interface AvailabilityCalendarProps {
  onDateSelect?: (date: Date) => void;
}

// Dummy data untuk tanggal yang sudah dibooking sebagai events
const bookedEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Sudah Dibooking",
    start: new Date(2026, 0, 5),
    end: new Date(2026, 0, 6),
    color: "red",
  },
  {
    id: "2",
    title: "Sudah Dibooking",
    start: new Date(2026, 0, 12),
    end: new Date(2026, 0, 12),
    color: "red",
  },
  {
    id: "3",
    title: "Sudah Dibooking",
    start: new Date(2026, 0, 15),
    end: new Date(2026, 0, 15),
    color: "red",
  },
  {
    id: "4",
    title: "Sudah Dibooking",
    start: new Date(2026, 0, 20),
    end: new Date(2026, 0, 20),
    color: "red",
  },
  {
    id: "5",
    title: "Sudah Dibooking",
    start: new Date(2026, 0, 25),
    end: new Date(2026, 0, 26),
    color: "red",
  },
  {
    id: "6",
    title: "Sudah Dibooking",
    start: new Date(2026, 1, 1),
    end: new Date(2026, 1, 1),
    color: "red",
  },
  {
    id: "7",
    title: "Sudah Dibooking",
    start: new Date(2026, 1, 8),
    end: new Date(2026, 1, 8),
    color: "red",
  },
  {
    id: "8",
    title: "Sudah Dibooking",
    start: new Date(2026, 1, 14),
    end: new Date(2026, 1, 15),
    color: "red",
  },
];

export function AvailabilityCalendar({ onDateSelect }: AvailabilityCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(bookedEvents);
  const [mode, setMode] = useState<"month" | "week" | "day">("month");
  const [date, setDate] = useState(new Date(2026, 0, 1));

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    onDateSelect?.(newDate);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
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
  );
}
