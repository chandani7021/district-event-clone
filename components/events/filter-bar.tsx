import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ListFilter, X } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import type { FilterState } from './filter-bottom-sheet';
import {
  DATE_CHIPS,
  DEFAULT_SORT_BY,
  FILTER_BUTTON_LABEL,
  GENRE_CHIPS,
  SORT_OPTIONS,
} from '@/constants/events.constants';

interface FilterBarProps {
  activeFilters: FilterState;
  selectedDateChips: string[];
  selectedGenreChips: string[];
  onFilterPress: () => void;
  onSortClear: () => void;
  onGenreModalClear: (genre: string) => void;
  onDateChipPress: (key: string) => void;
  onGenreChipPress: (genre: string) => void;
  className?: string;
}

export function FilterBar({
  activeFilters,
  selectedDateChips,
  selectedGenreChips,
  onFilterPress,
  onSortClear,
  onGenreModalClear,
  onDateChipPress,
  onGenreChipPress,
  className = '',
}: FilterBarProps) {
  const isSortSelected = activeFilters.sortBy !== DEFAULT_SORT_BY;
  const isDateSelected = selectedDateChips.length > 0;
  const isGenreSelected = activeFilters.genres.length > 0 || selectedGenreChips.length > 0;
  const hasActiveFilters = isDateSelected || isGenreSelected || isSortSelected;

  return (
    <View className={`bg-background ${className}`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className={`flex-row items-center gap-2 rounded-full border px-4 h-9 bg-transparent ${hasActiveFilters ? 'border-white/50' : 'border-white/20'}`}
            onPress={onFilterPress}
          >
            <ListFilter size={16} color="white" />
            <Text className={`font-primary-medium ${hasActiveFilters ? 'text-foreground' : 'text-secondary-foreground'}`}>
              {FILTER_BUTTON_LABEL}
            </Text>
          </TouchableOpacity>

          {/* Applied sort chip from modal */}
          {isSortSelected && (
            <TouchableOpacity
              className="flex-row items-center rounded-full h-9 px-3 gap-1 border border-white/50"
              onPress={onSortClear}
            >
              <Text className="font-primary-medium text-foreground">
                {SORT_OPTIONS.find((o) => o.value === activeFilters.sortBy)?.label}
              </Text>
              <X size={14} color="white" />
            </TouchableOpacity>
          )}

          {/* Applied genre chips from modal */}
          {activeFilters.genres.map((genre) => (
            <TouchableOpacity
              key={`modal-${genre}`}
              className="flex-row items-center rounded-full h-9 px-3 gap-1 border border-white/50"
              onPress={() => onGenreModalClear(genre)}
            >
              <Text className="font-primary-medium text-foreground">{genre}</Text>
              <X size={14} color="white" />
            </TouchableOpacity>
          ))}

          {DATE_CHIPS.map(({ key, label }) => {
            const active = selectedDateChips.includes(key);
            return (
              <TouchableOpacity
                key={key}
                className={`flex-row items-center rounded-full h-9 px-3 gap-1 bg-transparent ${active ? 'border border-white/50' : 'border border-white/20'}`}
                onPress={() => onDateChipPress(key)}
              >
                <Text className={`font-primary-medium ${active ? 'text-foreground' : 'text-secondary-foreground'}`}>
                  {label}
                </Text>
                {active && <X size={14} color="white" />}
              </TouchableOpacity>
            );
          })}

          {GENRE_CHIPS.map((g) => {
            const active = selectedGenreChips.includes(g);
            return (
              <TouchableOpacity
                key={g}
                className={`flex-row items-center rounded-full h-9 px-3 gap-1 bg-transparent ${active ? 'border border-white/50' : 'border border-white/20'}`}
                onPress={() => onGenreChipPress(g)}
              >
                <Text className={`font-primary-medium ${active ? 'text-foreground' : 'text-secondary-foreground'}`}>
                  {g}
                </Text>
                {active && <X size={14} color="white" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
