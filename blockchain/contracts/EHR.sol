// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EHR {

    struct Record {
        uint256 patientId;
        string recordHash;
        uint256 timestamp;
    }

    Record[] public records;

    event RecordStored(
        uint256 indexed recordId,
        uint256 indexed patientId,
        string recordHash,
        uint256 timestamp
    );

    function storeRecord(uint256 _patientId, string memory _recordHash) public {
        Record memory newRecord = Record({
            patientId: _patientId,
            recordHash: _recordHash,
            timestamp: block.timestamp
        });

        records.push(newRecord);

        emit RecordStored(
            records.length - 1,
            _patientId,
            _recordHash,
            block.timestamp
        );
    }

    function getRecord(uint256 _recordId)
        public
        view
        returns (uint256, string memory, uint256)
    {
        Record memory record = records[_recordId];
        return (
            record.patientId,
            record.recordHash,
            record.timestamp
        );
    }

    function getTotalRecords() public view returns (uint256) {
        return records.length;
    }
}
