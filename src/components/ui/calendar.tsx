"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  addMonths, 
  subMonths, 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  eachDayOfInterval,
  startOfToday,
  isSameMonth,
  addDays,
  isBefore,
  isAfter
} from "date-fns";

import { cn } from "./utils";
import { buttonVariants } from "./button";

export type CalendarProps = {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
  tripDuration?: number;
  initialFocus?: boolean;
};

/**
 * Custom Calendar Grid Implementation - 100% Native Inline Styles
 * This version uses total inline-style control to bypass all external CSS framework conflicts.
 */
function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  tripDuration = 0,
}: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(selected || startOfToday());
  
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(addMonths(viewDate, 1));
  };
  
  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(subMonths(viewDate, 1));
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={cn("inline-block w-full max-w-[300px] bg-white", className)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 4px' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
          {format(viewDate, "MMMM yyyy")}
        </h2>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={prevMonth}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'transparent' }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'transparent' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Week Header - Forced Horizontal Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '4px' }}>
        {weekDays.map((day) => (
          <div key={day} style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', padding: '4px 0' }}>
            {day}
          </div>
        ))}
      </div>
      
      {/* Dates - Forced Horizontal Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {days.map((day, idx) => {
          const isSelected = selected && isSameDay(day, selected);
          const currentMonth = isSameMonth(day, monthStart);
          const isDisabled = disabled ? disabled(day) : false;
          const isToday = isSameDay(day, startOfToday());
          
          // Trip range logic
          const tripEnd = selected ? addDays(selected, tripDuration) : null;
          const isInRange = selected && tripEnd && (
            (isAfter(day, selected) || isSameDay(day, selected)) && 
            (isBefore(day, tripEnd) || isSameDay(day, tripEnd))
          );

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect?.(day)}
              disabled={isDisabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '36px',
                width: '100%',
                fontSize: '0.875rem',
                border: 'none',
                borderTopLeftRadius: isSelected || !selected || !isInRange ? '6px' : '0px',
                borderBottomLeftRadius: isSelected || !selected || !isInRange ? '6px' : '0px',
                borderTopRightRadius: (tripEnd && isSameDay(day, tripEnd)) || !isInRange || isSelected ? '6px' : '0px',
                borderBottomRightRadius: (tripEnd && isSameDay(day, tripEnd)) || !isInRange || isSelected ? '6px' : '0px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                backgroundColor: isSelected ? '#2d5a2d' : isInRange ? '#e7f0e7' : isToday ? '#f3f4f6' : 'transparent',
                color: isSelected ? '#ffffff' : isInRange ? '#2d5a2d' : !currentMonth ? '#d1d5db' : isDisabled ? '#9ca3af' : '#1a1a1a',
                opacity: isDisabled ? 0.3 : 1,
                fontWeight: (isSelected || isInRange) ? '600' : '400',
              }}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };
