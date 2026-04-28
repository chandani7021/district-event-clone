export interface SessionResult {
  isAuthenticated: boolean
}

export interface OtpRequestResult {
  success: boolean
  message: string
}

export interface OtpVerifyResult {
  success: boolean
  message?: string
}

export interface Country {
  name: string
  code: string // ISO 3166-1 alpha-2
  dialCode: string
  flag: string // emoji
}
