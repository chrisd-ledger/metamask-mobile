import { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Engine from '../Engine';
import { fromWei } from '../../util/number';
import {
  parseTransactionEIP1559,
  parseTransactionLegacy,
  getNormalizedTxState,
} from '../../util/transactions';
import {
  UseGasTransactionProps,
  GetEIP1559TransactionDataProps,
  LegacyProps,
} from './types';

/**
 *
 * @param {string} token Expects a token and when it is not provided, a random token is generated.
 * @returns the token that is used to identify the gas polling.
 */
export const startGasPolling = async (token?: string) => {
  const { GasFeeController }: any = Engine.context;
  const pollToken = await GasFeeController.getGasFeeEstimatesAndStartPolling(
    token,
  );
  return pollToken;
};

/**
 * @returns clears the token array state in the GasFeeController.
 */
export const stopGasPolling = () => {
  const { GasFeeController }: any = Engine.context;
  return GasFeeController.stopPolling();
};

export const useDataStore = () => {
  const [
    gasFeeEstimates,
    gasEstimateType,
    contractExchangeRates,
    conversionRate,
    currentCurrency,
    nativeCurrency,
    accounts,
    contractBalances,
    ticker,
    transaction,
    selectedAsset,
    showCustomNonce,
  ] = useSelector(
    (state: any) => [
      state.engine.backgroundState.GasFeeController.gasFeeEstimates,
      state.engine.backgroundState.GasFeeController.gasEstimateType,
      state.engine.backgroundState.TokenRatesController.contractExchangeRates,
      state.engine.backgroundState.CurrencyRateController.conversionRate,
      state.engine.backgroundState.CurrencyRateController.currentCurrency,
      state.engine.backgroundState.CurrencyRateController.nativeCurrency,
      state.engine.backgroundState.AccountTrackerController.accounts,
      state.engine.backgroundState.TokenBalancesController.contractBalances,
      state.engine.backgroundState.NetworkController.provider.ticker,
      getNormalizedTxState(state),
      state.transaction.selectedAsset,
      state.settings.showCustomNonce,
    ],
    shallowEqual,
  );

  return {
    gasFeeEstimates,
    transaction,
    gasEstimateType,
    contractExchangeRates,
    conversionRate,
    currentCurrency,
    nativeCurrency,
    accounts,
    contractBalances,
    selectedAsset,
    ticker,
    showCustomNonce,
  };
};

/**
 * @param {GetEIP1559TransactionDataProps} props
 * @returns parsed transaction data for EIP1559 transactions.
 */
export const getEIP1559TransactionData = ({
  gas,
  gasFeeEstimates,
  transactionState,
  contractExchangeRates,
  conversionRate,
  currentCurrency,
  nativeCurrency,
  onlyGas,
}: GetEIP1559TransactionDataProps) => {
  try {
    if (
      !gas ||
      !gasFeeEstimates ||
      !contractExchangeRates ||
      !conversionRate ||
      !currentCurrency ||
      !nativeCurrency
    ) {
      return 'Incomplete data for EIP1559 transaction';
    }

    const parsedTransactionEIP1559 = parseTransactionEIP1559(
      {
        contractExchangeRates,
        conversionRate,
        currentCurrency,
        nativeCurrency,
        transactionState,
        gasFeeEstimates,
        swapsParams: undefined,
        selectedGasFee: {
          ...gas,
          estimatedBaseFee: gasFeeEstimates.estimatedBaseFee,
        },
      },
      { onlyGas },
    );

    return parsedTransactionEIP1559;
  } catch (error) {
    return 'Error parsing transaction data';
  }
};

/**
 *
 * @param {LegacyProps} props
 * @returns parsed transaction data for legacy transactions.
 */
export const getLegacyTransactionData = ({
  contractExchangeRates,
  conversionRate,
  currentCurrency,
  transactionState,
  ticker,
  gas,
  onlyGas,
  multiLayerL1FeeTotal,
}: LegacyProps) => {
  const parsedTransationData = parseTransactionLegacy(
    {
      contractExchangeRates,
      conversionRate,
      currentCurrency,
      transactionState,
      ticker,
      selectedGasFee: {
        ...gas,
      },
      multiLayerL1FeeTotal,
    },
    { onlyGas },
  );

  return parsedTransationData;
};

/**
 *
 * @returns {Object} the transaction data for the current transaction.
 */
export const useGasTransaction = ({
  onlyGas,
  gasSelected,
  legacy,
  gasObject,
  multiLayerL1FeeTotal,
  dappSuggestedEIP1559Gas,
  dappSuggestedGasPrice,
  transactionState,
}: UseGasTransactionProps) => {
  const [gasEstimateTypeChange, updateGasEstimateTypeChange] =
    useState<string>('');

  const {
    gasFeeEstimates,
    transaction,
    gasEstimateType,
    contractExchangeRates,
    conversionRate,
    currentCurrency,
    nativeCurrency,
    ticker,
  } = useDataStore();

  useEffect(() => {
    if (gasEstimateType !== gasEstimateTypeChange) {
      updateGasEstimateTypeChange(gasEstimateType);
    }
  }, [gasEstimateType, gasEstimateTypeChange]);

  const {
    transaction: { gas: transactionGas },
  } = transaction;

  let initialGas;
  if (dappSuggestedEIP1559Gas) {
    initialGas = {
      suggestedMaxFeePerGas: fromWei(
        dappSuggestedEIP1559Gas.maxFeePerGas,
        'gwei',
      ),
      suggestedMaxPriorityFeePerGas: fromWei(
        dappSuggestedEIP1559Gas.maxPriorityFeePerGas,
        'gwei',
      ),
    };
  } else if (dappSuggestedGasPrice) {
    initialGas = {
      suggestedMaxFeePerGas: fromWei(dappSuggestedGasPrice, 'gwei'),
      suggestedMaxPriorityFeePerGas: fromWei(dappSuggestedGasPrice, 'gwei'),
    };
  } else {
    initialGas = gasFeeEstimates[gasSelected] || {
      suggestedMaxFeePerGas: gasObject?.suggestedMaxFeePerGas,
      suggestedMaxPriorityFeePerGas: gasObject?.suggestedMaxPriorityFeePerGas,
    };
  }

  const suggestedGasLimit =
    gasObject?.suggestedGasLimit || fromWei(transactionGas, 'wei');

  if (legacy) {
    return getLegacyTransactionData({
      gas: {
        suggestedGasLimit: gasObject?.legacyGasLimit || suggestedGasLimit,
        suggestedGasPrice:
          gasFeeEstimates[gasSelected] ||
          gasFeeEstimates?.gasPrice ||
          gasObject?.suggestedGasPrice,
      },
      contractExchangeRates,
      conversionRate,
      currentCurrency,
      transactionState,
      ticker,
      onlyGas,
      multiLayerL1FeeTotal,
    });
  }

  return getEIP1559TransactionData({
    gas: {
      ...(gasSelected ? gasFeeEstimates[gasSelected] : initialGas),
      suggestedGasLimit,
      selectedOption: gasSelected,
    },
    gasFeeEstimates,
    transactionState,
    contractExchangeRates,
    conversionRate,
    currentCurrency,
    nativeCurrency,
    suggestedGasLimit,
    onlyGas,
  });
};
