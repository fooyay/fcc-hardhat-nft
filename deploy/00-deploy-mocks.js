const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function (hre) {
    const { getNamedAccounts, deployments, network, ethers } = hre

    const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the premium. It costs 0.25 LINK per request
    const GAS_PRICE_LINK = 1e9 // LINK per gas. calculated value based on the gas price of the chain
    // Chainlink Nodes pay the gas fees to give us randomness and do external execution.

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        // deploy a mock vrfcoordinator...
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("Mocks Deployed!")
        log("----------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
