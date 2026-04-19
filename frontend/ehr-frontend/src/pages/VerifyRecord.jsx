import { useState } from "react";
import { verifyRecord } from "../api";

function VerifyRecord() {
  const [recordId, setRecordId] = useState("");
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleVerify = async () => {
    setError("");
    setResult(null);

    if (!recordId || isNaN(parseInt(recordId))) {
      setError("Please enter a valid numeric Record ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyRecord(parseInt(recordId));
      setResult(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.error || "Record not found or backend error.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Verify Record Integrity</h1>
      <p className="text-[color:var(--text-secondary)] mb-6 text-sm">
        Enter a medical record ID to verify that it has not been tampered with.
      </p>

      <div className="flex gap-3 mb-6">
        <input
          id="verify-record-id"
          type="number"
          placeholder="Enter Record ID"
          className="border p-2 rounded flex-1"
          value={recordId}
          onChange={(e) => setRecordId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />
        <button
          id="verify-submit"
          onClick={handleVerify}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner"></span> Verifying…
            </span>
          ) : "Verify"}
        </button>
      </div>

      {error && <div className="alert-error mb-4">{error}</div>}

      {result && (
        <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{result.status === "VALID" ? "✅" : "⚠️"}</span>
            <div>
              <p className="text-sm text-[color:var(--text-secondary)]">Record #{result.record_id}</p>
              <p className={`text-xl font-bold ${result.status === "VALID" ? "text-green-600" : "text-red-600"}`}>
                {result.status === "VALID" ? "Record is VALID" : "Record has been TAMPERED"}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] font-semibold uppercase tracking-wide">Transaction ID</p>
              <p className="text-sm text-[color:var(--text-primary)] font-mono">#{result.tx_id}</p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] font-semibold uppercase tracking-wide">Blockchain Timestamp</p>
              <p className="text-sm text-[color:var(--text-primary)]">{result.timestamp}</p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] font-semibold uppercase tracking-wide">Stored Hash</p>
              <p className="font-mono text-xs text-[color:var(--text-secondary)] break-all bg-[color:var(--bg-secondary)] p-2 rounded border">{result.stored_hash}</p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] font-semibold uppercase tracking-wide">Recalculated Hash</p>
              <p className={`font-mono text-xs break-all p-2 rounded border ${
                result.status === "VALID"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>{result.recalculated_hash}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyRecord;