import { useState, useEffect } from 'react';
import {
  View,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Info, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { THEME } from '@/lib/theme';
import type { InvoiceDetails } from '@/interfaces/booking.interface';
import { BOOKING_INVOICE_SECTION } from '@/constants/booking.constants';
import { InvoiceForm, isValidEmail } from '@/components/booking/invoice-form';

interface InvoiceEditSheetProps {
  isVisible: boolean;
  invoiceDetails: InvoiceDetails;
  onClose: () => void;
  onSave: (details: InvoiceDetails) => void;
}

export function InvoiceEditSheet({ isVisible, invoiceDetails, onClose, onSave }: InvoiceEditSheetProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (isVisible) {
      setName(invoiceDetails.name);
      setEmail(invoiceDetails.email);
      setState(invoiceDetails.state);
      setShowStatePicker(false);
      setEmailError('');
    }
  }, [isVisible, invoiceDetails]);

  const canSave =
    name.trim().length > 0 &&
    isValidEmail(email) &&
    !emailError &&
    state.length > 0;

  const handleSave = () => {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    const phoneDigits = invoiceDetails.phone.replace(/^\+91/, '').replace(/^91/, '');
    onSave({
      name: name.trim(),
      phone: `+91${phoneDigits}`,
      email: email.trim(),
      state,
    });
  };

  const phone = invoiceDetails.phone.replace(/^\+91/, '').replace(/^91/, '');

  const footer = (
    <TouchableOpacity
      className={`w-full rounded-xl h-14 items-center justify-center ${canSave ? 'bg-foreground' : 'bg-muted'}`}
      disabled={!canSave}
      onPress={handleSave}>
      <Text className={`text-base font-primary-semibold ${canSave ? 'text-background' : 'text-muted-foreground'}`}>
        Save
      </Text>
    </TouchableOpacity>
  );

  if (!isVisible) return null;

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      coverage={0.75}
      footer={footer}
      className="gap-3">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-foreground text-lg font-primary-bold flex-1 mr-4 ">
          {BOOKING_INVOICE_SECTION}
        </Text>
        <Pressable
          onPress={onClose}
          hitSlop={8}
          className="p-2 rounded-full"
          style={{ backgroundColor: THEME.dark.secondary }}>
          <X size={18} color={THEME.dark.foreground} />
        </Pressable>
      </View>


      <InvoiceForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        state={state}
        setState={setState}
        emailError={emailError}
        setEmailError={setEmailError}
        showStatePicker={showStatePicker}
        setShowStatePicker={setShowStatePicker}
        containerClassName="gap-3"
        statePickerMaxHeight={200}
      />
    </BottomSheet>
  );
}
