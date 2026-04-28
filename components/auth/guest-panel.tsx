import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { router } from 'expo-router';
import { ChevronDown, MoreVertical, User } from 'lucide-react-native';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getSavedAccounts, removeAccount, addOrUpdateAccount, type SavedAccount } from '@/services/accounts.service';
import { setToken } from '@/constants/api';
import { GUEST_ANOTHER_METHOD, GUEST_CHOOSE_ACCOUNT, GUEST_HERO_TITLE, GUEST_LABEL, GUEST_REMOVE_ACCOUNT, GUEST_SIGN_UP_OR_LOG_IN } from '@/constants/profile.constants';
import type { GuestPanelProps } from '@/interfaces/profile.interface';


import { LoginForm } from './login-form';

export function GuestPanel({ onUseAnotherLogin, selectedCountry, onPhoneFocus, onLoginSuccess }: GuestPanelProps) {
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const accs = await getSavedAccounts();
    setAccounts(accs.slice(0, 2));
  };

  const handleRemoveAccount = async (phone: string) => {
    await removeAccount(phone);
    setActiveMenuId(null);
    setAccounts((prev) => prev.filter((a) => a.phone !== phone));
  };

  const handleAccountLogin = async (account: SavedAccount) => {
    await setToken('mock-token');
    await addOrUpdateAccount(account.phone, account.dialCode, account.name);
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      router.replace('/home');
    }
  };

  const handleMaskPhone = (dialCode: string, phone: string) => {
    if (phone.length <= 4) return `${dialCode} ${phone}`;
    const firstTwo = phone.slice(0, 2);
    const lastFour = phone.slice(-4);
    const maskLength = Math.max(0, phone.length - 6);
    const mask = 'X'.repeat(maskLength);
    return `${dialCode} ${firstTwo}${mask}${lastFour}`;
  };

  const renderAccount = (account: SavedAccount, isFirst: boolean) => {
    const isMenuOpen = activeMenuId === account.phone;

    return (
      <View key={account.phone} className="relative">
        {!isFirst && <View className="h-px bg-border mx-3" />}
        <Pressable
          id={`auth-guest-account-${account.phone}`}
          className="flex-row items-center gap-3 p-3 active:opacity-70"
          onPress={() => handleAccountLogin(account)}>
          <View className="w-11 h-11 rounded-full bg-primary items-center justify-center">
            <User size={22} color="#FFFFFF" strokeWidth={1.5} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground font-primary-semibold text-base">{account.name || GUEST_LABEL}</Text>
            <Text className="text-muted-foreground text-xs mt-0.5">{handleMaskPhone(account.dialCode, account.phone)}</Text>
          </View>
          <TouchableOpacity
            className="p-2"
            onPress={() => setActiveMenuId(isMenuOpen ? null : account.phone)}
          >
            <MoreVertical size={20} color={THEME.dark.mutedForeground} />
          </TouchableOpacity>
        </Pressable>
        {isMenuOpen && (
          <View className="absolute right-6 top-11 bg-secondary border border-border rounded-lg shadow-lg z-50">
            <TouchableOpacity
              className="px-4 py-3"
              onPress={() => handleRemoveAccount(account.phone)}
            >
              <Text className="text-foreground font-primary-medium text-sm">{GUEST_REMOVE_ACCOUNT}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Pressable style={{ flex: 1 }} onPress={() => setActiveMenuId(null)}>
        {/* Heading */}
        <Text className="text-2xl font-primary-bold text-foreground text-center leading-9">
          {GUEST_HERO_TITLE}
        </Text>

        {/* Accounts List / Login Form */}
        <View className="flex-row items-center gap-3 mt-6 mb-6">
          <View className="flex-1 h-px bg-foreground/20" />
          <Text className="text-sm font-primary-semibold text-muted-foreground tracking-widest">
            {accounts.length > 0 ? GUEST_CHOOSE_ACCOUNT : GUEST_SIGN_UP_OR_LOG_IN}
          </Text>
          <View className="flex-1 h-px bg-foreground/20" />
        </View>

        {accounts.length > 0 ? (
          <>
            <View className="border border-border rounded-2xl bg-card" style={{ zIndex: 10 }}>
              {accounts.map((acc, index) => renderAccount(acc, index === 0))}
            </View>

            {/* Use another login method */}
            <TouchableOpacity
              id="auth-guest-use-another-login"
              className="flex-row items-center justify-center gap-1.5 mt-8"
              onPress={onUseAnotherLogin}
              activeOpacity={0.7}>
              <Text className="text-foreground font-primary-medium text-sm">{GUEST_ANOTHER_METHOD}</Text>
              <ChevronDown size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        ) : (
          <LoginForm
            selectedCountry={selectedCountry}
            hideHeading={true}
            onPhoneFocus={onPhoneFocus}
            onOtpSent={onLoginSuccess}
          />
        )}
      </Pressable>
    </>
  );
}
