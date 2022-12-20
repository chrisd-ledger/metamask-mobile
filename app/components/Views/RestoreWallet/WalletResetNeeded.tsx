/* eslint-disable import/no-commonjs */
import React, { useCallback, useState } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { strings } from '../../../../locales/i18n';
import { createStyles } from './styles';
import Text, {
  TextVariants,
} from '../../../component-library/components/Texts/Text';
import StyledButton from '../../UI/StyledButton';
import { createNavigationDetails } from '../../../util/navigation/navUtils';
import Routes from '../../../constants/navigation/Routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppThemeFromContext } from '../../../util/theme';
import Icon, {
  IconName,
  IconSize,
} from '../../../component-library/components/Icon';
import { useDeleteWallet } from '../../hooks/DeleteWallet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export const createWalletResetNeededNavDetails = createNavigationDetails(
  Routes.VAULT_RECOVERY.WALLET_RESET_NEEDED,
);

const WalletResetNeeded = () => {
  const { colors } = useAppThemeFromContext();
  const styles = createStyles(colors);
  const [resetWalletState] = useDeleteWallet();
  const [importWalletLoading, setImportWalletLoading] =
    useState<boolean>(false);
  const [createNewWalletLoading, setCreateNewWalletLoading] =
    useState<boolean>(false);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleCreateNewWallet = useCallback(async () => {
    setCreateNewWalletLoading(true);
    try {
      await resetWalletState();
      // this does not work and we need to figure out what to do here
      // navigation.navigate(Routes.ONBOARDING.IMPORT_FROM_SECRET_RECOVERY_PHRASE);
    } catch (error) {
      // TODO how should we handle this case?
      setCreateNewWalletLoading(false);
      console.log(
        'WalletResetNeeded',
        'there was an issue resetting the wallet',
        error,
      );
    }
  }, [resetWalletState]);

  const handleImportWallet = useCallback(async () => {
    setImportWalletLoading(true);
    try {
      await resetWalletState();
      // this does not work and we need to figure out what to do here
      // navigation.navigate(Routes.ONBOARDING.IMPORT_FROM_SECRET_RECOVERY_PHRASE);
    } catch (error) {
      // TODO how should we handle this case?
      setCreateNewWalletLoading(false);
      console.log(
        'WalletResetNeeded',
        'there was an issue resetting the wallet',
        error,
      );
    }
  }, [resetWalletState]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.images}>
          <Icon
            name={IconName.DangerFilled}
            size={IconSize.XXL}
            color={colors.error.default}
          />
        </View>
        <Text variant={TextVariants.lHeadingLG} style={styles.title}>
          {strings('wallet_reset_needed.wallet_reset_needed_title')}
        </Text>
        <Text variant={TextVariants.sBodyMD} style={styles.description}>
          {strings('wallet_reset_needed.wallet_reset_needed_caption')}
        </Text>
        <Text variant={TextVariants.sBodyMD} style={styles.description}>
          {strings('wallet_reset_needed.wallet_reset_needed_description')}
        </Text>
      </ScrollView>
      <View style={styles.actionButtonWrapper}>
        <StyledButton
          type="confirm"
          containerStyle={styles.actionButton}
          onPress={handleImportWallet}
        >
          {importWalletLoading ? (
            <ActivityIndicator size="small" color={colors.primary.inverse} />
          ) : (
            strings('wallet_reset_needed.wallet_reset_needed_reset_action')
          )}
        </StyledButton>
        <StyledButton
          type="normal"
          containerStyle={styles.actionButton}
          onPress={handleCreateNewWallet}
        >
          {createNewWalletLoading ? (
            <ActivityIndicator size="small" color={colors.primary.default} />
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
