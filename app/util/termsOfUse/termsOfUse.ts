import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConstants from '../../core/AppConstants';
import { MetaMetricsEvents } from '../../core/Analytics';
import AnalyticsV2 from '../analyticsV2';
import { TRUE, USE_TERMS } from '../../constants/storage';
import Routes from '../../constants/navigation/Routes';
import { strings } from '../../../locales/i18n';

const onConfirmUseTerms = async () => {
  await AsyncStorage.setItem(USE_TERMS, TRUE);
  AnalyticsV2.trackEvent(MetaMetricsEvents.USER_TERMS, {
    value: AppConstants.TERMS_ACCEPTED,
  });
};

const useTermsDisplayed = () => {
  AnalyticsV2.trackEvent(MetaMetricsEvents.USER_TERMS, {
    value: AppConstants.TERMS_DISPLAYED,
  });
};

export default async function navigateTermsOfUse(
  navigate: (key: string, params: any) => void,
) {
  const isUseTermsAccepted = await AsyncStorage.getItem(USE_TERMS);
  if (!isUseTermsAccepted) {
    navigate(Routes.MODAL.ROOT_MODAL_FLOW, {
      screen: Routes.MODAL.MODAL_MANDATORY,
      params: {
        buttonText: strings('terms_of_use_modal.accept_cta'),
        checkboxText: strings(
          'terms_of_use_modal.terms_of_use_check_description',
        ),
        headerTitle: strings('terms_of_use_modal.title'),
        onAccept: onConfirmUseTerms,
        footerHelpText: strings('terms_of_use_modal.accept_helper_description'),
        body: {
          source: 'WebView',
          uri: 'https://consensys.net/terms-of-use/',
        },
        onRender: useTermsDisplayed,
      },
    });
  }
}
