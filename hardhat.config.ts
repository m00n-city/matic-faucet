import "dotenv/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-abi-exporter";

import { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";
import { Wallet } from "ethers";

const accounts = {
  mnemonic: process.env.MNEMONIC || "",
};

task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("caller-secret", "Prints the list of accounts", async (_args, hre) => {
  const wallet = Wallet.fromMnemonic(accounts.mnemonic);
  console.log(wallet.privateKey);
});

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts,
      chainId: 1337,
    },
    localhost: {
      accounts,
    },
    polygon: {
      url: `https://polygon-rpc.com/`,
      accounts,
      chainId: 137,
    },
    "polygon-mumbai": {
      url: `https://rpc-mumbai.maticvigil.com/v1/${process.env.RPC_KEY}`,
      accounts,
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  abiExporter: {
    path: "./src/abi",
    runOnCompile: true,
    clear: true,
    flat: true,
    spacing: 2,
    pretty: true,
  },
};

export default config;
