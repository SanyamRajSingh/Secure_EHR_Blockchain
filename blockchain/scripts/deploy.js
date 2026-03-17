const hre = require("hardhat");

async function main() {
    const EHR = await hre.ethers.getContractFactory("EHR");

    const ehr = await EHR.deploy();

    await ehr.waitForDeployment();

    const address = await ehr.getAddress();
    console.log("✅ EHR contract deployed at:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
