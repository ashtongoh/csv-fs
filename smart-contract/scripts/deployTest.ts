import { ethers } from "hardhat";
import { vars } from "hardhat/config";

async function main() {

  console.log("Deploying contract...");

  // Deploy contract
  const csvCoreContract = await ethers.deployContract("CsvCore");

  await csvCoreContract.waitForDeployment();

  console.log("Contract deployed to ", csvCoreContract.target);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
