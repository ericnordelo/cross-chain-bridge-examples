module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Optimism L1StandardBridge
  let bridge = '0x22F24361D548e5FaAfb36d1437839f080363982B';

  // this is the Bridge address in Rinkeby
  await deploy('SenderOptimismL1', {
    from: deployer,
    log: true,
    args: [bridge],
  });
};

module.exports.tags = ['sender_optimism_l1'];
