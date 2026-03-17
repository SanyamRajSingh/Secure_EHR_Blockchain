const hre = require("hardhat");

async function main() {
    const patientId = process.env.PATIENT_ID;
    const recordHash = process.env.RECORD_HASH;

    if (!patientId || !recordHash) {
        console.error("Missing PATIENT_ID or RECORD_HASH");
        process.exit(1);
    }

    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const EHR = await hre.ethers.getContractFactory("EHR");
    const ehr = await EHR.attach(CONTRACT_ADDRESS);

    const tx = await ehr.storeRecord(patientId, recordHash);
    await tx.wait();

    console.log("BLOCKCHAIN_SUCCESS");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
