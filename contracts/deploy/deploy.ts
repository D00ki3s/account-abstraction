import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { DeterministicDeployer } from "@account-abstraction/sdk";
import { DookiesPaymaster__factory } from "../typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const epAddr = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  // hardhat #1
  const sgAddr = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const dep = new DeterministicDeployer(ethers.provider);

  const paymasterDeploymentArgument = ethers.utils.defaultAbiCoder.encode(["address", "address"], [epAddr, sgAddr]);

  const paymasterDeploymentCode = ethers.utils.solidityPack(
    ["bytes", "address"],
    [DookiesPaymaster__factory.bytecode, paymasterDeploymentArgument]
  );

  const pmAddr = DeterministicDeployer.getAddress(paymasterDeploymentCode);
  if (await dep.isContractDeployed(pmAddr)) {
    console.log("Paymaster already deployed at", pmAddr);
  }

  await dep.deterministicDeploy(paymasterDeploymentCode);
  console.log("Paymaster Factory at", pmAddr);

  const paymasterContract = new ethers.Contract(pmAddr, DookiesPaymaster__factory.abi, ethers.provider);
  const deposit = await paymasterContract.getDeposit();
  if (deposit.lt(ethers.utils.parseEther("0.1"))) {
    console.log("paymaster deposit is less than 0.1");
    const tx = await paymasterContract.deposit({
      value: ethers.utils.parseEther("0.2"),
    });
    await tx.wait();
    console.log("depositted 0.2");
  } else {
    console.log("paymaster deposit is more than 0.1");
  }
};
export default func;
