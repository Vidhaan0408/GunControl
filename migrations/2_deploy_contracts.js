const Guns = artifacts.require("Guns");

module.exports = function(deployer) {
  deployer.deploy(Guns);
};
