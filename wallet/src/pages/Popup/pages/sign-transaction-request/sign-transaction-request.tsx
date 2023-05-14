import { UserOperationStruct } from '@account-abstraction/contracts';
import { resolveProperties } from 'ethers/lib/utils';
import { Box, Button, Container, Paper, Stack, Grid, Typography } from '@mui/material';
import { ethers } from 'ethers';
import React, { useCallback, useState, useEffect } from 'react';
import { AccountImplementations, ActiveAccountImplementation } from '../../../App/constants';
import { useBackgroundDispatch, useBackgroundSelector } from '../../../App/hooks';
import { getAccountInfo, getActiveAccount } from '../../../Background/redux-slices/selectors/accountSelectors';
import { selectCurrentOriginPermission } from '../../../Background/redux-slices/selectors/dappPermissionSelectors';
import { getActiveNetwork } from '../../../Background/redux-slices/selectors/networkSelectors';
import {
  selectCurrentPendingSendTransactionRequest,
  selectCurrentPendingSendTransactionUserOp,
} from '../../../Background/redux-slices/selectors/transactionsSelectors';
import {
  createUnsignedUserOp,
  createUserOpWithDookies,
  rejectTransaction,
  sendTransaction,
  setUnsignedUserOperation,
} from '../../../Background/redux-slices/transactions';
import { EthersTransactionRequest } from '../../../Background/services/types';
import AccountInfo from '../../components/account-info';
import OriginInfo from '../../components/origin-info';
import Config from '../../../../exconfig';
import ad from '../../../../assets/img/ad.gif';
import CircularProgress from '@mui/material/CircularProgress';

const SignTransactionComponent = AccountImplementations[ActiveAccountImplementation].Transaction;

const SignTransactionConfirmation = ({
  activeNetwork,
  activeAccount,
  accountInfo,
  originPermission,
  transactions,
  userOp,
  onReject,
  onSend,
}: {
  activeNetwork: any;
  activeAccount: any;
  accountInfo: any;
  originPermission: any;
  transactions: EthersTransactionRequest[];
  userOp: UserOperationStruct;
  onReject: any;
  onSend: any;
}) => {
  const [showAddPaymasterUI, setShowAddPaymasterUI] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const backgroundDispatch = useBackgroundDispatch();

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const callCreateUserOpWithDookies = useCallback(async () => {
    setLoading(true);
    backgroundDispatch(createUserOpWithDookies(activeAccount));
    await wait(10000);
    setLoading(false);
  }, [backgroundDispatch, activeAccount]);

  useEffect(() => {
    callCreateUserOpWithDookies();
  }, []);

  return (
    <Container>
      <Box sx={{ p: 2 }}>
        <Typography textAlign="center" variant="h6">
          Send transaction request
        </Typography>
      </Box>
      {activeAccount && <AccountInfo activeAccount={activeAccount} accountInfo={accountInfo} />}
      <Stack spacing={2} sx={{ position: 'relative', pt: 2, mb: 4 }}>
        <Typography variant="h6" sx-={{ p: 2 }}>
          Watch Dookies Ad
        </Typography>
        {!showAddPaymasterUI && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">
              Personalized ads will be displayed based on privacy-preserved preferences with Dookies.
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ pt: 2 }}>
              <Button
                onClick={() => {
                  setShowAddPaymasterUI(true);
                }}
                variant="text"
              >
                Watch
              </Button>
            </Box>
          </Paper>
        )}
        {showAddPaymasterUI && (
          <Paper sx={{ p: 2 }}>
            <Grid container justifyContent="center">
              {/* replace with ad from ad engine */}

              <iframe src="http://localhost:3001/" width="300" height="300"></iframe>
              <Typography variant="body2" sx={{ fontSize: '0.8em', color: 'blue' }}>
                Ad from Dookie verified ad publisher
              </Typography>
            </Grid>
          </Paper>
        )}
        {/* <OriginInfo permission={originPermission} /> */}
        <Typography variant="h6" sx-={{ p: 2 }}>
          {transactions.length > 1 ? ' Transactions data' : 'Transaction data'}
        </Typography>
        <Stack spacing={2}>
          {transactions.map((transaction: EthersTransactionRequest, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                To:{' '}
                <Typography component="span" variant="body2">
                  {transaction.to}
                </Typography>
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Data:{' '}
                <Typography component="span" variant="body2">
                  {transaction.data?.toString()}
                </Typography>
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Value:{' '}
                <Typography component="span" variant="body2">
                  {transaction.value ? ethers.utils.formatEther(transaction.value) : 0} {activeNetwork.baseAsset.symbol}
                </Typography>
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
      <Paper
        elevation={3}
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
      >
        <Box justifyContent="space-around" alignItems="center" display="flex" sx={{ p: 2 }}>
          <Button sx={{ width: 150 }} variant="outlined" onClick={onReject}>
            Reject
          </Button>
          <Button
            sx={{ width: 150 }}
            variant="contained"
            onClick={() => onSend()}
            disabled={showAddPaymasterUI && loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

const SignTransactionRequest = () => {
  const [stage, setStage] = useState<'custom-account-screen' | 'sign-transaction-confirmation'>(
    'custom-account-screen'
  );

  const [context, setContext] = useState(null);

  const backgroundDispatch = useBackgroundDispatch();
  const activeAccount = useBackgroundSelector(getActiveAccount);
  const activeNetwork = useBackgroundSelector(getActiveNetwork);
  const accountInfo = useBackgroundSelector((state) => getAccountInfo(state, activeAccount));

  const sendTransactionRequest = useBackgroundSelector(selectCurrentPendingSendTransactionRequest);

  const pendingUserOp = useBackgroundSelector(selectCurrentPendingSendTransactionUserOp);

  const originPermission = useBackgroundSelector((state) =>
    selectCurrentOriginPermission(state, {
      origin: sendTransactionRequest?.origin || '',
      address: activeAccount || '',
    })
  );

  const onSend = useCallback(
    async (_context?: any) => {
      if (activeAccount)
        await backgroundDispatch(
          sendTransaction({
            address: activeAccount,
            context: _context || context,
          })
        );
      window.close();
    },
    [activeAccount, backgroundDispatch, context]
  );

  const onComplete = useCallback(
    async (modifiedTransaction: EthersTransactionRequest, context?: any) => {
      console.log('onComplete');
      if (activeAccount) {
        backgroundDispatch(createUnsignedUserOp(activeAccount));
        setContext(context);
        if (Config.showTransactionConfirmationScreen === false) {
          onSend(context);
        }
        setStage('sign-transaction-confirmation');
      }
    },
    [setContext, setStage, activeAccount, backgroundDispatch, onSend]
  );

  const onReject = useCallback(async () => {
    if (activeAccount) await backgroundDispatch(rejectTransaction(activeAccount));
    window.close();
  }, [backgroundDispatch, activeAccount]);

  if (stage === 'sign-transaction-confirmation' && pendingUserOp && sendTransactionRequest.transactionRequest)
    return (
      <SignTransactionConfirmation
        activeNetwork={activeNetwork}
        activeAccount={activeAccount}
        accountInfo={accountInfo}
        originPermission={originPermission}
        onReject={onReject}
        onSend={onSend}
        transactions={[sendTransactionRequest.transactionRequest]}
        userOp={pendingUserOp}
      />
    );

  return SignTransactionComponent && sendTransactionRequest.transactionRequest ? (
    <SignTransactionComponent
      onReject={onReject}
      transaction={sendTransactionRequest.transactionRequest}
      onComplete={onComplete}
    />
  ) : null;
};

export default SignTransactionRequest;
