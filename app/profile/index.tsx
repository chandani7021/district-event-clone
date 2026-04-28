import { useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';

import { router, Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  HelpCircle,
  Info,
  Bookmark,
  LogOut,
  Settings,
} from 'lucide-react-native';
import { LogoutModal } from '@/components/composite/logout-modal';
import { MenuRow } from '@/components/composite/menu-row';
import { SectionCard } from '@/components/composite/section-card';
import { BookingsSection } from '@/components/profile/bookings-section';
import { GuestHeader } from '@/components/profile/guest-header';
import { ProfileHeader } from '@/components/profile/profile-header';
import { THEME } from '@/lib/theme';
import type { UserProfile } from '@/interfaces/profile.interface';
import { checkSession, logout } from '@/services/auth.service';
import { getProfile } from '@/services/profile.service';
import { PROFILE_ABOUT_US, PROFILE_ACCOUNT_SETTINGS, PROFILE_ALL_BOOKINGS, PROFILE_APP_VERSION, PROFILE_FAQ, PROFILE_LOGOUT, PROFILE_MORE, PROFILE_SUPPORT, PROFILE_TITLE, APP_NAME } from '@/constants/profile.constants';
import { HOTLIST_MANAGE, PROFILE_HOTLISTS } from '@/constants/hotlist.constants';

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logoutVisible, setLogoutVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const { isAuthenticated: auth } = await checkSession();
        setIsAuthenticated(auth);
        if (auth) {
          const data = await getProfile();
          setProfile(data);
        }
        setIsLoading(false);
      }
      load();
    }, [])
  );

  const handleLogout = async (_scope: 'device' | 'all') => {
    setLogoutVisible(false);
    await logout();
    setIsAuthenticated(false);
    if (router.canGoBack()) {
      router.dismissAll();
    }
    router.replace('/auth/guest-screen');
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen
          options={{
            title: PROFILE_TITLE,
            headerStyle: { backgroundColor: THEME.dark.background },
            headerTintColor: THEME.dark.foreground,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <ActivityIndicator size="large" color={THEME.dark.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          title: PROFILE_TITLE,
          headerStyle: { backgroundColor: THEME.dark.background },
          headerTintColor: THEME.dark.foreground,
          headerBackButtonDisplayMode: 'minimal',
          headerBackButtonMenuEnabled: true,
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-lg pb-xl"
        showsVerticalScrollIndicator={false}
      >
        {isAuthenticated ? (
          <>
            <ProfileHeader
              name={profile?.name}
              phone={profile?.phone}
              onEditPress={() => router.push('/profile/edit')}
            />


            <View className="gap-sm">
              <Text className="text-foreground text-base font-primary-bold px-lg">{PROFILE_ALL_BOOKINGS}</Text>
              <BookingsSection
                onPress={(bookingTypeId) => {
                  if (bookingTypeId === 'events') {
                    router.push('/profile/bookings');
                  }
                }}
              />
            </View>



            {/* <View className="gap-sm px-lg">
              <Text className="text-foreground text-base font-primary-bold">Payments</Text>
              <SectionCard>
                <MenuRow icon={Receipt} label="Dining transactions" onPress={() => {}} />
                <MenuRow icon={ShoppingBag} label="Store transactions" onPress={() => {}} />
                <MenuRow icon={Wallet} label="District Money" disabled />
              </SectionCard>
            </View> */}

            {/* <View className="gap-sm px-lg">
              <Text className="text-foreground text-base font-primary-bold">Support</Text>
              <SectionCard>
                <MenuRow icon={HelpCircle} label="Frequently asked questions" onPress={() => {}} />
                <MenuRow icon={MessageSquare} label="Chat with us" onPress={() => {}} />
                <MenuRow icon={MessageCircle} label="Share feedback" onPress={() => {}} />
              </SectionCard>
            </View> */}

            <View className="gap-sm px-lg">
              <Text className="text-foreground text-base font-primary-bold">{HOTLIST_MANAGE}</Text>
              <SectionCard>
                <MenuRow icon={Bookmark} label={PROFILE_HOTLISTS} onPress={() => router.push('/hotlist')} />
              </SectionCard>
            </View>

            <View className="gap-sm px-lg">
              <Text className="text-foreground text-base font-primary-bold">{PROFILE_MORE}</Text>
              <SectionCard>
                <MenuRow icon={Settings} label={PROFILE_ACCOUNT_SETTINGS} onPress={() => { }} />
                <MenuRow icon={Info} label={PROFILE_ABOUT_US} onPress={() => { }} />
              </SectionCard>
            </View>

            <View className="px-lg">
              <SectionCard>
                <MenuRow
                  icon={LogOut}
                  label={PROFILE_LOGOUT}
                  destructive
                  onPress={() => setLogoutVisible(true)}
                />
              </SectionCard>
            </View>
          </>
        ) : (
          <>
            <GuestHeader onLoginPress={() => router.push('/auth/guest-screen')} />

            <View className="gap-sm px-lg">
              <Text className="text-foreground text-base font-primary-bold">{PROFILE_SUPPORT}</Text>
              <SectionCard>
                <MenuRow icon={HelpCircle} label={PROFILE_FAQ} onPress={() => { }} />
              </SectionCard>
            </View>

            <View className="gap-sm px-lg">
              <Text className="text-foreground text-base font-primary-bold">{PROFILE_MORE}</Text>
              <SectionCard>
                <MenuRow icon={Info} label={PROFILE_ABOUT_US} onPress={() => { }} />
              </SectionCard>
            </View>
          </>
        )}

        {/* Footer */}
        <View className="items-start px-lg pt-sm pb-lg gap-[2px]">
          <Text className="text-foreground text-xl font-primary-bold tracking-widest">{APP_NAME}</Text>
          <Text className="text-muted-foreground text-xs">{PROFILE_APP_VERSION}</Text>
        </View>
      </ScrollView>

      <LogoutModal
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}
