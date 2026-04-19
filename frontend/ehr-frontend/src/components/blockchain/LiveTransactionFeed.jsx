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
      console.error("LiveTransactionFeed load error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-4">Live Transaction Feed</h2>

      {loading ? (
        <div className="flex items-center gap-2 text-[color:var(--text-secondary)] text-sm">
          <span className="spinner"></span> Loading…
        </div>
      ) : records.length === 0 ? (
        <p className="empty-state">No transactions yet.</p>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div key={rec.record_id} className="flex items-start gap-3 border-b pb-3 last:border-0">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[color:var(--text-primary)]">
                  {rec.patient_name || `Patient #${rec.patient_id}`}
                  <span className="text-[color:var(--text-secondary)] font-normal"> — {rec.diagnosis}</span>
                </p>
                <p className="font-mono text-xs text-[color:var(--text-secondary)] truncate">
                  {rec.block_hash || "Hash pending…"}
                </p>
              </div>
              <span className="text-xs text-[color:var(--text-secondary)] flex-shrink-0">#{rec.record_id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlockchainActivity;