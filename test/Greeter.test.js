const { assert } = require('hardhat');

const Greeter = artifacts.require('Greeter');

contract('Greeter', function () {
  beforeEach(async () => {
    await deployments.fixture(['greeter']);
    let deployment = await deployments.get('Greeter');

    this.greeter = await Greeter.at(deployment.address);
  });

  it('should be deployed', async () => {
    assert.ok(this.greeter.address);
  });
});
