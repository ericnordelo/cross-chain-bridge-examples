const { L2BridgeFactory } = require('@ericnordelo/cross-chain-bridge-helpers');
const { providers, BigNumber } = require('ethers');

const SenderOptimismL1 = artifacts.require('SenderOptimismL1');

async function main() {
  const deployment = await deployments.get('SenderOptimismL1');
  const sender = await SenderOptimismL1.at(deployment.address);
  const greeter = '0x8A040481f58ff608d807BF9294d00B082E8DFA17';

  const OPTIMISM_L1_RPC = hre.config.networks.kovan.url;
  const OPTIMISM_L2_RPC = hre.config.networks.optimism.url;

  const l1Provider = new providers.JsonRpcProvider(OPTIMISM_L1_RPC);
  const l2Provider = new providers.JsonRpcProvider(OPTIMISM_L2_RPC);

  const bridge = L2BridgeFactory.get('Optimism-L1L2-Kovan');
  await bridge.loadProviders({ l1Provider, l2Provider });

  const calldata = '0x';

  const crossChainTxParams = await bridge.getCrossChainTxConfigBytes(
    sender.address,
    greeter,
    calldata,
    BigNumber.from(100)
  );

  const tx = await sender.sendCrossChainMessage(greeter, calldata, crossChainTxParams, {
    value: 100,
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
