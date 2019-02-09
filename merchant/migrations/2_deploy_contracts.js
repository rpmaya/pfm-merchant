var ConvertLib = artifacts.require('./ConvertLib.sol')
var Tokens = artifacts.require("./Tokens.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, Tokens)
  deployer.deploy(Tokens, 100000, "RicToken", "RIC")
}
