import { useState } from "react";
import axios from "axios";
import RecordsTable from "../components/records/RecordsTable";

function ViewRecords() {

  const [patientId, setPatientId] = useState("");
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {

    try {

      const res = await axios.get(
        `http://127.0.0.1:5000/records/${patientId}`
      );

      setRecords(res.data);

    } catch (error) {

      alert("Error fetching records");

    }

  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        View Medical Records
      </h1>

      <div className="mb-4">

        <input
          type="number"
          placeholder="Enter Patient ID"
          className="border p-2 mr-2"
          value={patientId}
          onChange={(e)=>setPatientId(e.target.value)}
        />

        <button
          onClick={fetchRecords}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Fetch Records
        </button>

      </div>

      <RecordsTable records={records} />

    </div>
  );
}

export default ViewRecords;