import * as SecureStore from 'expo-secure-store';

const ACCOUNTS_KEY = 'district-clone_auth_accounts';

export interface SavedAccount {
    phone: string;
    dialCode: string;
    name?: string;
    email?: string;
    gender?: string;
    avatarUri?: string;
    lastLoginAt: number;
}

export async function getSavedAccounts(): Promise<SavedAccount[]> {
    try {
        const data = await SecureStore.getItemAsync(ACCOUNTS_KEY);
        if (!data) return [];
        const accounts: SavedAccount[] = JSON.parse(data);
        return accounts.sort((a, b) => b.lastLoginAt - a.lastLoginAt);
    } catch {
        return [];
    }
}

export async function addOrUpdateAccount(
    phone: string,
    dialCode: string,
    name?: string
): Promise<void> {
    try {
        const accounts = await getSavedAccounts();
        const existingIndex = accounts.findIndex((a) => a.phone === phone);

        if (existingIndex >= 0) {
            accounts[existingIndex] = {
                ...accounts[existingIndex],
                dialCode: dialCode || accounts[existingIndex].dialCode,
                lastLoginAt: Date.now(),
            };
            if (name !== undefined) {
                accounts[existingIndex].name = name;
            }
        } else {
            accounts.push({ phone, dialCode, name, lastLoginAt: Date.now() });
        }

        await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
        console.error('Failed to save account', e);
    }
}

export async function updateAccountDetailsByFullPhone(
    fullPhone: string,
    details: { name?: string; email?: string; gender?: string; avatarUri?: string | null }
): Promise<void> {
    try {
        const accounts = await getSavedAccounts();
        const cleanFullPhone = fullPhone.replace(/[^0-9]/g, '');

        // Find matching account
        const existingIndex = accounts.findIndex((a) => {
            const aClean = (a.dialCode + a.phone).replace(/[^0-9]/g, '');
            return aClean === cleanFullPhone || a.phone.replace(/[^0-9]/g, '') === cleanFullPhone;
        });

        if (existingIndex >= 0) {
            if (details.name !== undefined) accounts[existingIndex].name = details.name;
            if (details.email !== undefined) accounts[existingIndex].email = details.email;
            if (details.gender !== undefined) accounts[existingIndex].gender = details.gender;
            if (details.avatarUri !== undefined) {
                if (details.avatarUri === null) {
                    const { avatarUri, ...rest } = accounts[existingIndex];
                    accounts[existingIndex] = rest as SavedAccount;
                } else {
                    accounts[existingIndex].avatarUri = details.avatarUri;
                }
            }
            await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(accounts));
        }
    } catch (e) {
        console.error('Failed to update account details', e);
    }
}

export async function removeAccount(phone: string): Promise<void> {
    try {
        const accounts = await getSavedAccounts();
        const filtered = accounts.filter((a) => a.phone !== phone);
        await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(filtered));
    } catch (e) {
        console.error('Failed to remove account', e);
    }
}
