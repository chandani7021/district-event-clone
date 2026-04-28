import { View } from 'react-native';
import { CreditCard, Wallet, Building2, MessageCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

const ICON_CONFIG: Record<string, { bg: string; content: 'gpay' | 'amazon' | 'whatsapp' | 'card' | 'wallet' | 'lazypay' | 'bank' | 'mobikwik' }> = {
  gpay: { bg: '#fff', content: 'gpay' },
  amazonpay: { bg: '#FF9900', content: 'amazon' },
  whatsapp: { bg: '#25D366', content: 'whatsapp' },
  card: { bg: '#3B3B3B', content: 'card' },
  amazon_wallet: { bg: '#FF9900', content: 'amazon' },
  district_money: { bg: '#3B3B3B', content: 'wallet' },
  mobikwik: { bg: '#1B75BB', content: 'mobikwik' },
  lazypay: { bg: '#E8001C', content: 'lazypay' },
  netbanking: { bg: '#3B3B3B', content: 'bank' },
};

interface PaymentMethodIconProps {
  methodId: string;
  size?: number;
}

export function PaymentMethodIcon({ methodId, size = 40 }: PaymentMethodIconProps) {
  const config = ICON_CONFIG[methodId];
  const bg = config?.bg ?? '#3B3B3B';
  const content = config?.content ?? 'card';
  const iconSize = size * 0.5;

  return (
    <View
      style={{ width: size, height: size, backgroundColor: bg }}
      className="rounded-lg items-center justify-center overflow-hidden"
    >
      {content === 'gpay' && (
        <View className="flex-row items-center justify-center">
          <Text style={{ fontSize: iconSize * 0.9, fontWeight: '800', color: '#4285F4' }}>G</Text>
        </View>
      )}
      {content === 'amazon' && (
        <Text style={{ fontSize: iconSize * 0.9, fontWeight: '800', color: '#fff' }}>a</Text>
      )}
      {content === 'whatsapp' && (
        <MessageCircle size={iconSize} color="#fff" fill="#fff" />
      )}
      {content === 'card' && (
        <CreditCard size={iconSize} color="#fff" />
      )}
      {content === 'wallet' && (
        <Wallet size={iconSize} color="#fff" />
      )}
      {content === 'mobikwik' && (
        <Text style={{ fontSize: iconSize * 0.9, fontWeight: '800', color: '#fff' }}>M</Text>
      )}
      {content === 'lazypay' && (
        <Text style={{ fontSize: iconSize * 0.9, fontWeight: '800', color: '#fff' }}>L</Text>
      )}
      {content === 'bank' && (
        <Building2 size={iconSize} color="#fff" />
      )}
    </View>
  );
}
