const { L2Bridge } = require('@ericnordelo/cross-chain-bridge-helpers');
const { providers, BigNumber } = require('ethers');

const Sender = artifacts.require('Sender');

async function main() {
  const deployment = await deployments.get('Sender');
  const sender = await Sender.at(deployment.address);
  const params = web3.eth.abi.encodeParameters(['string'], ['Cross-Chain Hello!']);
  const greeter = '0xb14B7E8396Bdb536166CCe1C7D3F1e4475eE8918';

  const ARBITRUM_L1_RPC = hre.config.networks.rinkeby.url;
  const ARBITRUM_L2_RPC = hre.config.networks.arbitrum.url;

  const l1Provider = new providers.JsonRpcProvider(ARBITRUM_L1_RPC);
  const l2Provider = new providers.JsonRpcProvider(ARBITRUM_L2_RPC);

  const bridge = new L2Bridge('Arbitrum-L1L2-Rinkeby');
  await bridge.loadProviders({ l1Provider, l2Provider });

  // function id plus encoded parameters
  const calldata = '0xa4136862' + params.slice(2);

  const crossChainTxParams = await bridge.getCrossChainTxConfigBytes(
    sender.address,
    greeter,
    calldata,
    BigNumber.from(0)
  );

  const tx = await sender.sendCrossChainMessage(greeter, calldata, crossChainTxParams);

  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
