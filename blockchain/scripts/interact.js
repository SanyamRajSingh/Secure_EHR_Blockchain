const hre = require("hardhat");

async function main() {
    const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const EHR = await hre.ethers.getContractFactory("EHR");
    const ehr = await EHR.attach(CONTRACT_ADDRESS);

    // Multiple sample records (simulate DB entries)
    const records = [
        { patientId: 101, hash: "hash_record_1" },
        { patientId: 102, hash: "hash_record_2" },
        { patientId: 103, hash: "hash_record_3" }
    ];

    console.log("⛓️ Storing records on blockchain...\n");

    // Store records
    for (const rec of records) {
        const tx = await ehr.storeRecord(rec.patientId, rec.hash);
        await tx.wait();
        console.log(`✅ Stored record for patient ${rec.patientId}`);
    }

    // Get total records count
    const total = await ehr.getTotalRecords();
    console.log(`\n📊 Total records on blockchain: ${total.toString()}\n`);

    // Read all records
    for (let i = 0; i < total; i++) {
        const record = await ehr.getRecord(i);
        console.log(`📦 Record ID ${i}:`);
        console.log({
            patientId: record[0].toString(),
            recordHash: record[1],
            timestamp: record[2].toString()
        });
        console.log();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
