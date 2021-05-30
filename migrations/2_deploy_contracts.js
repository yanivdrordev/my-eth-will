var VaultFactory = artifacts.require('./VaultFactory.sol');

module.exports = function (deployer) {
  deployer.deploy(VaultFactory);
};
