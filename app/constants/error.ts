// Network Errors
export enum NetworkSwitchErrorType {
  missingNetworkId = 'Missing network id',
  currentNetwork = 'Already in current network',
  unknownNetworkId = 'Unknown network with id',
  missingChainId = 'Missing chain id',
}

// Transaction Errors
export const NEGATIVE_TOKEN_DECIMALS = 'Token decimals can not be negative';
export const NETWORK_ERROR_UNKNOWN_CHAIN_ID = 'Unknown chain id';

// QR hardware Errors
export const KEYSTONE_TX_CANCELED = 'KeystoneError#Tx_canceled';

// Password Errors
export const WRONG_PASSWORD_ERROR = 'error: Invalid password';

// Contact Flow Errors
export const CONTACT_ALREADY_SAVED = 'contactAlreadySaved';
export const SYMBOL_ERROR = 'symbolError';

// EngineService
export const VAULT_CREATION_ERROR = 'Error creating the vault';
export const NO_VAULT_IN_BACKUP_ERROR = 'No vault in backup';

//backupVault
export const VAULT_BACKUP_FAILED = 'Vault backup failed';
export const VAULT_BACKUP_FAILED_UNDEFINED =
  'Unable to backup vault as it is undefined';
