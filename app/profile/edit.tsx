import { useEffect, useState } from 'react';
import { ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View, 
  TextInput} from 'react-native';
import { Text } from '@/components/ui/text';

import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { AlertCircle, Camera, Info, User } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { AVATAR_PATH } from '@/constants/profile';
import { PROFILE_BASIC_INFO, PROFILE_EDIT_TITLE, PROFILE_EMAIL_LABEL, PROFILE_EMAIL_PLACEHOLDER, PROFILE_NAME_LABEL, PROFILE_NAME_PLACEHOLDER, PROFILE_PERMISSION_REQUIRED, PROFILE_PHONE_LABEL, PROFILE_PHONE_READONLY_NOTE, PROFILE_PHOTO_PERMISSION_MESSAGE, PROFILE_TAP_TO_CHANGE_PHOTO, PROFILE_UPDATE_BUTTON, PROFILE_EMAIL_ERROR_INVALID, COMMON_BACK } from '@/constants/profile.constants';
import type { ProfileFieldProps, UserProfile } from '@/interfaces/profile.interface';
import { getProfile, updateProfile } from '@/services/profile.service';
import { updateAccountDetailsByFullPhone } from '@/services/accounts.service';
import { GenderPicker } from '@/components/profile/gender-picker';

// ── Field ─────────────────────────────────────────────────────────────────────

function ProfileField({
  label,
  value,
  placeholder,
  editable = true,
  onChangeText,
  note,
  error,
  keyboardType,
  autoCapitalize,
  autoCorrect,
}: ProfileFieldProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-secondary-foreground text-sm font-primary-medium">
        {label}
      </Text>
      <TextInput
        className={`${editable ? 'bg-background' : 'bg-background opacity-[0.55]'} border ${error ? 'border-destructive' : editable ? 'border-border' : 'border-transparent'} rounded-xl px-lg h-12 text-base text-foreground`}
        placeholderTextColor={THEME.dark.mutedForeground}
        placeholder={placeholder}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
      {error ? (
        <View className="flex-row items-start gap-[6px]">
          <AlertCircle size={13} color={THEME.dark.destructive} style={{ marginTop: 1 }} />
          <Text className="text-destructive text-sm flex-1">{error}</Text>
        </View>
      ) : note ? (
        <View className="flex-row items-start gap-[6px]">
          <Info size={13} color={THEME.dark.mutedForeground} style={{ marginTop: 1 }} />
          <Text className="text-muted-foreground text-sm flex-1">{note}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ phone: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [originalAvatarUri, setOriginalAvatarUri] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (val: string) => {
    if (!val) { setEmailError(''); return true; }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setEmailError(valid ? '' : PROFILE_EMAIL_ERROR_INVALID);
    return valid;
  };

  useEffect(() => {
    async function load() {
      const [data, info] = await Promise.all([
        getProfile(),
        FileSystem.getInfoAsync(AVATAR_PATH),
      ]);
      setProfile(data);
      setName(data.name ?? '');
      setEmail(data.email ?? '');
      setGender(data.gender ?? '');
      if (info.exists) {
        const uri = `${AVATAR_PATH}?t=${Date.now()}`;
        setAvatarUri(uri);
        setOriginalAvatarUri(uri);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        PROFILE_PERMISSION_REQUIRED,
        PROFILE_PHOTO_PERMISSION_MESSAGE,
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]) {
      const picked = result.assets[0].uri;
      // Copy to permanent location immediately
      await FileSystem.copyAsync({ from: picked, to: AVATAR_PATH });
      setAvatarUri(`${AVATAR_PATH}?t=${Date.now()}`);
    }
  };

  const hasChanges =
    name !== (profile.name ?? '') ||
    email !== (profile.email ?? '') ||
    gender !== (profile.gender ?? '') ||
    avatarUri !== originalAvatarUri;

  const isValid = !emailError;

  const handleSave = async () => {
    if (!hasChanges || !isValid) return;
    setIsSaving(true);
    await updateProfile({ name: name || undefined, email: email || undefined, gender: gender || undefined });
    await updateAccountDetailsByFullPhone(profile.phone, {
      name: name || undefined,
      email: email || undefined,
      gender: gender || undefined,
      avatarUri: avatarUri || null,
    });
    setIsSaving(false);
    router.back();
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen
          options={{
            title: PROFILE_EDIT_TITLE,
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
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: PROFILE_EDIT_TITLE,
          headerStyle: { backgroundColor: THEME.dark.background },
          headerTintColor: THEME.dark.foreground,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 28, paddingBottom: 100, gap: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar picker */}
        <View className="items-center">
          <Pressable onPress={handlePickImage}>
            <View className="w-100 h-100 rounded-full overflow-hidden bg-secondary border-2 border-border items-center justify-center">
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} className="w-100 h-100" />
              ) : (
                <User size={48} color={THEME.dark.input} />
              )}
            </View>

            {/* Camera badge */}
            <View className="absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full bg-primary items-center justify-center border-2 border-background">
              <Camera size={14} color={THEME.dark.accent} />
            </View>
          </Pressable>
          <Text className="text-muted-foreground text-sm mt-[10px]">
            {PROFILE_TAP_TO_CHANGE_PHOTO}
          </Text>
        </View>

        {/* Basic information card */}
        <View className="bg-secondary rounded-[16px] border border-border p-xl gap-xl">
          <Text className="text-foreground text-md font-primary-bold">
            {PROFILE_BASIC_INFO}
          </Text>
          <View className="bg-border" style={{ height: 0.5 }} />

          <ProfileField
            label={PROFILE_NAME_LABEL}
            value={name}
            placeholder={PROFILE_NAME_PLACEHOLDER}
            onChangeText={setName}
          />

          <ProfileField
            label={PROFILE_PHONE_LABEL}
            value={profile.phone}
            editable={false}
            note={PROFILE_PHONE_READONLY_NOTE}
          />

          <ProfileField
            label={PROFILE_EMAIL_LABEL}
            value={email}
            placeholder={PROFILE_EMAIL_PLACEHOLDER}
            onChangeText={(text) => { setEmail(text); validateEmail(text); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError}
          />

          <GenderPicker value={gender} onChange={setGender} />
        </View>
      </ScrollView>

      {/* Sticky update button */}
      <View
        className="px-lg pt-md bg-background border-t border-border"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Pressable
          className={`rounded-[12px] py-[14px] items-center justify-center ${hasChanges && isValid && !isSaving ? 'bg-primary' : 'bg-secondary'}`}
          onPress={handleSave}
          disabled={!hasChanges || !isValid || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={THEME.dark.foreground} />
          ) : (
            <Text className={`text-base font-primary-semibold ${hasChanges && isValid ? 'text-secondary' : 'text-muted-foreground'}`}>
              {PROFILE_UPDATE_BUTTON}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
