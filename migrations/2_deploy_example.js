const Example = artifacts.require("Example");

const secretNumber = 666;

module.exports = function (deployer) {
  deployer.deploy(Example, secretNumber);
};
