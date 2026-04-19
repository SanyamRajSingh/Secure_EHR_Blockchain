function HashComparison({ stored, recalculated, status }) {

  const match = stored === recalculated;

  return (
    <div className="mt-6 bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md">

      <h2 className="text-lg font-semibold mb-4">
        Hash Comparison
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-sm text-[color:var(--text-secondary)]">Stored Hash</p>
          <div className="font-mono text-xs bg-[color:var(--bg-secondary)] p-3 rounded">
            {stored}
          </div>
        </div>

        <div>
          <p className="text-sm text-[color:var(--text-secondary)]">Recalculated Hash</p>
          <div className="font-mono text-xs bg-[color:var(--bg-secondary)] p-3 rounded">
            {recalculated}
          </div>
        </div>

      </div>

      <div className="mt-6">

        {match ? (
          <div className="text-green-600 font-bold text-lg">
            ✔ Record Integrity Verified
          </div>
        ) : (
          <div className="text-red-600 font-bold text-lg">
            ✖ Data Tampering Detected
          </div>
        )}

      </div>

    </div>
  );
}

export default HashComparison;