import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createRestoreWalletNavDetails } from './RestoreWallet';

export const createWalletResetNeededNavDetails = createNavigationDetails(
  Routes.VAULT_RECOVERY.WALLET_RESET_NEEDED,
);

const WalletResetNeeded = () => {
  const { colors } = useAppThemeFromContext();
  const styles = createStyles(colors);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleCreateNewWallet = useCallback(async () => {
    navigation.navigate(Routes.MODAL.ROOT_MODAL_FLOW, {
      screen: Routes.MODAL.DELETE_WALLET,
    });
  }, [navigation]);

  const handleTryAgain = useCallback(async () => {
    navigation.replace(...createRestoreWalletNavDetails());
  }, [navigation]);

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
          {strings('new_wallet_needed.new_wallet_needed_title')}
        </Text>
        <Text variant={TextVariants.sBodyMD} style={styles.description}>
          {strings('new_wallet_needed.new_wallet_needed_description_part_one')}
        </Text>
        <Text variant={TextVariants.sBodyMD} style={styles.description}>
          {strings('new_wallet_needed.new_wallet_needed_description_part_two')}
        </Text>
        <Text variant={TextVariants.sBodyMD} style={styles.description}>
          {strings(
            'new_wallet_needed.new_wallet_needed_description_part_three',
          )}
        </Text>
      </ScrollView>
      <View style={styles.actionButtonWrapper}>
        <StyledButton
          type="confirm"
          containerStyle={styles.actionButton}
          onPress={handleTryAgain}
        >
          {strings(
            'new_wallet_needed.new_wallet_needed_create_try_again_action',
          )}
        </StyledButton>
        <StyledButton
          type="normal"
          containerStyle={styles.actionButton}
          onPress={handleCreateNewWallet}
        >
          {strings(
            'new_wallet_needed.new_wallet_needed_create_new_wallet_action',
          )}
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(WalletResetNeeded);
