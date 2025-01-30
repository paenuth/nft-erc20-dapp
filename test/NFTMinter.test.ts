import { expect } from "chai";
import { ethers } from "hardhat";
import type { MyERC20 } from "../types/contracts/MyERC20";
import type { NFTMinter } from "../types/contracts/NFTMinter";

describe("NFTMinter", function () {
  let erc20: MyERC20;
  let nftMinter: NFTMinter;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy ERC20
    const ERC20 = await ethers.getContractFactory("MyERC20");
    erc20 = (await ERC20.deploy()) as MyERC20;
    await erc20.waitForDeployment();

    // Deploy NFT Minter
    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    nftMinter = (await NFTMinterFactory.deploy(erc20.target)) as NFTMinter;
    await nftMinter.waitForDeployment();

    // Transfer ERC20 tokens from owner to user
    await erc20.transfer(user.address, ethers.parseUnits("1000", 18)); // Give user 1000 tokens
  });

  it("Should mint NFT with ERC20 payment", async function () {
    // Approve NFT contract to spend tokens
    await erc20.connect(user).approve(nftMinter.target, ethers.parseUnits("100", 18));

    // Check balances before mint
    const initialOwnerBalance = await erc20.balanceOf(owner.address);
    const initialUserBalance = await erc20.balanceOf(user.address);

    // Mint NFT
    await nftMinter.connect(user).mintNFT();

    // Check balances after mint
    const finalOwnerBalance = await erc20.balanceOf(owner.address);
    const finalUserBalance = await erc20.balanceOf(user.address);

    // Convert balances to BigInt
    const initialOwnerBalanceBN = BigInt(initialOwnerBalance.toString());
    const initialUserBalanceBN = BigInt(initialUserBalance.toString());
    const finalOwnerBalanceBN = BigInt(finalOwnerBalance.toString());
    const finalUserBalanceBN = BigInt(finalUserBalance.toString());

    // Owner should GAIN 100 tokens (from the mint)
    expect(finalOwnerBalanceBN).to.equal(initialOwnerBalanceBN + BigInt(ethers.parseUnits("100", 18).toString()));

    // User should LOSE 100 tokens (paid for minting)
    expect(initialUserBalanceBN - finalUserBalanceBN).to.equal(BigInt(ethers.parseUnits("100", 18).toString()));

    // Check NFT balance and ownership
    const userNFTBalance = await nftMinter.balanceOf(user.address);
    expect(BigInt(userNFTBalance.toString())).to.equal(BigInt(1));

    const userTokenId = await nftMinter.tokenOfOwnerByIndex(user.address, 0);
    expect(BigInt(userTokenId.toString())).to.equal(BigInt(0));
  });
});