import { useState, useEffect } from 'react';
import { View, Pressable, TouchableOpacity, Modal } from 'react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { mockCategories } from '@/lib/dummy-categories';
import { X } from 'lucide-react-native';
import {
  DEFAULT_SORT_BY,
  FILTER_APPLY_LABEL,
  FILTER_CLEAR_LABEL,
  FILTER_GENRE_TAB_LABEL,
  FILTER_SHEET_TITLE,
  FILTER_SORT_TAB_LABEL,
  SORT_OPTIONS,
} from '@/constants/events.constants';

interface FilterBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    onClear?: () => void;
    initialFilters?: FilterState;
}

export interface FilterState {
    sortBy: string;
    genres: string[];
}

export function FilterBottomSheet({ isVisible, onClose, onApply, onClear, initialFilters }: FilterBottomSheetProps) {
    const [activeTab, setActiveTab] = useState<'sort' | 'genre'>('sort');
    const [tempFilters, setTempFilters] = useState<FilterState>(
        initialFilters ?? { sortBy: DEFAULT_SORT_BY, genres: [] }
    );

    useEffect(() => {
        if (isVisible) {
            setTempFilters(initialFilters ?? { sortBy: DEFAULT_SORT_BY, genres: [] });
        }
    }, [isVisible, initialFilters]);

    if (!isVisible) return null;

    const handleToggleGenre = (genreId: string) => {
        setTempFilters((prev) => ({
            ...prev,
            genres: prev.genres.includes(genreId)
                ? prev.genres.filter((id) => id !== genreId)
                : [...prev.genres, genreId],
        }));
    };

    const clearAll = () => {
        setTempFilters({ sortBy: DEFAULT_SORT_BY, genres: [] });
        if (onClear) {
            onClear();
        } else {
            onApply({ sortBy: DEFAULT_SORT_BY, genres: [] });
        }
    };

    const footer = (
        <View className="flex-row items-center justify-between py-4 bg-secondary/20 px-6 pt-6">
            <TouchableOpacity onPress={clearAll}>
                <View className="border-b border-foreground pb-[2px]">
                    <Text className="text-foreground text-[15px] font-primary-medium">{FILTER_CLEAR_LABEL}</Text>
                </View>
            </TouchableOpacity>
            <Button
                className="bg-primary rounded-xl px-10 h-12"
                onPress={() => onApply(tempFilters)}
            >
                <Text className="text-primary-foreground font-primary-semibold text-[15px]">{FILTER_APPLY_LABEL}</Text>
            </Button>
        </View>
    );

    return (
        <BottomSheet
            isVisible={isVisible}
            onClose={onClose}
            coverage={0.65}
            className="bg-[#111111]"
            footer={footer}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-foreground text-[22px] font-primary-bold">{FILTER_SHEET_TITLE}</Text>
                <TouchableOpacity onPress={onClose} className="p-2 bg-foreground/10 rounded-full">
                    <X size={18} color="white" />
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-1">
                {/* Sidebar Tabs */}
                <View className="w-1/3 border-r border-foreground/5">
                    <TouchableOpacity
                        className={`py-4 pl-6 ${activeTab === 'sort' ? 'bg-primary/20' : ''}`}
                        onPress={() => setActiveTab('sort')}
                    >
                        <View className="flex-row items-center">
                            {activeTab === 'sort' && <View className="absolute -left-6 w-1 h-full bg-primary" />}
                            <Text className={`text-base font-primary-medium ${activeTab === 'sort' ? 'text-foreground' : 'text-secondary-foreground'}`}>
                                {FILTER_SORT_TAB_LABEL}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-4 pl-6 ${activeTab === 'genre' ? 'bg-primary/20' : ''}`}
                        onPress={() => setActiveTab('genre')}
                    >
                        <View className="flex-row items-center">
                            {activeTab === 'genre' && <View className="absolute -left-6 w-1 h-full bg-primary" />}
                            <Text className={`text-base font-primary-medium ${activeTab === 'genre' ? 'text-foreground' : 'text-secondary-foreground'}`}>
                                {FILTER_GENRE_TAB_LABEL}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                <View className="flex-1 pl-6 pt-4">
                    {activeTab === 'sort' ? (
                        <View className="gap-8">
                            {SORT_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    className="flex-row items-center gap-4"
                                    onPress={() => setTempFilters({ ...tempFilters, sortBy: option.value })}
                                >
                                    <View className={`w-6 h-6 rounded-full border-[1.5px] items-center justify-center ${tempFilters.sortBy === option.value ? 'border-foreground' : 'border-muted-foreground'}`}>
                                        {tempFilters.sortBy === option.value && (
                                            <View className="w-4 h-4 rounded-full bg-foreground" />
                                        )}
                                    </View>
                                    <Text className={`text-base font-primary-medium ${tempFilters.sortBy === option.value ? 'text-foreground' : 'text-secondary-foreground'}`}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View className="gap-8">
                            {mockCategories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    className="flex-row items-center gap-4"
                                    onPress={() => handleToggleGenre(category.title)}
                                >
                                    <View className={`w-6 h-6 rounded border-[1.5px] items-center justify-center ${tempFilters.genres.includes(category.title) ? 'border-foreground bg-foreground' : 'border-muted-foreground'}`}>
                                        {tempFilters.genres.includes(category.title) && (
                                            <View className="w-3 h-3 bg-black rounded-sm" />
                                        )}
                                    </View>
                                    <Text className={`text-base font-primary-medium ${tempFilters.genres.includes(category.title) ? 'text-foreground' : 'text-secondary-foreground'}`}>
                                        {category.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </BottomSheet>
    );
}
