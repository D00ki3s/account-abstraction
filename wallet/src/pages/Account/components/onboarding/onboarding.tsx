import { Box, Button, CardActions, CardContent, Typography, Link } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { OnboardingComponent, OnboardingComponentProps } from '../types';

const Onboarding: OnboardingComponent = ({ onOnboardingComplete }: OnboardingComponentProps) => {
  return (
    <Box sx={{ padding: 2 }}>
      <CardContent>
        <Typography variant="h3" gutterBottom>
          Set Dookies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          With Dookies, you can establish a privacy-protected ad preference. This wallet then displays personalized ads
          based on your preferences. If you choose to watch an ad, the transaction is sponsored through an account
          abstraction paymaster.
          <br />
          <br />
          This process is optional and can be adjusted at any time.
          <br />
          <br />
          <Link href="https://github.com/D00ki3s/account-abstraction">Set Dookies</Link>
        </Typography>
      </CardContent>
      <CardActions sx={{ pl: 4, pr: 4, width: '100%' }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Button size="large" variant="contained" onClick={() => onOnboardingComplete()}>
            Continue
          </Button>
        </Stack>
      </CardActions>
    </Box>
  );
};

export default Onboarding;
