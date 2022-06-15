module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // this contract is upgradeable through uups (EIP-1822)
  await deploy('Greeter', {
    from: deployer,
    log: true,
    args: ['Hello!'],
  });
};

module.exports.tags = ['greeter'];
