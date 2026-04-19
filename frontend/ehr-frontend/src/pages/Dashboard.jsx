import { useEffect, useState } from "react";
import { getDashboard } from "../api";
import StatsCards from "../components/dashboard/StatsCards";
import RecordGrowthChart from "../components/dashboard/RecordGrowthChart";
import BlockchainActivity from "../components/dashboard/BlockchainActivity";
import BlockchainNetworkGraph from "../components/blockchain/BlockchainNetworkGraph";
import LiveTransactionFeed from "../components/blockchain/LiveTransactionFeed";

function Dashboard() {
  const [stats, setStats]     = useState({ patients: 0, records: 0, doctors: 0 });
  const [records, setRecords] = useState([]);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDashboard();
      const d = res.data.data;
      setStats({
        patients: d.total_patients,
        records:  d.total_records,
        doctors:  d.total_doctors,
      });
      setRecords(d.latest_records || []);
    } catch (err) {
      setError("Failed to load dashboard data. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-[color:var(--bg-secondary)] min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-[color:var(--text-primary)]">Secure EHR Dashboard</h1>
      <p className="text-[color:var(--text-secondary)] mb-8">Blockchain-secured Electronic Health Records</p>

      {error && (
        <div className="alert-error mb-6">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-[color:var(--text-secondary)] mt-10">
          <span className="spinner"></span> Loading dashboard…
        </div>
      ) : (
        <>
          <StatsCards
            patients={stats.patients}
            records={stats.records}
            doctors={stats.doctors}
          />
          <RecordGrowthChart records={stats.records} />
          <BlockchainActivity />
          <BlockchainNetworkGraph records={records} />
          <LiveTransactionFeed />
        </>
      )}
    </div>
  );
}

export default Dashboard;