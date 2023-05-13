import { UserOperationStruct } from '@account-abstraction/contracts';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import KeyringService from '../services/keyring';
import ProviderBridgeService, { EthersTransactionRequest } from '../services/provider-bridge';
import { createBackgroundAsyncThunk } from './utils';
import { resolveProperties } from 'ethers/lib/utils';
import ethers from 'ethers';

export type TransactionState = {
  transactionRequest?: EthersTransactionRequest;
  transactionsRequest?: EthersTransactionRequest[];
  modifiedTransactionsRequest?: EthersTransactionRequest[];

  requestOrigin?: string;
  userOperationRequest?: Partial<UserOperationStruct>;
  unsignedUserOperation?: UserOperationStruct;
};

export const initialState: TransactionState = {
  transactionsRequest: undefined,
  transactionRequest: undefined,
  userOperationRequest: undefined,
  unsignedUserOperation: undefined,
};

type SigningReducers = {
  sendTransactionRequest: (
    state: TransactionState,
    {
      payload,
    }: {
      payload: {
        transactionRequest: EthersTransactionRequest;
        origin: string;
      };
    }
  ) => TransactionState;
  sendTransactionsRequest: (
    state: TransactionState,
    {
      payload,
    }: {
      payload: {
        transactionsRequest: EthersTransactionRequest[];
        origin: string;
      };
    }
  ) => TransactionState;
  setModifyTransactionsRequest: (
    state: TransactionState,
    {
      payload,
    }: {
      payload: EthersTransactionRequest[];
    }
  ) => TransactionState;
  sendUserOperationRquest: (state: TransactionState, { payload }: { payload: UserOperationStruct }) => TransactionState;
  setUnsignedUserOperation: (
    state: TransactionState,
    { payload }: { payload: UserOperationStruct }
  ) => TransactionState;
  clearTransactionState: (state: TransactionState) => TransactionState;
};

const transactionsSlice = createSlice<TransactionState, SigningReducers, 'signing'>({
  name: 'signing',
  initialState,
  reducers: {
    sendTransactionRequest: (
      state,
      {
        payload: { transactionRequest, origin },
      }: {
        payload: {
          transactionRequest: EthersTransactionRequest;
          origin: string;
        };
      }
    ) => {
      return {
        ...state,
        transactionRequest: transactionRequest,
        requestOrigin: origin,
      };
    },
    sendTransactionsRequest: (
      state,
      {
        payload: { transactionsRequest, origin },
      }: {
        payload: {
          transactionsRequest: EthersTransactionRequest[];
          origin: string;
        };
      }
    ) => {
      return {
        ...state,
        transactionsRequest: transactionsRequest,
        requestOrigin: origin,
      };
    },
    setModifyTransactionsRequest: (
      state,
      {
        payload,
      }: {
        payload: EthersTransactionRequest[];
      }
    ) => ({
      ...state,
      modifiedTransactionsRequest: payload,
    }),
    sendUserOperationRquest: (state, { payload }: { payload: UserOperationStruct }) => ({
      ...state,
      userOperationRequest: payload,
    }),
    setUnsignedUserOperation: (state, { payload }: { payload: UserOperationStruct }) => ({
      ...state,
      unsignedUserOperation: payload,
    }),
    clearTransactionState: (state) => ({
      ...state,
      typedDataRequest: undefined,
      signDataRequest: undefined,
      transactionRequest: undefined,
      transactionsRequest: undefined,
      modifiedTransactionsRequest: undefined,
      requestOrigin: undefined,
      userOperationRequest: undefined,
      unsignedUserOperation: undefined,
    }),
  },
});

export const {
  sendTransactionRequest,
  sendTransactionsRequest,
  setModifyTransactionsRequest,
  sendUserOperationRquest,
  setUnsignedUserOperation,
  clearTransactionState,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

export const sendTransaction = createBackgroundAsyncThunk(
  'transactions/sendTransaction',
  async ({ address, context }: { address: string; context?: any }, { dispatch, extra: { mainServiceManager } }) => {
    console.log('sendTransaction');
    const keyringService = mainServiceManager.getService(KeyringService.name) as KeyringService;

    const state = mainServiceManager.store.getState() as RootState;
    const unsignedUserOp = state.transactions.unsignedUserOperation;
    const origin = state.transactions.requestOrigin;

    if (unsignedUserOp) {
      console.log('userOp', unsignedUserOp);
      const signedUserOp = await keyringService.signUserOpWithContext(address, unsignedUserOp, context);
      const txnHash = keyringService.sendUserOp(address, signedUserOp);

      dispatch(clearTransactionState());

      const providerBridgeService = mainServiceManager.getService(ProviderBridgeService.name) as ProviderBridgeService;

      providerBridgeService.resolveRequest(origin || '', txnHash);
    }
  }
);

// creating user operation again with dookie paymaster info
// I had to have this code here and create user op again to access key rings
export const createUserOpWithDookies = createBackgroundAsyncThunk(
  'transactions/createUserOpWithDookies',
  async (address: string, { dispatch, extra: { mainServiceManager } }) => {
    console.log('createUserOpWithDookies');
    const keyringService = mainServiceManager.getService(KeyringService.name) as KeyringService;

    const state = mainServiceManager.store.getState() as RootState;
    const transactionRequest = state.transactions.transactionRequest;

    if (transactionRequest) {
      const userOp = await keyringService.createUnsignedUserOp(address, transactionRequest);

      const { paymasterAndData: paymasterAndDataWithBlankPaymasterSignature } = await fetch(
        'http://localhost:8001/prepare',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((data) => data.json());

      const preSignedUserOp = await keyringService.signUserOpWithContext(address, {
        ...userOp,
        paymasterAndData: paymasterAndDataWithBlankPaymasterSignature,
      });

      console.log('preSignedUserOp', preSignedUserOp);

      const { paymasterAndData: paymasterAndDataWithPaymasterSignature } = await fetch('http://localhost:8001/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userOp: {
            ...(await resolveProperties(preSignedUserOp)),
          },
        }),
      }).then((data) => data.json());

      const finalUserOp = { ...userOp, paymasterAndData: paymasterAndDataWithPaymasterSignature };
      console.log('finalUserOp', finalUserOp);

      dispatch(setUnsignedUserOperation(finalUserOp));
    }
  }
);

export const createUnsignedUserOp = createBackgroundAsyncThunk(
  'transactions/createUnsignedUserOp',
  async (address: string, { dispatch, extra: { mainServiceManager } }) => {
    const keyringService = mainServiceManager.getService(KeyringService.name) as KeyringService;

    const state = mainServiceManager.store.getState() as RootState;
    const transactionRequest = state.transactions.transactionRequest;

    if (transactionRequest) {
      const userOp = await keyringService.createUnsignedUserOp(address, transactionRequest);
      dispatch(setUnsignedUserOperation(userOp));
    }
  }
);

export const rejectTransaction = createBackgroundAsyncThunk(
  'transactions/rejectTransaction',
  async (address: string, { dispatch, extra: { mainServiceManager } }) => {
    dispatch(clearTransactionState());

    const requestOrigin = (mainServiceManager.store.getState() as RootState).transactions.requestOrigin;

    const providerBridgeService = mainServiceManager.getService(ProviderBridgeService.name) as ProviderBridgeService;

    providerBridgeService.rejectRequest(requestOrigin || '', '');
  }
);
