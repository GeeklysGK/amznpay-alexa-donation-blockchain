var AmazonPayDonation = artifacts.require("./AmazonPayDonation.sol");

module.exports = function(deployer) {
  deployer.deploy(AmazonPayDonation);
};
