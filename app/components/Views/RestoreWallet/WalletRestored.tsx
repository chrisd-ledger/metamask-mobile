/* eslint-disable import/no-commonjs */
import React, { useCallback, useState } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  Text as RNText,
  Linking,
} from 'react-native';
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
import { useAppThemeFromContext } from '../../../util/theme';

export const createWalletRestoredNavDetails = createNavigationDetails(
  Routes.VAULT_RECOVERY.WALLET_RESTORED,
);

const WalletRestored = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { colors } = useAppThemeFromContext();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const selectedAddress = useSelector(
    (state: any) =>
      state.engine.backgroundState.PreferencesController.selectedAddress,
  );

  const finishWalletRestore = useCallback(async () => {
    try {
      await Authentication.appTriggeredAuth(selectedAddress);
      navigation.navigate(Routes.ONBOARDING.HOME_NAV);
    } catch (e) {
      // we were not able to log in automatically so we will go back to login
      navigation.navigate(Routes.ONBOARDING.LOGIN);
    }
  }, [navigation, selectedAddress]);

  const backupSRPURL =
    'https://metamask.zendesk.com/hc/en-us/articles/360060826432-What-is-a-Secret-Recovery-Phrase-and-how-to-keep-your-crypto-wallet-secure';

  const onPressBackupSRP = useCallback(async () => {
    Linking.openURL(backupSRPURL);
  }, []);

  const handleOnNext = useCallback(async () => {
    setLoading(true);
    await finishWalletRestore();
  }, [finishWalletRestore]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <RNText style={styles.emoji}>🎉</RNText>
        <Text variant={TextVariants.lHeadingLG} style={styles.title}>
          {strings('wallet_restored.wallet_restored_title')}
        </Text>
        <Text style={styles.description}>
          <Text variant={TextVariants.sBodyMD}>
            {strings('wallet_restored.wallet_restored_description_part_one')}
          </Text>
          <Text variant={TextVariants.sBodyMD} style={styles.description}>
            {strings('wallet_restored.wallet_restored_description_part_two')}
          </Text>
          <Text
            variant={TextVariants.sBodyMD}
            style={styles.blueText}
            onPress={onPressBackupSRP}
          >
            {strings('wallet_restored.wallet_restored_description_link')}
          </Text>
          <Text variant={TextVariants.sBodyMD}>
            {strings('wallet_restored.wallet_restored_description_part_three')}
          </Text>
        </Text>
      </ScrollView>
      <View style={styles.actionButtonWrapper}>
        <StyledButton
          type="confirm"
          containerStyle={styles.actionButton}
          onPress={handleOnNext}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary.inverse} />
          ) : (
            strings('wallet_restored.wallet_restored_action')
          )}
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(WalletRestored);
