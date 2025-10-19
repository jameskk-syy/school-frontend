"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import api from "@/lib/axios";

interface Schedule {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
}

interface CalendarDay {
  dayNumber: number | null;
  isToday: boolean;
  schedules: Schedule[];
}

const CourseScheduleCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Fetch schedules from API
  const fetchSchedules = async (year: number, month: number): Promise<Schedule[]> => {
    try {
      const res = await api.get('school_app.services.rest.get_course_schedules');
      const data = res.data.message?.data || [];
      return data.map((item: any) => ({
        id: item.name,
        title: item.course ,
        date: new Date(item.schedule_date),
        startTime: item.from_time,
        endTime: item.to_time,
        color: item.color || "#3b82f6",
      }));
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadSchedules = async () => {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const data = await fetchSchedules(year, month);
      setSchedules(data);
      setLoading(false);
    };
    loadSchedules();
  }, [currentDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const getSchedulesForDate = (date: number): Schedule[] => {
    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return (
        scheduleDate.getDate() === date &&
        scheduleDate.getMonth() === currentDate.getMonth() &&
        scheduleDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrint = () => window.print();
  const handleExportPDF = () => window.print(); 

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  const calendarDays: CalendarDay[] = [];
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startingDayOfWeek + 1;
    const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
    const isToday = isCurrentMonth && isValidDay && dayNumber === today.getDate();
    const daySchedules = isValidDay ? getSchedulesForDate(dayNumber) : [];
    calendarDays.push({
      dayNumber: isValidDay ? dayNumber : null,
      isToday,
      schedules: daySchedules,
    });
  }

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
          @page { size: landscape; margin: 1cm; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-4 pb-4 border-b border-gray-300 dark:border-gray-700 gap-3">
        {/* Month Navigation */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded no-print"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">{monthName}</h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded no-print"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-start sm:justify-end overflow-x-auto no-scrollbar">
          <button
            onClick={handlePrint}
            className="no-print px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 transition text-gray-800 dark:text-gray-100"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExportPDF}
            className="no-print px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 transition text-gray-800 dark:text-gray-100"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={goToToday}
            className="no-print px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-100"
          >
            Today
          </button>
          <button className="no-print px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition">
            Month
          </button>
          <button className="no-print px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-100">
            Week
          </button>
          <button className="no-print px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-100">
            Day
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div ref={calendarRef} className="print-area border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-xs font-medium text-gray-600 dark:text-gray-300 text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className="min-h-32 border-r border-b p-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {day.dayNumber && (
                <>
                  <div className="flex justify-start mb-2">
                    {day.isToday ? (
                      <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                        {day.dayNumber}
                      </div>
                    ) : (
                      <div className="w-7 h-7 flex items-center justify-center text-sm text-gray-700 dark:text-gray-300">
                        {day.dayNumber}
                      </div>
                    )}
                  </div>

                  {/* Course Schedules */}
                  <div className="space-y-1">
                    {day.schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: `${schedule.color}20`,
                          color: schedule.color,
                        }}
                      >
                        <div className="font-medium">{schedule.title}</div>
                        <div className="text-xs opacity-75">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Loading schedules...
        </div>
      )}
    </div>
  );
};

export default CourseScheduleCalendar;
