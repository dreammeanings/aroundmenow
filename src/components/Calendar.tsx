import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import EventCard from './EventCard';

const { width } = Dimensions.get('window');

interface CalendarProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  onDateRangeSelect: (startDate: Date, endDate: Date) => void;
  onMultiDateSelect?: (dates: Date[]) => void;
  events: Event[];
  selectedDate?: Date;
  selectedDateRange?: {
    start: Date;
    end: Date;
  };
  selectedDates?: Date[];
  mode: 'single' | 'range' | 'multi';
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isStartDate: boolean;
  isEndDate: boolean;
  hasEvents: boolean;
  events: Event[];
}

export default function Calendar({ 
  visible, 
  onClose, 
  onDateSelect, 
  onDateRangeSelect, 
  onMultiDateSelect,
  events, 
  selectedDate, 
  selectedDateRange,
  selectedDates,
  mode 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [tempRangeStart, setTempRangeStart] = useState<Date | null>(null);
  const [tempRangeEnd, setTempRangeEnd] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      // Initialize with current selections
      setTempSelectedDate(selectedDate || null);
      setTempRangeStart(selectedDateRange?.start || null);
      setTempRangeEnd(selectedDateRange?.end || null);
      setTempSelectedDates(selectedDates || []);
      setSelectedEvents([]);
    } else {
      // Clear all temporary state when modal closes
      setTempSelectedDate(null);
      setTempRangeStart(null);
      setTempRangeEnd(null);
      setTempSelectedDates([]);
      setSelectedEvents([]);
    }
  }, [visible, selectedDate, selectedDateRange, selectedDates, mode]);

  // Generate calendar days for current month
  useEffect(() => {
    console.log('Regenerating calendar days. Mode:', mode, 'tempSelectedDates:', tempSelectedDates?.map(d => d.toDateString()));
    generateCalendarDays();
  }, [currentMonth, events, tempSelectedDate, tempRangeStart, tempRangeEnd, tempSelectedDates, mode, forceUpdate]);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get first day of calendar (including previous month's days)
    const firstCalendarDay = new Date(firstDay);
    firstCalendarDay.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(firstCalendarDay);
      date.setDate(firstCalendarDay.getDate() + i);
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date || event.start_date);
        return eventDate.toDateString() === date.toDateString();
      });
      
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = tempSelectedDate ? 
        date.toDateString() === tempSelectedDate.toDateString() : false;
      
      const isInRange = tempRangeStart && tempRangeEnd ? 
        date >= tempRangeStart && date <= tempRangeEnd : false;
      
      const isStartDate = tempRangeStart ? 
        date.toDateString() === tempRangeStart.toDateString() : false;
      
      const isEndDate = tempRangeEnd ? 
        date.toDateString() === tempRangeEnd.toDateString() : false;
      
      const isMultiSelected = tempSelectedDates ? 
        tempSelectedDates.some(selectedDate => date.toDateString() === selectedDate.toDateString()) : false;
      
      // For multi-mode, isSelected should be based on multi-selection
      const finalIsSelected = mode === 'multi' ? isMultiSelected : (isSelected || isStartDate || isEndDate);
      
      if (mode === 'multi' && isMultiSelected) {
        console.log('Day is multi-selected:', date.toDateString());
      }
      
      if (mode === 'multi' && finalIsSelected) {
        console.log('Day will be rendered as selected:', date.toDateString(), 'isMultiSelected:', isMultiSelected);
      }
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: isToday,
        isSelected: finalIsSelected,
        isInRange: isInRange,
        isStartDate: isStartDate,
        isEndDate: isEndDate,
        hasEvents: dayEvents.length > 0,
        events: dayEvents,
      });
    }
    
    setCalendarDays(days);
  };

  const handleDayPress = (day: CalendarDay) => {
    console.log('Day pressed:', day.date.toDateString(), 'Mode:', mode);
    
    if (mode === 'single') {
      if (validateDate(day.date)) {
        setTempSelectedDate(day.date);
        setSelectedEvents(day.events);
        setExpandedDay(day.date);
      } else {
        console.warn('Invalid date selected:', day.date);
      }
    } else if (mode === 'range') {
      if (!tempRangeStart || (tempRangeStart && tempRangeEnd)) {
        // Start new range
        if (validateDate(day.date)) {
          setTempRangeStart(day.date);
          setTempRangeEnd(null);
          setSelectedEvents([]);
        }
      } else {
        // Complete range
        const validatedRange = validateDateRange(tempRangeStart, day.date);
        setTempRangeStart(validatedRange.start);
        setTempRangeEnd(validatedRange.end);
        
        // Get events for the range
        const rangeEvents = events.filter(event => {
          const eventDate = new Date(event.date || event.start_date);
          return eventDate >= validatedRange.start && eventDate <= validatedRange.end;
        });
        setSelectedEvents(rangeEvents);
      }
    } else if (mode === 'multi') {
      console.log('Multi-date mode - current tempSelectedDates:', tempSelectedDates?.map(d => d.toDateString()));
      
      // Initialize tempSelectedDates if it's null or undefined
      const currentSelectedDates = tempSelectedDates || [];
      
      // Check if the date is already selected
      const isAlreadySelected = currentSelectedDates.some(selectedDate => 
        selectedDate.toDateString() === day.date.toDateString()
      );
      
      console.log('Is already selected:', isAlreadySelected);
      
      let updatedSelectedDates: Date[];
      
      if (isAlreadySelected) {
        // Deselect the date
        updatedSelectedDates = currentSelectedDates.filter(selectedDate => 
          selectedDate.toDateString() !== day.date.toDateString()
        );
        console.log('Deselecting, new array:', updatedSelectedDates.map(d => d.toDateString()));
      } else {
        // Add the new date
        updatedSelectedDates = [...currentSelectedDates, day.date];
        console.log('Adding date, new array:', updatedSelectedDates.map(d => d.toDateString()));
      }
      
      // Validate the updated dates
      const validatedDates = validateMultiDates(updatedSelectedDates);
      console.log('Setting tempSelectedDates to:', validatedDates.map(d => d.toDateString()));
      
      setTempSelectedDates(validatedDates);
      
      // Update events for the selected dates
      const allSelectedEvents = validatedDates.length > 0 
        ? events.filter(event => {
            const eventDate = new Date(event.date || event.start_date);
            return validatedDates.some(selectedDate => 
              eventDate.toDateString() === selectedDate.toDateString()
            );
          })
        : [];
      console.log('Updated events count:', allSelectedEvents.length);
      setSelectedEvents(allSelectedEvents);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleClearSelection = () => {
    setTempSelectedDate(null);
    setTempRangeStart(null);
    setTempRangeEnd(null);
    setTempSelectedDates([]);
    setSelectedEvents([]);
  };

  const handleApplySelection = () => {
    if (mode === 'range' && tempRangeStart && tempRangeEnd) {
      onDateRangeSelect(tempRangeStart, tempRangeEnd);
      onClose();
    } else if (mode === 'single' && tempSelectedDate) {
      onDateSelect(tempSelectedDate);
      onClose();
    } else if (mode === 'multi' && tempSelectedDates && tempSelectedDates.length > 0) {
      onMultiDateSelect?.(tempSelectedDates);
      onClose();
    }
  };

  const handleClose = () => {
    // Clear all temporary state before closing
    handleClearSelection();
    onClose();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDayName = (dayIndex: number) => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
  };

  const sortEventsByTime = (events: Event[]) => {
    return events.sort((a, b) => {
      const timeA = new Date(a.date || a.start_date).getTime();
      const timeB = new Date(b.date || b.start_date).getTime();
      return timeA - timeB;
    });
  };

  const getEventsForDay = (date: Date) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date || event.start_date);
      return eventDate.toDateString() === date.toDateString();
    });
    return sortEventsByTime(dayEvents);
  };

  const navigateToDay = (direction: 'prev' | 'next') => {
    if (expandedDay) {
      const newDate = new Date(expandedDay);
      
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      
      // Validate the new date
      if (validateDate(newDate)) {
        setExpandedDay(newDate);
        
        // Update selected events for the new day
        const newDayEvents = getEventsForDay(newDate);
        setSelectedEvents(newDayEvents);
        
        // Update the calendar selection state based on mode
        if (mode === 'single') {
          setTempSelectedDate(newDate);
        } else if (mode === 'range') {
          // For range mode, update the range to focus on the new date
          if (!tempRangeStart || (tempRangeStart && tempRangeEnd)) {
            setTempRangeStart(newDate);
            setTempRangeEnd(null);
          } else {
            // If we have a start date, complete the range
            const validatedRange = validateDateRange(tempRangeStart, newDate);
            setTempRangeStart(validatedRange.start);
            setTempRangeEnd(validatedRange.end);
          }
        } else if (mode === 'multi') {
          // For multi mode, add the new date to selection if not already selected
          const currentSelectedDates = tempSelectedDates || [];
          const isAlreadySelected = currentSelectedDates.some(selectedDate => 
            selectedDate.toDateString() === newDate.toDateString()
          );
          
          if (!isAlreadySelected) {
            const updatedSelectedDates = [...currentSelectedDates, newDate];
            const validatedDates = validateMultiDates(updatedSelectedDates);
            setTempSelectedDates(validatedDates);
          }
        }
        
        // Force calendar regeneration to reflect the new selection
        setForceUpdate(prev => prev + 1);
      }
    }
  };

  const validateDate = (date: Date): boolean => {
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false;
    }
    
    // Check if date is in the past (optional - you might want to allow past dates)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (date < today) {
      return false;
    }
    
    // Check if date is too far in the future (optional)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    if (date > maxDate) {
      return false;
    }
    
    return true;
  };

  const validateDateRange = (start: Date, end: Date): { start: Date; end: Date } => {
    // Ensure start is before end
    if (start > end) {
      return { start: end, end: start };
    }
    
    // Validate both dates
    if (!validateDate(start) || !validateDate(end)) {
      const today = new Date();
      return { start: today, end: today };
    }
    
    return { start, end };
  };

  const validateMultiDates = (dates: Date[]): Date[] => {
    // Filter out invalid dates
    const validDates = dates.filter(date => validateDate(date));
    
    // Remove duplicates
    const uniqueDates = validDates.filter((date, index, self) => 
      index === self.findIndex(d => d.toDateString() === date.toDateString())
    );
    
    // Sort dates
    return uniqueDates.sort((a, b) => a.getTime() - b.getTime());
  };

  const renderDay = (day: CalendarDay, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.day,
        !day.isCurrentMonth && styles.dayOtherMonth,
        day.isToday && styles.dayToday,
        day.isSelected && styles.daySelected,
        day.isInRange && styles.dayInRange,
        day.isStartDate && styles.dayStartDate,
        day.isEndDate && styles.dayEndDate,
        day.hasEvents && styles.dayHasEvents,
        // Add specific styling for multi-selected dates
        mode === 'multi' && day.isSelected && styles.dayMultiSelected,
      ]}
      onPress={() => handleDayPress(day)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.dayText,
        !day.isCurrentMonth && styles.dayTextOtherMonth,
        day.isToday && styles.dayTextToday,
        day.isSelected && styles.dayTextSelected,
        day.isInRange && styles.dayTextInRange,
        day.hasEvents && styles.dayTextHasEvents,
        // Add specific text styling for multi-selected dates
        mode === 'multi' && day.isSelected && styles.dayTextMultiSelected,
      ]}>
        {day.day}
      </Text>
      {day.hasEvents && (
        <View style={styles.eventIndicator}>
          <Ionicons name="ellipse" size={4} color={COLORS.primary} />
        </View>
      )}
      {/* Add a checkmark for multi-selected dates */}
      {mode === 'multi' && day.isSelected && (
        <View style={styles.multiSelectIndicator}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
        </View>
      )}
      {/* Add a number indicator for multi-selected dates */}
      {mode === 'multi' && day.isSelected && tempSelectedDates && (
        <View style={styles.multiSelectNumber}>
          <Text style={styles.multiSelectNumberText}>
            {tempSelectedDates.findIndex(d => d.toDateString() === day.date.toDateString()) + 1}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEvents = () => (
    <View style={styles.eventsContainer}>
      <Text style={styles.eventsTitle}>
        {mode === 'single' ? 'Events for Selected Date' : 
         mode === 'range' ? 'Events in Date Range' : 
         `Events for ${tempSelectedDates.length} Selected Date${tempSelectedDates.length === 1 ? '' : 's'}`}
      </Text>
      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        {selectedEvents.length > 0 ? (
          selectedEvents.map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event}
              onToggleSaved={() => {}} // Placeholder for now
              onPress={() => {}} // Placeholder for now
            />
          ))
        ) : (
          <View style={styles.noEvents}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.noEventsText}>
              {mode === 'single' ? 'No events on this date' : 
               mode === 'range' ? 'No events in this date range' :
               'No events on selected dates'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderExpandedDayView = () => {
    if (!expandedDay) return null;
    
    const dayEvents = getEventsForDay(expandedDay);
    const prevDate = new Date(expandedDay);
    prevDate.setDate(prevDate.getDate() - 1);
    const nextDate = new Date(expandedDay);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const canNavigatePrev = validateDate(prevDate);
    const canNavigateNext = validateDate(nextDate);
    
    return (
      <View style={styles.expandedDayContainer}>
        {/* Day Header with Navigation */}
        <View style={styles.expandedDayHeader}>
          <TouchableOpacity
            style={[
              { padding: SPACING.md },
              !canNavigatePrev && styles.navigationDisabled
            ]}
            onPress={() => navigateToDay('prev')}
            disabled={!canNavigatePrev}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={canNavigatePrev ? COLORS.primary : COLORS.textSecondary} 
            />
          </TouchableOpacity>
          
          <View style={styles.expandedDayTitle}>
            <Text style={styles.expandedDayDate}>
              {expandedDay.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={styles.expandedDayEventCount}>
              {dayEvents.length} event{dayEvents.length === 1 ? '' : 's'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              { padding: SPACING.md },
              !canNavigateNext && styles.navigationDisabled
            ]}
            onPress={() => navigateToDay('next')}
            disabled={!canNavigateNext}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={canNavigateNext ? COLORS.primary : COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Events List */}
        <ScrollView style={styles.expandedDayEvents} showsVerticalScrollIndicator={false}>
          {dayEvents.length > 0 ? (
            dayEvents.map((event, index) => (
              <View key={event.id} style={styles.expandedDayEvent}>
                <View style={styles.eventTimeContainer}>
                  <Text style={styles.eventTime}>
                    {new Date(event.date || event.start_date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </Text>
                  <Text style={styles.eventNumber}>#{index + 1}</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventVenue} numberOfLines={1}>
                    {event.venue?.name || 'Location TBA'}
                  </Text>
                  <View style={styles.eventBadges}>
                    {event.isTrending && (
                      <View style={styles.eventBadge}>
                        <Text style={styles.eventBadgeText}>🔥 Trending</Text>
                      </View>
                    )}
                    {event.isLocalCurated && (
                      <View style={styles.eventBadge}>
                        <Text style={styles.eventBadgeText}>⭐ Local Pick</Text>
                      </View>
                    )}
                    {event.priceRange && (
                      <View style={styles.eventBadge}>
                        <Text style={styles.eventBadgeText}>{event.priceRange}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noEventsContainer}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textSecondary} />
              <Text style={styles.noEventsText}>No events scheduled</Text>
              <Text style={styles.noEventsSubtext}>Check back later for updates</Text>
            </View>
          )}
        </ScrollView>
        
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeExpandedButton}
          onPress={() => setExpandedDay(null)}
        >
          <Ionicons name="close-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === 'single' ? '📅 Select Date' : mode === 'range' ? '📅 Select Date Range' : '📅 Select Multiple Dates'}
          </Text>
          <TouchableOpacity onPress={handleClearSelection} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Multi-Date Selection Controls - Integrated into Calendar */}
          {mode === 'multi' && (
            <View style={styles.multiControls}>
              <View style={styles.multiInfo}>
                <Text style={styles.multiInfoTitle}>Select Multiple Dates</Text>
                {tempSelectedDates && tempSelectedDates.length > 0 && (
                  <Text style={styles.multiInfoText}>
                    {tempSelectedDates.length} date{tempSelectedDates.length === 1 ? '' : 's'} selected
                  </Text>
                )}
                <Text style={styles.multiInfoText}>
                  Tap dates to select/deselect them
                </Text>
              </View>
              
              {/* Quick Multi-Date Buttons */}
              <View style={styles.quickMultiButtons}>
                <TouchableOpacity
                  style={styles.quickMultiButton}
                  onPress={() => {
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const dayAfter = new Date(today);
                    dayAfter.setDate(today.getDate() + 2);
                    setTempSelectedDates([today, tomorrow, dayAfter]);
                  }}
                >
                  <Text style={styles.quickMultiButtonText}>Next 3 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickMultiButton}
                  onPress={() => {
                    const today = new Date();
                    const dates = [];
                    for (let i = 0; i < 7; i++) {
                      const date = new Date(today);
                      date.setDate(today.getDate() + i);
                      dates.push(date);
                    }
                    setTempSelectedDates(dates);
                  }}
                >
                  <Text style={styles.quickMultiButtonText}>Next Week</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickMultiButton}
                  onPress={() => {
                    setTempSelectedDates([]);
                  }}
                >
                  <Text style={styles.quickMultiButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Range Selection Controls - Integrated into Calendar */}
          {mode === 'range' && (
            <View style={styles.rangeControls}>
              <View style={styles.rangeInfo}>
                <Text style={styles.rangeInfoTitle}>Select Date Range</Text>
                {tempRangeStart && (
                  <Text style={styles.rangeInfoText}>
                    Start: {tempRangeStart.toLocaleDateString()}
                  </Text>
                )}
                {tempRangeEnd && (
                  <Text style={styles.rangeInfoText}>
                    End: {tempRangeEnd.toLocaleDateString()}
                  </Text>
                )}
                {tempRangeStart && !tempRangeEnd && (
                  <Text style={styles.rangeInfoText}>
                    Tap another date to complete the range
                  </Text>
                )}
              </View>
              
              {/* Quick Range Buttons */}
              <View style={styles.quickRangeButtons}>
                <TouchableOpacity
                  style={styles.quickRangeButton}
                  onPress={() => {
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setTempRangeStart(today);
                    setTempRangeEnd(tomorrow);
                  }}
                >
                  <Text style={styles.quickRangeButtonText}>Today-Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickRangeButton}
                  onPress={() => {
                    const today = new Date();
                    const weekend = new Date(today);
                    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
                    weekend.setDate(today.getDate() + daysUntilSaturday);
                    const sunday = new Date(weekend);
                    sunday.setDate(weekend.getDate() + 1);
                    setTempRangeStart(weekend);
                    setTempRangeEnd(sunday);
                  }}
                >
                  <Text style={styles.quickRangeButtonText}>This Weekend</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickRangeButton}
                  onPress={() => {
                    const today = new Date();
                    const nextWeek = new Date(today);
                    nextWeek.setDate(today.getDate() + 7);
                    setTempRangeStart(today);
                    setTempRangeEnd(nextWeek);
                  }}
                >
                  <Text style={styles.quickRangeButtonText}>Next 7 Days</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleMonthChange('prev')}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {getMonthName(currentMonth)}
            </Text>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleMonthChange('next')}
            >
              <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendar}>
            {/* Day Headers */}
            <View style={styles.dayHeaders}>
              {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
                <Text key={dayIndex} style={styles.dayHeader}>
                  {getDayName(dayIndex)}
                </Text>
              ))}
            </View>
            
            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {calendarDays.map((day, index) => renderDay(day, index))}
            </View>
          </View>

          {/* Expanded Day View */}
          {expandedDay && renderExpandedDayView()}

          {/* Events List */}
          {!expandedDay && renderEvents()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.applyButton,
              ((mode === 'single' && tempSelectedDate) || 
               (mode === 'range' && tempRangeStart && tempRangeEnd) ||
               (mode === 'multi' && tempSelectedDates && tempSelectedDates.length > 0)) && styles.applyButtonActive
            ]}
            onPress={handleApplySelection}
            disabled={!(mode === 'single' && tempSelectedDate) && !(mode === 'range' && tempRangeStart && tempRangeEnd) && !(mode === 'multi' && tempSelectedDates && tempSelectedDates.length > 0)}
          >
            <Text style={styles.applyButtonText}>
              {mode === 'single' 
                ? (tempSelectedDate ? `Select ${tempSelectedDate.toLocaleDateString()}` : 'Select Date')
                : (mode === 'range' && tempRangeStart && tempRangeEnd 
                    ? `Apply Range (${tempRangeStart.toLocaleDateString()} - ${tempRangeEnd.toLocaleDateString()})`
                    : (mode === 'multi' && tempSelectedDates && tempSelectedDates.length > 0 
                        ? `Apply Multi-Date Selection (${tempSelectedDates.length} dates)`
                        : 'Apply Date Range'))
              }
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clearButton: {
    padding: SPACING.md,
  },
  clearText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
  },
  navButton: {
    padding: SPACING.md,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  calendar: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: (width - SPACING.lg * 4) / 7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    borderRadius: BORDER_RADIUS.md,
    position: 'relative',
  },
  dayOtherMonth: {
    opacity: 0.3,
  },
  dayToday: {
    backgroundColor: COLORS.accent + '20',
    borderWidth: 3,
    borderColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
  },
  daySelected: {
    backgroundColor: COLORS.primary,
  },
  dayInRange: {
    backgroundColor: COLORS.primary + '60',
  },
  dayStartDate: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderBottomLeftRadius: BORDER_RADIUS.md,
  },
  dayEndDate: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: BORDER_RADIUS.md,
    borderBottomRightRadius: BORDER_RADIUS.md,
  },
  dayHasEvents: {
    // Visual indicator for days with events
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayTextOtherMonth: {
    color: COLORS.textSecondary,
  },
  dayTextToday: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 18,
  },
  dayTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dayTextInRange: {
    color: COLORS.white,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dayTextHasEvents: {
    fontWeight: 'bold',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 2,
  },
  eventsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  eventsList: {
    maxHeight: 300,
  },
  noEvents: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  noEventsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    backgroundColor: COLORS.border,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  applyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  applyButtonText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  rangeControls: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rangeInfo: {
    marginBottom: SPACING.md,
  },
  rangeInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  rangeInfoText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  quickRangeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
  },
  quickRangeButton: {
    backgroundColor: COLORS.primary + '10',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  quickRangeButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  multiControls: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  multiInfo: {
    marginBottom: SPACING.md,
  },
  multiInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  multiInfoText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  quickMultiButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
  },
  quickMultiButton: {
    backgroundColor: COLORS.primary + '10',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  quickMultiButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  multiSelectIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 2,
  },
  dayMultiSelected: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  dayTextMultiSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  multiSelectNumber: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiSelectNumberText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  expandedDayContainer: {
    backgroundColor: COLORS.background,
    flex: 1,
    padding: SPACING.lg,
  },
  expandedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  expandedDayTitle: {
    flex: 1,
    alignItems: 'center',
  },
  expandedDayDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  expandedDayEventCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  expandedDayEvents: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  expandedDayEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  eventTimeContainer: {
    width: 60,
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  eventNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  eventVenue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  eventBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  eventBadge: {
    backgroundColor: COLORS.primary + '10',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  eventBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  noEventsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  closeExpandedButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 1,
  },
  navigationDisabled: {
    opacity: 0.5,
  },
}); 