export type CardNicknameType = 'personal' | 'business' | 'other';

export interface CardDetails {
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  nickname: string;
  nicknameType: CardNicknameType;
}

export interface BankOption {
  id: string;
  name: string;
  iconLabel: string;
  iconColor: string;
}
