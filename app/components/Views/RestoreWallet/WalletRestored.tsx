/* eslint-disable import/no-commonjs */
import React, { useCallback } from 'react';
import { View, Image } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { createStyles } from './styles';
import BaseText, {
  BaseTextVariant,
} from '../../../component-library/components/BaseText';
import StyledButton from '../../UI/StyledButton';
import { createNavigationDetails } from '../../../util/navigation/navUtils';
import Routes from '../../../constants/navigation/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '../../../actions/user';
import { useNavigation } from '@react-navigation/native';
import Engine from '../../../core/Engine';
import SecureKeychain from '../../../core/SecureKeychain';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const onboardingDeviceImage = require('../../../images/swaps_onboard_device.png');

export const createWalletRestoredNavDetails = createNavigationDetails(
  Routes.VAULT_RECOVERY.WALLET_RESTORED,
);

const WalletRestored = () => {
  const dispatch = useDispatch();
  const styles = createStyles();
  const navigation = useNavigation();

  const handleOnNext = useCallback(async () => {
    const credentials = await SecureKeychain.getGenericPassword();
    if (credentials) {
      const { KeyringController } = Engine.context as any;
      try {
        await KeyringController.submitPassword(credentials.password);
        // Only way to land back on Login is to log out, which clears credentials (meaning we should not show biometric button)
        console.log('WalletRestored login');
        dispatch(logIn());
        navigation.replace('HomeNav');
      } catch (error) {
        console.log('WalletRestored not logged in', error);
        dispatch(logOut());
      }
    } else {
      console.log('WalletRestored no credentials');
      dispatch(logOut());
    }
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.images}>
          <Image source={onboardingDeviceImage} />
          <BaseText variant={BaseTextVariant.lHeadingLG}>
            {strings('wallet_restored.wallet_restored_title')}
          </BaseText>
          <BaseText
            variant={BaseTextVariant.sBodyMD}
            style={styles.description}
          >
            {strings('wallet_restored.wallet_restored_description')}
          </BaseText>
          <BaseText
            variant={BaseTextVariant.sBodyMD}
            style={styles.description}
          >
            {strings('wallet_restored.wallet_restored_manual_backup')}
          </BaseText>
        </View>
      </View>
      <View style={styles.actionButtonWrapper}>
        <StyledButton
          type="confirm"
          containerStyle={styles.actionButton}
          onPress={handleOnNext}
        >
          {strings('wallet_restored.wallet_restored_action')}
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(WalletRestored);
