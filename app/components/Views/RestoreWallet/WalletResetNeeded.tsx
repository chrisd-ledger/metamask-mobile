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
import { useAppThemeFromContext } from '../../../util/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const onboardingDeviceImage = require('../../../images/swaps_onboard_device.png');

export const createWalletResetNeededNavDetails = createNavigationDetails(
  Routes.VAULT_RECOVERY.WALLET_RESET_NEEDED,
);

const WalletResetNeeded = () => {
  const styles = createStyles();
  const { colors } = useAppThemeFromContext();

  const [loading, setLoading] = useState<boolean>(false);
  const handleOnNext = useCallback(async () => {
    setLoading(true);
    await EngineService.initializeVaultFromBackup({});
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.images}>
          <Image source={onboardingDeviceImage} />
          <BaseText variant={BaseTextVariant.lHeadingLG}>
            {strings('wallet_reset_needed.wallet_reset_needed_title')}
          </BaseText>
          <BaseText
            variant={BaseTextVariant.sBodyMD}
            style={styles.description}
          >
            {strings('wallet_reset_needed.wallet_reset_needed_caption')}
          </BaseText>
          <BaseText
            variant={BaseTextVariant.sBodyMD}
            style={styles.description}
          >
            {strings('wallet_reset_needed.wallet_reset_needed_description')}
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
            strings('wallet_reset_needed.wallet_reset_needed_reset_action')
          )}
        </StyledButton>
        <StyledButton
          type="normal"
          containerStyle={styles.actionButton}
          onPress={handleOnNext}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary.inverse} />
          ) : (
            strings(
              'wallet_reset_needed.wallet_reset_needed_create_new_wallet_action',
            )
          )}
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(WalletResetNeeded);
