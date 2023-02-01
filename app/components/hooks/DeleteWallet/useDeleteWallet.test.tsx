import { renderHook } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDeleteWallet from './useDeleteWallet';
import { Authentication } from '../../../core';
import Engine from '../../../core/Engine';

jest.mock('../../../core/Engine', () => ({
  resetState: jest.fn(),
  context: {
    KeyringController: {
      createNewVaultAndKeychain: () => jest.fn(),
      setLocked: () => jest.fn(),
    },
  },
}));
describe('useDeleteWallet', () => {
  test('it should provide two outputs of type function', () => {
    const { result } = renderHook(() => useDeleteWallet());
    const [resetWalletState, deleteUser] = result.current;
    expect(typeof resetWalletState).toBe('function');
    expect(typeof deleteUser).toBe('function');
  });

  test('it should call the appropriate methods to reset the wallet', async () => {
    const { result } = renderHook(() => useDeleteWallet());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [resetWalletState, _] = result.current;
    const resetPassword = jest.spyOn(Authentication, 'resetPassword');
    const resetStateSpy = jest.spyOn(Engine, 'resetState');
    await resetWalletState();
    expect(resetStateSpy).toHaveBeenCalledTimes(1);
    expect(resetPassword).toHaveBeenCalledTimes(1);
  });

  test('it should call the appropriate methods to delete the user', async () => {
    const { result } = renderHook(() => useDeleteWallet());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, deleteUser] = result.current;
    const removeItemSpy = jest.spyOn(AsyncStorage, 'removeItem');
    await deleteUser();
    expect(removeItemSpy).toHaveBeenCalled();
  });
});
