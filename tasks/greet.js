task('greet', 'Gets the greet from the Greeter deployed in the selected network.').setAction(async (taskArgs) => {
  const greeter = await ethers.getContract('Greeter');

  const greet = await greeter.greet();

  console.log('The Greeter says: ' + greet);
});
