module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let bridge;
  if (network.name == 'rinkeby') {
    // Arbitrum Bridge
    bridge = '0x9a28e783c47bbeb813f32b861a431d0776681e95';
  } else if (network.name == 'kovan') {
    // Optimism L1StandardBridge
    bridge = '0x22F24361D548e5FaAfb36d1437839f080363982B';
  }

  // this is the Bridge address in Rinkeby
  await deploy('Sender', {
    from: deployer,
    log: true,
    args: [bridge],
  });
};

module.exports.tags = ['sender'];
