// import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/types';

import '@nomiclabs/hardhat-etherscan';
import dotenv from 'dotenv';
dotenv.config();

let mnemonic = 'test '.repeat(11) + 'junk';
if (process.env.MNEMONIC) {
  mnemonic = process.env.MNEMONIC;
}

function getNetwork1(url: string): {
  url: string;
  accounts: { mnemonic: string };
} {
  return {
    url,
    accounts: { mnemonic },
  };
}

function getNetwork(name: string): {
  url: string;
  accounts: { mnemonic: string };
} {
  return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`);
  // return getNetwork1(`wss://${name}.infura.io/ws/v3/${process.env.INFURA_ID}`)
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{ version: '0.8.12', settings: {} }, { version: '0.5.0' }],
  },
  typechain: {
    outDir: 'src/pages/Account/account-api/typechain-types',
  },
  networks: {
    goerli: getNetwork('goerli'),
    mumbai: getNetwork('polygon-mumbai'),
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
