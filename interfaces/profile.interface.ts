export interface UserProfile {
  name?: string
  phone: string
  email?: string
  gender?: string
  avatarUri?: string
}

export interface BookingType {
  id: string
  label: string
}

export interface GuestPanelProps {
  onUseAnotherLogin: () => void
  selectedCountry: { dialCode: string; flag: string }
  onPhoneFocus: () => void
  onLoginSuccess?: () => void
}

export interface ProfileHeaderProps {
  name?: string
  phone?: string
  onEditPress: () => void
}

export interface ProfileFieldProps {
  label: string
  value?: string
  placeholder?: string
  editable?: boolean
  onChangeText?: (text: string) => void
  note?: string
  error?: string
  keyboardType?: 'default' | 'email-address'
  autoCapitalize?: 'none' | 'sentences'
  autoCorrect?: boolean
}

export interface LoginFormProps {
  selectedCountry: { dialCode: string; flag: string }
  onPhoneFocus?: () => void
  hideHeading?: boolean
  autoFocus?: boolean
  onOtpSent?: (phone: string) => void
  returnTo?: string
}
