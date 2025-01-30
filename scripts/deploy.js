async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MyERC20 = await ethers.getContractFactory("MyERC20");
  const myERC20 = await MyERC20.deploy();
  await myERC20.waitForDeployment();
  console.log("MyERC20 deployed to:", myERC20.target);

  const NFTMinter = await ethers.getContractFactory("NFTMinter");
  const nftMinter = await NFTMinter.deploy(myERC20.target);
  await nftMinter.waitForDeployment();
  console.log("NFTMinter deployed to:", nftMinter.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });