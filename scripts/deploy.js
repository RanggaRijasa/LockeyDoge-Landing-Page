const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  // Deploy MyToken contract
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  const LockeyDoge= await ethers.getContractFactory("LockeyDoge");
  // Pass correct arguments for the MyToken constructor
  const myToken = await LockeyDoge.deploy("LockeyDoge", "LDOGE", 18);
  console.log(`LockeyDoge deployed to: ${myToken.target}`);

  // Verify Deployer's Balance
  const balance = await myToken.balanceOf(deployer.address);
  console.log(`Deployer LDOGE Balance: ${ethers.formatUnits(balance, 18)} LDOGE`);

  // Write deployment info to .env file
  const envContent = `DEPLOYER_ADDRESS=${deployer.address}
MYTOKEN_ADDRESS=${myToken.target}
`;

  fs.writeFileSync(".env", envContent, { encoding: "utf8" });
  console.log("Deployment addresses saved to .env file.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});