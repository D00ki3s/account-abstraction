import React from 'react';
import { Box, Button, CardActions, CardContent, Link, Stack, Typography } from '@mui/material';
import logo from '../../../../assets/img/logo.svg';
import dookiesLogo from '../../../../assets/img/dookies_logo.jpeg';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} sx={{ height: '100%' }} justifyContent="center" alignItems="center">
      <Box
        component="span"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: 600,
          p: 2,
          border: '1px solid #d6d9dc',
          borderRadius: 5,
          background: 'white',
        }}
      >
        <CardContent>
          <Typography textAlign="center" variant="h3" gutterBottom>
            Dookies Wallet
          </Typography>
          <Typography textAlign="center" variant="body1" color="text.secondary">
            Gas free tx with privacy preserved personalized ad powered by Account Abstraction and Dookies.
            <Link href="https://github.com/D00ki3s/account-abstraction">learn more</Link>
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 5 }}>
            <img height={250} src={dookiesLogo} className="App-logo" alt="logo" />
          </Box>
          <Typography textAlign="center" sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Forked from Trampoline by Ethereum Foundation
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
            <img height={36} src={logo} className="App-logo" alt="logo" />
          </Box>
        </CardContent>
        <CardActions sx={{ pl: 4, pr: 4, width: '100%' }}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Button size="large" variant="contained" onClick={() => navigate('/accounts/new')}>
              Create/recover new account
            </Button>
          </Stack>
        </CardActions>
      </Box>
    </Stack>
  );
};

export default Intro;
