const { L2BridgeFactory } = require('@ericnordelo/cross-chain-bridge-helpers');
const { providers, BigNumber } = require('ethers');

const SenderArbitrumL1 = artifacts.require('SenderArbitrumL1');

async function main() {
  const deployment = await deployments.get('SenderArbitrumL1');
  const sender = await SenderArbitrumL1.at(deployment.address);
  const params = web3.eth.abi.encodeParameters(['string'], ['Hello Again!']);
  const greeter = '0x8A040481f58ff608d807BF9294d00B082E8DFA17';

  const ARBITRUM_L1_RPC = hre.config.networks.rinkeby.url;
  const ARBITRUM_L2_RPC = hre.config.networks.arbitrum.url;

  const l1Provider = new providers.JsonRpcProvider(ARBITRUM_L1_RPC);
  const l2Provider = new providers.JsonRpcProvider(ARBITRUM_L2_RPC);

  const bridge = L2BridgeFactory.get('Arbitrum-L1L2-Rinkeby');
  await bridge.loadProviders({ l1Provider, l2Provider });

  // function id plus encoded parameters
  const calldata = '0xa4136862' + params.slice(2);

  const crossChainTxParams = await bridge.getCrossChainTxConfigBytes(
    sender.address,
    greeter,
    calldata,
    BigNumber.from(0)
  );

  const tx = await sender.sendCrossChainMessage(greeter, calldata, crossChainTxParams, {
    gas: 20000000,
    value: '1747850031751',
  });

  console.log('Transaction sent: ' + tx.tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
