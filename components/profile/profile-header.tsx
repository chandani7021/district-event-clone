import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';

import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Pencil, User } from 'lucide-react-native';
import { AVATAR_PATH } from '@/constants/profile';
import { THEME } from '@/lib/theme';
import { PROFILE_PHONE_FALLBACK, PROFILE_USER_FALLBACK, PROFILE_PERMISSION_REQUIRED, PROFILE_PHOTO_PERMISSION_MESSAGE } from '@/constants/profile.constants';
import type { ProfileHeaderProps } from '@/interfaces/profile.interface';


export function ProfileHeader({ name, phone, onEditPress }: ProfileHeaderProps) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    FileSystem.getInfoAsync(AVATAR_PATH).then((info) => {
      if (info.exists) {
        setAvatarUri(`${AVATAR_PATH}?t=${Date.now()}`);
      }
    });
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
      await FileSystem.copyAsync({ from: result.assets[0].uri, to: AVATAR_PATH });
      setAvatarUri(`${AVATAR_PATH}?t=${Date.now()}`);
    }
  };

  return (
    <View className="flex-row items-center gap-lg px-lg py-xl">
      {/* Tappable avatar */}
      <Pressable onPress={handlePickImage} className="relative">
        <View
          className="w-16 h-16 rounded-full overflow-hidden items-center justify-center"
          style={{ backgroundColor: THEME.dark.secondary }}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} className="w-16 h-16" />
          ) : (
            <User size={36} color={THEME.dark.input} />
          )}
        </View>

        {/* Camera badge */}
        <View
          className="absolute bottom-0 right-0 w-5 h-5 rounded-full items-center justify-center border-[1.5px]"
          style={{ backgroundColor: THEME.dark.primary, borderColor: THEME.dark.background }}
        >
          <Camera size={11} color={THEME.dark.accent} />
        </View>
      </Pressable>

      {/* Name + phone */}
      <View className="flex-1">
        <Text className="text-foreground text-md font-primary-bold" numberOfLines={1}>
          {name ?? PROFILE_USER_FALLBACK}
        </Text>
        <Text className="text-muted-foreground text-sm mt-[3px]">{phone ?? PROFILE_PHONE_FALLBACK}</Text>
      </View>

      {/* Edit button */}
      <Pressable onPress={onEditPress} hitSlop={8}>
        <Pencil size={18} color={THEME.dark.input} />
      </Pressable>
    </View>
  );
}
