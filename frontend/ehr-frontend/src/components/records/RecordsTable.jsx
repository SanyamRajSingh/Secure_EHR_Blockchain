import { useState } from "react";

function RecordsTable({ records }) {

  const [search, setSearch] = useState("");

  const filtered = records.filter((r) =>
    r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    r.prescription.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-semibold">
          Medical Records
        </h2>

        <input
          type="text"
          placeholder="Search records..."
          className="border p-2 rounded text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <table className="w-full text-sm">

        <thead className="text-gray-500 border-b">

          <tr>
            <th className="text-left py-2">ID</th>
            <th className="text-left py-2">Patient</th>
            <th className="text-left py-2">Diagnosis</th>
            <th className="text-left py-2">Prescription</th>
            <th className="text-left py-2">Date</th>
          </tr>

        </thead>

        <tbody>

          {filtered.map((r) => (

            <tr key={r.record_id} className="border-b hover:bg-gray-50">

              <td className="py-2">
                #{r.record_id}
              </td>

              <td>
                {r.patient_id}
              </td>

              <td>
                {r.diagnosis}
              </td>

              <td>
                {r.prescription}
              </td>

              <td>
                {r.date}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RecordsTable;