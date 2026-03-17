import { useState } from "react";
import axios from "axios";

function VerifyRecord() {

  const [recordId, setRecordId] = useState("");
  const [result, setResult] = useState(null);

  const verifyRecord = async () => {

    try {

      const res = await axios.get(
        `http://127.0.0.1:5000/records/verify/${recordId}`
      );

      setResult(res.data);

    } catch (error) {

      alert("Record not found");

    }

  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Verify Record Integrity
      </h1>

      <input
        type="number"
        placeholder="Enter Record ID"
        className="border p-2 rounded mr-3"
        value={recordId}
        onChange={(e)=>setRecordId(e.target.value)}
      />

      <button
        onClick={verifyRecord}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Verify
      </button>

      {result && (

        <div className="mt-6 bg-white p-4 rounded shadow">

          <p>
            <b>Record ID:</b> {result.record_id}
          </p>

          <p className={result.status === "VALID"
            ? "text-green-600 font-bold"
            : "text-red-600 font-bold"
          }>
            Status: {result.status}
          </p>

          <p className="text-sm mt-3">
            <b>Stored Hash:</b><br/>
            {result.stored_hash}
          </p>

          <p className="text-sm mt-3">
            <b>Recalculated Hash:</b><br/>
            {result.recalculated_hash}
          </p>

        </div>

      )}

    </div>
  );
}

export default VerifyRecord;