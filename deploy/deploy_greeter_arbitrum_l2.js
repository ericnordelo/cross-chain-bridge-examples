module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // this contract is upgradeable through uups (EIP-1822)
  await deploy('GreeterArbitrumL2', {
    from: deployer,
    log: true,
    args: ['Hello!'],
  });
};

module.exports.tags = ['greeter_arbitrum_l2'];
