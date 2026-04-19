import { useEffect, useState } from "react";
import { getBlockchain } from "../api";

function BlockchainLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [copied,  setCopied]  = useState(null);

  useEffect(() => {
    loadBlockchain();
  }, []);

  const loadBlockchain = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBlockchain();
      setEntries(res.data.data || []);
    } catch (err) {
      setError("Failed to load blockchain log.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyHash = (hash, txId) => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(txId);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toISOString().replace("T", " ").substring(0, 19);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Blockchain Transaction Log</h1>
      <p className="text-[color:var(--text-secondary)] mb-6 text-sm">
        Every medical record insert triggers an immutable blockchain entry.
      </p>

      {error && <div className="alert-error mb-4">{error}</div>}

      <div className="flex justify-end mb-4">
        <button
          onClick={loadBlockchain}
          className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
          <span className="spinner"></span> Loading blockchain log…
        </div>
      ) : entries.length === 0 ? (
        <p className="empty-state">No blockchain transactions recorded yet.</p>
      ) : (
        <div className="bg-[color:var(--bg-card)] rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--bg-secondary)] border-b">
              <tr>
                <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-semibold">TX ID</th>
                <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-semibold">Record ID</th>
                <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-semibold">Patient</th>
                <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-semibold">Block Hash</th>
                <th className="text-left py-3 px-4 text-[color:var(--text-secondary)] font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.tx_id} className="border-b hover:bg-[color:var(--bg-secondary)]">
                  <td className="py-3 px-4 font-mono text-[color:var(--text-secondary)]">#{entry.tx_id}</td>
                  <td className="py-3 px-4 font-mono text-blue-600">#{entry.record_id}</td>
                  <td className="py-3 px-4">
                    {entry.patient_name || `Patient #${entry.patient_id}`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[color:var(--text-secondary)] bg-[color:var(--bg-secondary)] px-2 py-1 rounded">
                        {entry.block_hash
                          ? entry.block_hash.substring(0, 16) + "…"
                          : "N/A"}
                      </span>
                      <button
                        onClick={() => copyHash(entry.block_hash, entry.tx_id)}
                        title="Copy full hash"
                        className="text-[color:var(--text-secondary)] hover:text-blue-600 transition text-xs"
                      >
                        {copied === entry.tx_id ? "✓ Copied" : "⧉ Copy"}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[color:var(--text-secondary)] text-xs font-mono">
                    {formatTimestamp(entry.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BlockchainLog;
