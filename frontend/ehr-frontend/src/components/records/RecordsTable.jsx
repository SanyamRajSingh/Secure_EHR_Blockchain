import { useState } from "react";

function RecordsTable({ records }) {
  const [search, setSearch] = useState("");

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.diagnosis    || "").toLowerCase().includes(q) ||
      (r.prescription || "").toLowerCase().includes(q) ||
      (r.patient_name || "").toLowerCase().includes(q) ||
      (r.doctor_name  || "").toLowerCase().includes(q)
    );
  });

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Medical Records
          <span className="ml-2 text-sm text-[color:var(--text-secondary)] font-normal">({filtered.length} shown)</span>
        </h2>
        <input
          id="records-search"
          type="text"
          placeholder="Search diagnosis, patient, doctor…"
          className="border p-2 rounded text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[color:var(--text-secondary)] border-b bg-[color:var(--bg-secondary)]">
              <tr>
                <th className="text-left py-2 px-3">ID</th>
                <th className="text-left py-2 px-3">Patient</th>
                <th className="text-left py-2 px-3">Doctor</th>
                <th className="text-left py-2 px-3">Diagnosis</th>
                <th className="text-left py-2 px-3">Prescription</th>
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">TX ID</th>
                <th className="text-left py-2 px-3">Block Hash</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.record_id} className="border-b hover:bg-[color:var(--bg-secondary)]">
                  <td className="py-2 px-3 text-[color:var(--text-secondary)] font-mono text-xs">#{r.record_id}</td>
                  <td className="py-2 px-3 font-medium">{r.patient_name || `#${r.patient_id}`}</td>
                  <td className="py-2 px-3 text-[color:var(--text-secondary)]">{r.doctor_name || `#${r.doctor_id}`}</td>
                  <td className="py-2 px-3">{r.diagnosis}</td>
                  <td className="py-2 px-3 text-[color:var(--text-secondary)] max-w-[160px] truncate" title={r.prescription}>
                    {r.prescription}
                  </td>
                  <td className="py-2 px-3 text-[color:var(--text-secondary)] text-xs">{formatDate(r.date)}</td>
                  <td className="py-2 px-3 font-mono text-xs text-blue-600">
                    {r.tx_id ? `#${r.tx_id}` : <span className="text-yellow-500">Pending</span>}
                  </td>
                  <td className="py-2 px-3 font-mono text-xs text-[color:var(--text-secondary)]">
                    {r.block_hash
                      ? r.block_hash.substring(0, 16) + "…"
                      : <span className="text-yellow-500">Pending</span>}
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

export default RecordsTable;