import { KeyringState } from '@metamask/controllers';
import Logger from '../util/Logger';
import {
  getInternetCredentials,
  setInternetCredentials,
  resetInternetCredentials,
  Options,
  ACCESSIBLE,
} from 'react-native-keychain';

const VAULT_BACKUP_KEY = 'VAULT_BACKUP';

const options: Options = {
  accessible: ACCESSIBLE.WHEN_UNLOCKED,
};

interface KeyringBackupResponse {
  success: boolean;
  message: string;
  state?: KeyringState;
}

interface FetchKeyringFromBackupResponse {
  success: boolean;
  vault?: string;
}

export async function backupVault(
  keyringState: KeyringState,
): Promise<KeyringBackupResponse> {
  if (keyringState.vault) {
    const backupResult = await setInternetCredentials(
      VAULT_BACKUP_KEY,
      VAULT_BACKUP_KEY,
      keyringState.vault,
      options,
    );
    if (backupResult === false) {
      Logger.log(VAULT_BACKUP_KEY, 'Vault backup failed');
      const response: KeyringBackupResponse = {
        success: false,
        message: 'Vault backup failed',
      };
      return response;
    }
    Logger.log(VAULT_BACKUP_KEY, 'Vault successfully backed up');
    const response: KeyringBackupResponse = {
      success: true,
      message: 'Vault successfully backed up',
      state: {
        vault: keyringState.vault,
        keyrings: keyringState.keyrings,
      },
    };
    return response;
  }
  Logger.log(VAULT_BACKUP_KEY, 'Unable to backup vault as it is undefined');
  const response: KeyringBackupResponse = {
    success: false,
    message: 'Unable to backup vault as it is undefined',
  };
  return response;
}

export async function getVaultFromBackup(): Promise<FetchKeyringFromBackupResponse> {
  Logger.log(VAULT_BACKUP_KEY, 'getVaultFromBackup');
  const credentials = await getInternetCredentials(VAULT_BACKUP_KEY);
  if (credentials) {
    return { success: true, vault: credentials.password };
  }
  return { success: false };
}

export const resetVaultBackup = async () => {
  Logger.log(VAULT_BACKUP_KEY, 'resetting vault backup');
  await resetInternetCredentials(VAULT_BACKUP_KEY);
};
