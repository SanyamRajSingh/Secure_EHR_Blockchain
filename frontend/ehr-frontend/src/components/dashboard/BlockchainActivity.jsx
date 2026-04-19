import { useEffect, useState } from "react";
import { getDashboard } from "../../api";

function BlockchainActivity() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const res = await getDashboard();
      setRecords(res.data?.data?.latest_records || []);
    } catch (err) {
      console.error("BlockchainActivity load error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-4">Recent Blockchain Activity</h2>

      {loading ? (
        <div className="flex items-center gap-2 text-[color:var(--text-secondary)] text-sm">
          <span className="spinner"></span> Loading…
        </div>
      ) : records.length === 0 ? (
        <p className="empty-state">No records yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-[color:var(--text-secondary)] border-b bg-[color:var(--bg-secondary)]">
            <tr>
              <th className="text-left py-2 px-2">Record</th>
              <th className="text-left py-2 px-2">Patient</th>
              <th className="text-left py-2 px-2">Diagnosis</th>
              <th className="text-left py-2 px-2">Hash</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.record_id} className="border-t hover:bg-[color:var(--bg-secondary)]">
                <td className="py-2 px-2 font-mono text-xs text-[color:var(--text-secondary)]">#{rec.record_id}</td>
                <td className="py-2 px-2">{rec.patient_name || `#${rec.patient_id}`}</td>
                <td className="py-2 px-2 text-[color:var(--text-secondary)]">{rec.diagnosis}</td>
                <td className="py-2 px-2 font-mono text-xs text-[color:var(--text-secondary)]">
                  {rec.block_hash
                    ? rec.block_hash.substring(0, 16) + "…"
                    : <span className="text-yellow-500">Pending</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BlockchainActivity;