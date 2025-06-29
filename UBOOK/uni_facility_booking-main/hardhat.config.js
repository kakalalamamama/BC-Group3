require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // <-- Add this line


/** @type import('hardhat/config').HardhatUserConfig */
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, // Replace with your actual Infura API key
      accounts: [SEPOLIA_PRIVATE_KEY], // Replace with your actual private keys
      chainId: 11155111, // Sepolia testnet chain ID
    },
  },
  etherscan: {
      apiKey: {
        sepolia: ETHERSCAN_API_KEY, // Replace with your actual Etherscan API key
      },
    },
  solidity: "0.8.28",
};
