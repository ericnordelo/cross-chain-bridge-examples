module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // this is the Bridge address in Rinkeby
  await deploy('Sender', {
    from: deployer,
    log: true,
    args: ['0x9a28e783c47bbeb813f32b861a431d0776681e95'],
  });
};

module.exports.tags = ['sender'];
