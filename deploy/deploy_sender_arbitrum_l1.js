module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Arbitrum Bridge
  let bridge = '0x9a28e783c47bbeb813f32b861a431d0776681e95';

  // this is the Bridge address in Rinkeby
  await deploy('SenderArbitrumL1', {
    from: deployer,
    log: true,
    args: [bridge],
  });
};

module.exports.tags = ['sender_arbitrum_l1'];
