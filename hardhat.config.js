require('dotenv').config();

require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-web3');
require('@nomiclabs/hardhat-truffle5');
require('hardhat-contract-sizer');
require('hardhat-deploy');
require('solidity-coverage');

const MNEMONIC = process.env.MNEMONIC;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const ALCHEMY_ARBITRUM_RPC = process.env.ALCHEMY_ARBITRUM_RPC;
const ALCHEMY_OPTIMISM_RPC = process.env.ALCHEMY_OPTIMISM_RPC;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
module.exports = {
  solidity: '0.8.11',
  networks: {
    hardhat: {
      tags: ['local'],
      allowUnlimitedContractSize: true,
    },
    arbitrum: {
      url: ALCHEMY_ARBITRUM_RPC,
      accounts: { mnemonic: MNEMONIC },
      companionNetworks: {
        l1: 'rinkeby',
      },
    },
    optimism: {
      url: ALCHEMY_OPTIMISM_RPC,
      ovm: true,
      companionNetworks: {
        l1: 'kovan',
      },
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
    },
  },
  namedAccounts: {
    deployer: 0,
    user: 1,
    bob: 2,
    alice: 3,
  },
};
