import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy SimpleStorage
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy(42);
  await simpleStorage.waitForDeployment();
  console.log("SimpleStorage deployed to:", await simpleStorage.getAddress());

  // Deploy SimpleToken
  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const simpleToken = await SimpleToken.deploy("MyToken", "MTK", 18, 1000000);
  await simpleToken.waitForDeployment();
  console.log("SimpleToken deployed to:", await simpleToken.getAddress());

  // Deploy SimpleNFT
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const simpleNFT = await SimpleNFT.deploy("MyNFT", "MNFT");
  await simpleNFT.waitForDeployment();
  console.log("SimpleNFT deployed to:", await simpleNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});