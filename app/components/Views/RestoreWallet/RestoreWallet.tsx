/* eslint-disable import/no-commonjs */
import React, { useCallback, useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { createStyles } from './styles';
import BaseText, {
  BaseTextVariant,
} from '../../../component-library/components/BaseText';
import StyledButton from '../../UI/StyledButton';
import { createNavigationDetails } from '../../../util/navigation/navUtils';
import Routes from '../../../constants/navigation/Routes';
import EngineService from '../../../core/EngineService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createWalletRestoredNavDetails } from './WalletRestored';
import { useAppThemeFromContext } from '../../../util/theme';
import { createWalletResetNeededNavDetails } from './WalletResetNeeded';
import Logger from '../../..//util/Logger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const onboardingDeviceImage = require('../../../images/swaps_onboard_device.png');

export const createRestoreWalletNavDetails = createNavigationDetails(
  Routes.VAULT_RECOVERY.RESTORE_WALLET,
);

const RestoreWallet = () => {
  const styles = createStyles();

  const { colors } = useAppThemeFromContext();
  const [loading, setLoading] = useState<boolean>(false);

  const { navigate } = useNavigation();

  const handleOnNext = useCallback(async () => {
    console.log('handleNext');
    setLoading(true);
    const restoreResult = await EngineService.initializeVaultFromBackup();
    if (restoreResult.success) {
      navigate(...createWalletRestoredNavDetails());
    } else {
      Logger.log('RestoreWallet', 'error with restore', restoreResult);
      navigate(...createWalletResetNeededNavDetails());
    }
  }, [navigate]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.images}>
          <Image source={onboardingDeviceImage} />
          <BaseText variant={BaseTextVariant.lHeadingLG}>
            {strings('restore_wallet.restore_needed_title')}
          </BaseText>
          <BaseText
            variant={BaseTextVariant.sBodyMD}
            style={styles.description}
          >
            {strings('restore_wallet.restore_needed_description')}
          </BaseText>
        </View>
      </View>
      <View style={styles.actionButtonWrapper}>
        <StyledButton
          type="confirm"
          containerStyle={styles.actionButton}
          onPress={handleOnNext}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary.inverse} />
          ) : (
            strings('restore_wallet.restore_needed_action')
          )}
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(RestoreWallet);
