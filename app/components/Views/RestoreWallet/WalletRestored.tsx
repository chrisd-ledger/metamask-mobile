/* eslint-disable import/no-commonjs */
import React, { useCallback } from 'react';
import { View, Image } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { createStyles } from './styles';
import Text, {
  TextVariants,
} from '../../../component-library/components/Texts/Text';
import StyledButton from '../../UI/StyledButton';
import { createNavigationDetails } from '../../../util/navigation/navUtils';
import Routes from '../../../constants/navigation/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Authentication } from '../../../core';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const onboardingDeviceImage = require('../../../images/swaps_onboard_device.png');

export const createWalletRestoredNavDetails = createNavigationDetails(
  Routes.VAULT_RECOVERY.WALLET_RESTORED,
);

const WalletRestored = () => {
  const styles = createStyles();
  const navigation = useNavigation();
  const selectedAddress = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.selectedAddress,
  );

  const handleOnNext = useCallback(async () => {
    const credentials = await Authentication.getPassword();
    if (credentials) {
      console.log('vault/ WalletRestored credentials', credentials);
      try {
        const authData = await Authentication.getType();
        await Authentication.userEntryAuth(
          credentials.password,
          authData,
          selectedAddress,
        );
        // Only way to land back on Login is to log out, which clears credentials (meaning we should not show biometric button)
        console.log('vault/ WalletRestored login');
        navigation.navigate(Routes.ONBOARDING.HOME_NAV);
      } catch (error) {
        console.log('vault/ WalletRestored not logged in', error);
        Authentication.lockApp(false);
        navigation.navigate(Routes.ONBOARDING.LOGIN);
      }
    } else {
      console.log('vault/ WalletRestored no credentials');
      Authentication.lockApp(false);
      navigation.navigate(Routes.ONBOARDING.LOGIN);
    }
  }, [navigation, selectedAddress]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.images}>
          <Image source={onboardingDeviceImage} />
          <Text variant={TextVariants.lHeadingLG}>
            {strings('wallet_restored.wallet_restored_title')}
          </Text>
          <Text variant={TextVariants.sBodyMD} style={styles.description}>
            {strings('wallet_restored.wallet_restored_description')}
          </Text>
          <Text variant={TextVariants.sBodyMD} style={styles.description}>
            {strings('wallet_restored.wallet_restored_manual_backup')}
          </Text>
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
