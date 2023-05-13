import { Button, CardActions, CardContent, CircularProgress, Stack, Typography, Box } from '@mui/material';
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
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
            <img height={250} src={dookiesLogo} className="App-logo" alt="logo" />
          </Box>
        </Typography>
      </CardContent>
      <CardActions sx={{ pl: 2, pr: 2, width: '100%' }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Button
            disabled={loader}
            size="large"
            variant="contained"
            onClick={() => {
              onComplete(transaction, undefined);
              setLoader(true);
            }}
          >
            Continue
            {loader && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Button>
        </Stack>
      </CardActions>
    </>
  );
};

export default Transaction;
