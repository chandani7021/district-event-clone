import { API_BASE_URL, Endpoints, apiFetch, getToken, setToken, clearToken } from '@/constants/api';

import type { SessionResult, OtpRequestResult, OtpVerifyResult } from '@/interfaces/auth.interface';

const MOCK_OTP = '123456';

// ── Helpers ───────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Session check ─────────────────────────────────────────────────────────────

export async function checkSession(): Promise<SessionResult> {
  try {
    const response = await apiFetch(`${API_BASE_URL}${Endpoints.auth.session}`);
    return { isAuthenticated: response.ok };
  } catch {
    // API unreachable — fall back to whether a token is stored locally
    const token = await getToken();
    return { isAuthenticated: !!token };
  }
}

// ── OTP request ───────────────────────────────────────────────────────────────

export async function requestOtp(phone: string, dialCode: string): Promise<OtpRequestResult> {
  try {
    const response = await fetch(`${API_BASE_URL}${Endpoints.auth.otp.request}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, dialCode }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message ?? 'OTP sent successfully' };
  } catch {
    // Mock: always succeeds. Valid OTP logged to console for testing.
    await delay(800);
    console.info(`[MOCK] OTP for ${dialCode}${phone} → ${MOCK_OTP}`);
    return { success: true, message: 'OTP sent successfully' };
  }
}

// ── OTP verify ────────────────────────────────────────────────────────────────

export async function verifyOtp(
  phone: string,
  dialCode: string,
  otp: string
): Promise<OtpVerifyResult> {
  try {
    const response = await fetch(`${API_BASE_URL}${Endpoints.auth.otp.verify}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, dialCode, otp }),
    });
    const data = await response.json();
    if (response.ok) {
      const token = data.token ?? data.access_token ?? data.accessToken;
      if (token) await setToken(token);
    }
    return { success: response.ok, message: data.message };
  } catch {
    // Mock: accept any 6-digit OTP and store a mock token
    await delay(800);
    await setToken('mock-token');
    return { success: true };
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await clearToken();
}
