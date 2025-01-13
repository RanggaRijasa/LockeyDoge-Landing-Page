const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  // Deploy MyToken contract
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  const LockeyDoge = await ethers.getContractFactory("LockeyDoge");
  // Pass correct arguments for the MyToken constructor
  const lockeyDoge = await LockeyDoge.deploy("LockeyDoge", "LDOGE", 18);
  console.log(`LockeyDoge deployed to: ${lockeyDoge.target}`);

  // Deploy TokenSale contract
  const TokenSale = await ethers.getContractFactory("TokenSale");
  const tokenPrice = ethers.parseEther("1"); // in ETH
  const tokenSale = await TokenSale.deploy(lockeyDoge.target, tokenPrice);
  console.log(`LDOGE Sale deployed to: ${tokenSale.target}`);

  // Mint initial tokens to the TokenSale contract
  const mintAmount = ethers.parseUnits("1000000000000", 18);
  const tx = await lockeyDoge.mint(tokenSale.target, mintAmount);
  await tx.wait();
  console.log(`Seeded 1000000000000 tokens to LDOGE Sale contract: ${tokenSale.target}`);

  // Verify Deployer's Balance
  const balance = await lockeyDoge.balanceOf(deployer.address);
  console.log(`Deployer LDOGE Balance: ${ethers.formatUnits(balance, 18)} LDOGE`);

  // Write deployment info to .env file
  const envContent = `DEPLOYER_ADDRESS=${deployer.address}
MYTOKEN_ADDRESS=${lockeyDoge.target}
TOKENSALE_ADDRESS=${tokenSale.target}
`;

  fs.writeFileSync(".env", envContent, { encoding: "utf8" });
  console.log("Deployment addresses saved to .env file.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});