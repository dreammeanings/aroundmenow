import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { FilterOptions } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, EVENT_TYPES, VIBE_TYPES, PRICE_RANGES, DATE_RANGES } from '../utils/constants';
import Calendar from './Calendar';

const { width } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  filters: FilterOptions;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  events?: any[];
}

export default function FilterModal({ visible, filters, onClose, onApply, events = [] }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'single' | 'range'>('range');
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<View>(null);
  const panRef = useRef(null);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleDateSelect = (date: Date) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: 'custom',
      customDateRange: {
        start: date,
        end: date,
      }
    }));
    setShowCalendar(false);
  };

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: 'custom',
      customDateRange: {
        start: startDate,
        end: endDate,
      }
    }));
    setShowCalendar(false);
  };

  const togglePriceRange = (price: string) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange.includes(price)
        ? prev.priceRange.filter(p => p !== price)
        : [...prev.priceRange, price]
    }));
  };

  const toggleEventType = (type: string) => {
    setLocalFilters(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type]
    }));
  };

  const toggleVibe = (vibe: string) => {
    setLocalFilters(prev => ({
      ...prev,
      vibe: prev.vibe.includes(vibe)
        ? prev.vibe.filter(v => v !== vibe)
        : [...prev.vibe, vibe]
    }));
  };

  const handleDistanceChange = (distance: number) => {
    const clampedDistance = Math.max(0, Math.min(100, distance));
    setLocalFilters(prev => ({
      ...prev,
      distance: clampedDistance
    }));
  };

  const onSliderGestureEvent = (event: any) => {
    if (sliderWidth === 0) return;
    
    const touchX = event.nativeEvent.absoluteX;
    if (sliderRef.current) {
      sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
        const touchPosition = touchX - pageX;
        const clampedPosition = Math.max(0, Math.min(sliderWidth, touchPosition));
        const percentage = clampedPosition / sliderWidth;
        const newDistance = Math.round(percentage * 100);
        handleDistanceChange(newDistance);
      });
    }
  };

  const onSliderHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
    } else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      setIsDragging(false);
    }
  };

  const handleSliderPress = (event: any) => {
    const touchX = event.nativeEvent.pageX;
    if (sliderRef.current) {
      sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
        const touchPosition = touchX - pageX;
        const clampedPosition = Math.max(0, Math.min(sliderWidth, touchPosition));
        const percentage = clampedPosition / sliderWidth;
        const newDistance = Math.round(percentage * 100);
        handleDistanceChange(newDistance);
      });
    }
  };

  const handleApply = () => {
    const validatedFilters = validateFilters(localFilters);
    onApply(validatedFilters);
    onClose();
  };

  const validateFilters = (filters: FilterOptions): FilterOptions => {
    const validated = { ...filters };
    
    if (validated.distance < 0) {
      validated.distance = 0;
    } else if (validated.distance > 100) {
      validated.distance = 100;
    }
    
    if (validated.dateRange === 'custom' && validated.customDateRange) {
      const { start, end } = validated.customDateRange;
      if (start > end) {
        validated.customDateRange = {
          start: end,
          end: start
        };
      }
    }
    
    validated.priceRange = [...new Set(validated.priceRange)];
    validated.eventTypes = [...new Set(validated.eventTypes)];
    validated.vibe = [...new Set(validated.vibe)];
    
    return validated;
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      dateRange: 'today',
      priceRange: [],
      distance: 25,
      eventTypes: [],
      vibe: [],
      place: undefined,
    };
    setLocalFilters(resetFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.priceRange.length > 0) count++;
    if (localFilters.eventTypes.length > 0) count++;
    if (localFilters.vibe.length > 0) count++;
    if (localFilters.distance !== 25) count++;
    if (localFilters.dateRange !== 'today') count++;
    if (localFilters.place && localFilters.place.trim() !== '') count++;
    return count;
  };

  const getDistanceLabel = () => {
    if (localFilters.distance <= 5) return 'Very Close';
    if (localFilters.distance <= 15) return 'Nearby';
    if (localFilters.distance <= 30) return 'Local';
    if (localFilters.distance <= 50) return 'Regional';
    return 'Anywhere';
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
        <Animated.View 
          style={[
            styles.container,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                })
              }]
            }
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Enhanced Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.title}>Filters</Text>
                <Text style={styles.subtitle}>Refine your event discovery</Text>
              </View>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Ionicons name="refresh" size={20} color={COLORS.primary} />
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Date Range Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar" size={20} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>When</Text>
                </View>
                <View style={styles.chipContainer}>
                  {DATE_RANGES.map(range => (
                    <TouchableOpacity
                      key={range.value}
                      style={[
                        styles.chip,
                        localFilters.dateRange === range.value && styles.chipActive
                      ]}
                      onPress={() => setLocalFilters(prev => ({ ...prev, dateRange: range.value as "today" | "tomorrow" | "weekend" | "custom" }))}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={range.icon as any} size={16} color={localFilters.dateRange === range.value ? COLORS.white : COLORS.textSecondary} />
                      <Text style={[
                        styles.chipText,
                        localFilters.dateRange === range.value && styles.chipTextActive
                      ]}>
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {localFilters.dateRange === 'custom' && (
                  <TouchableOpacity
                    style={styles.customDateButton}
                    onPress={() => setShowCalendar(true)}
                  >
                    <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.customDateText}>Select Custom Dates</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Place Filter Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="location" size={20} color={COLORS.accent} />
                  <Text style={styles.sectionTitle}>Where</Text>
                </View>
                <View style={styles.placeInputContainer}>
                  <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.placeInputIcon} />
                  <TextInput
                    style={styles.placeInput}
                    placeholder="Enter a city, venue, or address..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={localFilters.place || ''}
                    onChangeText={(text) => setLocalFilters(prev => ({ ...prev, place: text }))}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  {localFilters.place && (
                    <TouchableOpacity
                      style={styles.clearPlaceButton}
                      onPress={() => setLocalFilters(prev => ({ ...prev, place: undefined }))}
                    >
                      <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
                {localFilters.place && (
                  <View style={styles.placeIndicator}>
                    <Ionicons name="location" size={16} color={COLORS.accent} />
                    <Text style={styles.placeIndicatorText}>Searching near: {localFilters.place}</Text>
                  </View>
                )}
              </View>

              {/* Distance Section */}
              <View style={[
                styles.section,
                localFilters.dateRange === 'custom' && styles.sectionHighlighted
              ]}>
                {localFilters.dateRange === 'custom' && (
                  <View style={styles.customRangeIndicator}>
                    <Ionicons name="calendar" size={16} color={COLORS.primary} />
                    <Text style={styles.customRangeText}>Custom Range Active</Text>
                  </View>
                )}
                <View style={styles.sectionHeader}>
                  <Ionicons 
                    name="navigate" 
                    size={20} 
                    color={localFilters.dateRange === 'custom' ? COLORS.primary : COLORS.secondary} 
                  />
                  <Text style={[
                    styles.sectionTitle,
                    localFilters.dateRange === 'custom' && styles.sectionTitleHighlighted
                  ]}>Distance</Text>
                  <Text style={[
                    styles.distanceValue,
                    localFilters.dateRange === 'custom' && styles.distanceValueHighlighted
                  ]}>{getDistanceLabel()} ({localFilters.distance} miles)</Text>
                </View>
                <PanGestureHandler
                  ref={panRef}
                  onGestureEvent={onSliderGestureEvent}
                  onHandlerStateChange={onSliderHandlerStateChange}
                >
                  <View 
                    ref={sliderRef}
                    style={styles.sliderContainer}
                    onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
                  >
                    <TouchableOpacity 
                      style={styles.sliderTrack}
                      onPress={handleSliderPress}
                      activeOpacity={1}
                    >
                      <View 
                        style={[
                          styles.sliderFill, 
                          { width: `${localFilters.distance}%` }
                        ]} 
                      />
                    </TouchableOpacity>
                    <View 
                      style={[
                        styles.sliderThumb,
                        { left: `${localFilters.distance}%` },
                        isDragging && styles.sliderThumbDragging
                      ]} 
                    />
                  </View>
                </PanGestureHandler>
                <View style={styles.distanceLabels}>
                  <Text style={[
                    styles.distanceLabel,
                    localFilters.distance >= 0 && localFilters.distance <= 5 && styles.distanceLabelActive
                  ]}>0 mi</Text>
                  <Text style={[
                    styles.distanceLabel,
                    localFilters.distance >= 6 && localFilters.distance <= 25 && styles.distanceLabelActive
                  ]}>25 mi</Text>
                  <Text style={[
                    styles.distanceLabel,
                    localFilters.distance >= 26 && localFilters.distance <= 50 && styles.distanceLabelActive
                  ]}>50 mi</Text>
                  <Text style={[
                    styles.distanceLabel,
                    localFilters.distance >= 51 && localFilters.distance <= 75 && styles.distanceLabelActive
                  ]}>75 mi</Text>
                  <Text style={[
                    styles.distanceLabel,
                    localFilters.distance >= 76 && localFilters.distance <= 100 && styles.distanceLabelActive
                  ]}>100 mi</Text>
                </View>
              </View>

              {/* Price Range Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="wallet" size={20} color={COLORS.warning} />
                  <Text style={styles.sectionTitle}>Price</Text>
                </View>
                <View style={styles.chipContainer}>
                  {PRICE_RANGES.map(price => (
                    <TouchableOpacity
                      key={price.value}
                      style={[
                        styles.chip,
                        localFilters.priceRange.includes(price.value) && styles.chipActive
                      ]}
                      onPress={() => togglePriceRange(price.value)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={price.icon as any} size={16} color={localFilters.priceRange.includes(price.value) ? COLORS.white : COLORS.textSecondary} />
                      <Text style={[
                        styles.chipText,
                        localFilters.priceRange.includes(price.value) && styles.chipTextActive
                      ]}>
                        {price.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Event Types Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="grid" size={20} color={COLORS.accent} />
                  <Text style={styles.sectionTitle}>Event Types</Text>
                </View>
                <View style={styles.chipContainer}>
                  {EVENT_TYPES.map(type => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.chip,
                        localFilters.eventTypes.includes(type.id) && styles.chipActive
                      ]}
                      onPress={() => toggleEventType(type.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={type.icon as any} size={16} color={localFilters.eventTypes.includes(type.id) ? COLORS.white : COLORS.textSecondary} />
                      <Text style={[
                        styles.chipText,
                        localFilters.eventTypes.includes(type.id) && styles.chipTextActive
                      ]}>
                        {type.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Vibe Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="heart" size={20} color={COLORS.error} />
                  <Text style={styles.sectionTitle}>Vibe</Text>
                </View>
                <View style={styles.chipContainer}>
                  {VIBE_TYPES.map(vibe => (
                    <TouchableOpacity
                      key={vibe.id}
                      style={[
                        styles.chip,
                        localFilters.vibe.includes(vibe.id) && styles.chipActive
                      ]}
                      onPress={() => toggleVibe(vibe.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={vibe.icon as any} size={16} color={localFilters.vibe.includes(vibe.id) ? COLORS.white : COLORS.textSecondary} />
                      <Text style={[
                        styles.chipText,
                        localFilters.vibe.includes(vibe.id) && styles.chipTextActive
                      ]}>
                        {vibe.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Enhanced Apply Button */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[
                  styles.applyButton, 
                  getActiveFiltersCount() > 0 && styles.applyButtonActive
                ]} 
                onPress={handleApply}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color={getActiveFiltersCount() > 0 ? COLORS.white : COLORS.textSecondary} 
                />
                <Text style={[
                  styles.applyButtonText,
                  getActiveFiltersCount() > 0 && styles.applyButtonTextActive
                ]}>
                  Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
      
      <Calendar
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateSelect={handleDateSelect}
        onDateRangeSelect={handleDateRangeSelect}
        events={events}
        selectedDate={localFilters.customDateRange?.start}
        selectedDateRange={localFilters.customDateRange}
        mode={calendarMode}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '90%',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  headerContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  resetText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHighlighted: {
    backgroundColor: COLORS.surface + '40',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitleHighlighted: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  distanceValueHighlighted: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  distanceValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.white,
  },
  customDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  customDateText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: COLORS.background,
    top: -8,
    marginLeft: -10,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderThumbDragging: {
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  distanceLabelActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  applyButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  applyButtonTextActive: {
    color: COLORS.white,
  },
  customRangeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  customRangeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  placeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  placeInputIcon: {
    marginRight: SPACING.sm,
  },
  placeInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearPlaceButton: {
    padding: SPACING.sm,
  },
  placeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  placeIndicatorText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
}); 