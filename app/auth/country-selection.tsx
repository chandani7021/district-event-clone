import { COUNTRIES } from '@/constants/countries';
import type { Country } from '@/interfaces/auth.interface';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { router, Stack } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { THEME } from '@/lib/theme';
import { COUNTRY_SEARCH_PLACEHOLDER, COUNTRY_SELECTION_TITLE } from '@/constants/auth.constants';

export default function CountrySelectionScreen() {
    const [search, setSearch] = useState('');

    const filteredCountries = COUNTRIES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.dialCode.includes(search)
    );

    const handleSelect = (country: Country) => {
        // Navigate back with selected country
        router.replace({
            pathname: '/auth/guest-screen',
            params: {
                dialCode: country.dialCode,
                flag: country.flag,
            }
        });
    };

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: COUNTRY_SELECTION_TITLE,
                    headerStyle: { backgroundColor: THEME.dark.background },
                    headerTintColor: THEME.dark.foreground,
                    headerBackButtonDisplayMode: 'minimal',
                }}
            />

            <View className="flex-1 p-4 gap-4">
                {/* Search Input */}
                <View className="flex-row items-center bg-secondary rounded-xl px-4 border border-border">
                    <Search size={20} color={THEME.dark.mutedForeground} />
                    <Input
                        id="auth-country-search"
                        className="flex-1 border-0 bg-transparent text-foreground h-12"
                        placeholder={COUNTRY_SEARCH_PLACEHOLDER}
                        placeholderTextColor={THEME.dark.mutedForeground}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <FlatList
                    data={filteredCountries}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                        <Pressable
                            id={`auth-country-item-${item.code}`}
                            className="flex-row items-center justify-between py-4 border-b border-foreground/5"
                            onPress={() => handleSelect(item)}
                        >
                            <View className="flex-row items-center gap-4">
                                <Text className="text-2xl">{item.flag}</Text>
                                <Text className="text-foreground font-primary-medium text-base">{item.name}</Text>
                            </View>
                            <Text className="text-muted-foreground font-primary-medium">{item.dialCode}</Text>
                        </Pressable>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="pb-10"
                />
            </View>
        </View>
    );
}
