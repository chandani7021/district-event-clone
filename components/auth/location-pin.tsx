import { View } from 'react-native';

interface LocationPinProps {
  icon: React.ElementType;
  color: string;
  size?: 'sm' | 'lg';
}

const config = {
  sm: { circle: 64, icon: 26, tipW: 10, tipH: 13 },
  lg: { circle: 88, icon: 34, tipW: 14, tipH: 18 },
};

export function LocationPin({ icon: Icon, color, size = 'lg' }: LocationPinProps) {
  const { circle, icon: iconSize, tipW, tipH } = config[size];

  return (
    <View className="items-center">
      {/* Circle head */}
      <View
        className="items-center justify-center"
        style={{
          width: circle,
          height: circle,
          borderRadius: circle / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 0.6,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 0 },
          elevation: 10,
        }}>
        <Icon size={iconSize} color="#FFFFFF" strokeWidth={1.5} />
      </View>

      {/* Teardrop pointer */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: tipW,
          borderRightWidth: tipW,
          borderTopWidth: tipH,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          marginTop: -2,
        }}
      />
    </View>
  );
}
