// eslint-disable-next-line import/no-anonymous-default-export
// export default {
//   baseURI: 'http://localhost:8001/',
//   enablePasswordEncryption: false,
//   showTransactionConfirmationScreen: true,
//   factory_address: '0x9406cc6185a346906296840746125a0e44976454',
//   stateVersion: '0.1',
//   network: {
//     chainID: '31337',
//     family: 'EVM',
//     name: 'Localhost',
//     provider: 'http://127.0.0.1:8545/',
//     entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
//     bundler: 'http://localhost:3000/rpc',
//     baseAsset: {
//       symbol: 'ETH',
//       name: 'ETH',
//       decimals: 18,
//       image: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
//     },
//   },
// };

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  baseURI: 'https://dookies-wallet-backend.onrender.com/',
  enablePasswordEncryption: false,
  showTransactionConfirmationScreen: true,
  factory_address: '0x9406cc6185a346906296840746125a0e44976454',
  stateVersion: '0.1',
  network: {
    chainID: '80001',
    family: 'EVM',
    name: 'Polygon Mumbai',
    provider: 'https://polygon-mumbai.infura.io/v3/eedaad734dce46a4b08816a7f6df0b9b',
    entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    bundler: 'http://localhost:3002/rpc',
    baseAsset: {
      symbol: 'MATIC',
      name: 'MATIC',
      decimals: 18,
      image: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    },
  },
};
