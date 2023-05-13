import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { DeterministicDeployer } from '@account-abstraction/sdk';
import { SimpleAccountFactory__factory } from '@account-abstraction/contracts';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const epAddr = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
  const dep = new DeterministicDeployer(ethers.provider);

  const factoryDeploymentArgument = ethers.utils.defaultAbiCoder.encode(['address'], [epAddr]);

  const factoryDeploymentCode = ethers.utils.solidityPack(
    ['bytes', 'address'],
    [SimpleAccountFactory__factory.bytecode, factoryDeploymentArgument]
  );

  const fAddr = DeterministicDeployer.getAddress(factoryDeploymentCode);
  if (await dep.isContractDeployed(fAddr)) {
    console.log('Factory already deployed at', fAddr);
  }

  await dep.deterministicDeploy(factoryDeploymentCode);
  console.log('Deployed Factory at', fAddr);
};
export default func;
