import { useEffect, useState } from "react";
import { getAllRecords, getPatients } from "../api";
import RecordsTable from "../components/records/RecordsTable";

function ViewRecords() {
  const [records,  setRecords]  = useState([]);
  const [patients, setPatients] = useState([]);
  const [filter,   setFilter]   = useState("all");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [rRes, pRes] = await Promise.all([getAllRecords(), getPatients()]);
      setRecords(rRes.data.data  || []);
      setPatients(pRes.data.data || []);
    } catch (err) {
      setError("Failed to load records. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "all"
    ? records
    : records.filter((r) => String(r.patient_id) === String(filter));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Medical Records</h1>

      {error && <div className="alert-error mb-4">{error}</div>}

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-[color:var(--text-primary)]">Filter by Patient:</label>
        <select
          id="records-patient-filter"
          className="border p-2 rounded text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Patients</option>
          {patients.map((p) => (
            <option key={p.patient_id} value={p.patient_id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>

        <button
          onClick={loadData}
          className="ml-auto bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
          <span className="spinner"></span> Loading records…
        </div>
      ) : (
        <RecordsTable records={filtered} />
      )}
    </div>
  );
}

export default ViewRecords;