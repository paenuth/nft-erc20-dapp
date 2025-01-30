import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;