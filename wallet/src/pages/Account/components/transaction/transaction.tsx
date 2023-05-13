import { Button, CardActions, CardContent, CircularProgress, Stack, Typography, Box, Link } from '@mui/material';
import React from 'react';
import { TransactionComponentProps } from '../types';
import dookiesLogo from '../../../../assets/img/dookies_logo_2.jpeg';

const Transaction = ({ transaction, onComplete, onReject }: TransactionComponentProps) => {
  const [loader, setLoader] = React.useState<boolean>(false);

  return (
    <>
      <CardContent>
        <Typography variant="h3" gutterBottom>
          How Dookies Wallet works
        </Typography>
        <Typography variant="body1" color="text.secondary">
          On the next screen, you will have the option to enable gas sponsoring by watching a privacy-preserving
          personalized ad.
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
          <img height={250} src={dookiesLogo} className="App-logo" alt="logo" />
        </Box>
        <Typography variant="body1" textAlign="right">
          <Link href="https://github.com/D00ki3s/account-abstraction" target="_blank">
            learn more
          </Link>
        </Typography>
      </CardContent>
      <CardActions sx={{ width: '100%' }}>
        <Button
          sx={{ width: '95%' }}
          disabled={loader}
          size="large"
          variant="contained"
          onClick={() => {
            onComplete(transaction, undefined);
            setLoader(true);
          }}
        >
          Continue
        </Button>
      </CardActions>
    </>
  );
};

export default Transaction;
