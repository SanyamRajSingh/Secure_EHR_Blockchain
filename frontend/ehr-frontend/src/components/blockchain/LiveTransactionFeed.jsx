import { useEffect, useState } from "react";
import axios from "axios";

function BlockchainActivity() {

  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {

      const res = await axios.get(
        "http://127.0.0.1:5000/dashboard"
      );

      setRecords(res.data.latest_records);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">

      <h2 className="text-lg font-semibold mb-4">
        Blockchain Activity
      </h2>

      <table className="w-full text-sm">

        <thead className="text-gray-500">
          <tr>
            <th className="text-left py-2">Record</th>
            <th className="text-left py-2">Patient</th>
            <th className="text-left py-2">Hash</th>
          </tr>
        </thead>

        <tbody>

          {records.map((rec) => (

            <tr key={rec.record_id} className="border-t">

              <td className="py-2">
                #{rec.record_id}
              </td>

              <td>
                {rec.patient_id}
              </td>

              <td className="font-mono text-xs text-gray-600">
                {rec.block_hash
                  ? rec.block_hash.substring(0, 18) + "..."
                  : "Pending"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default BlockchainActivity;