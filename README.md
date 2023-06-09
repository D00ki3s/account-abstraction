## Dookies - Account Abstraction

![key](./docs/key.png)

## How It Works

![how-it-works](./docs/how-it-works.png)

1. Dookie's Wallet obtains a zero-knowledge proof from cookies.
2. Receive personalized ads from the Ad Engine using the zero-knowledge proof.
3. Obtain the Paymaster's verification signature after viewing the ad.
4. The transaction is sponsored by Dookie's Paymaster.
5. The Paymaster's revenue is managed through the Dookie Ad system.

## How It Was Built

The development of the Dookie's Wallet began with the [Trampoline Wallet](https://github.com/eth-infinitism/trampoline) as our foundation.

We've opted for a customizable wallet over a basic SDK due to our need for a sophisticated gas sponsoring flow that maintains user privacy preferences.

The primary modifications we made revolved around the 'Create User Operation' process, which we restructured to include verification through Dookie's Paymaster.

### Call create custome userOp with Dookies

https://github.com/D00ki3s/account-abstraction/blob/main/wallet/src/pages/Popup/pages/sign-transaction-request/sign-transaction-request.tsx#L52

### Creating custome userOp with Dookies

https://github.com/D00ki3s/account-abstraction/blob/main/wallet/src/pages/Background/redux-slices/transactions.ts#L174

### Contracts

We are currently using Simple Account and verifying the Paymaster from [Infinitism Account Abstraction contract package](https://github.com/eth-infinitism/account-abstraction)

Contracts have been deployed on the Polygon Mumbai network.

https://mumbai.polygonscan.com/address/0x88c90fc6cf63ecfe0070ddc710a30a07547d62cc#code

### Tx

This is a working tx reference on Polygon Mumbai.

https://mumbai.polygonscan.com/tx/0x99d182888112e32c196513816774975818617234ba5843599158303a14df652e#eventlog

![tx](./docs/tx.png)

https://twitter.com/ookimaki_dev/status/1657690951458979842?s=20
