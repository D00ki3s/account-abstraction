import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.12", settings: {} }, { version: "0.5.0" }],
  },
};

export default config;
