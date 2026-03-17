import { useEffect, useState } from "react";
import axios from "axios";

import StatsCards from "../components/dashboard/StatsCards";
import RecordGrowthChart from "../components/dashboard/RecordGrowthChart";
import BlockchainActivity from "../components/dashboard/BlockchainActivity";
import BlockchainNetworkGraph from "../components/blockchain/BlockchainNetworkGraph";
import LiveTransactionFeed from "../components/blockchain/LiveTransactionFeed";

function Dashboard() {

  const [patients, setPatients] = useState(0);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:5000/dashboard"
      );

      setPatients(res.data.total_patients);
      setRecords(res.data.latest_records);

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        Secure EHR Dashboard
      </h1>

      <StatsCards
        patients={patients}
        records={records.length}
      />

      <RecordGrowthChart records={records} />

      <BlockchainActivity />

      <BlockchainNetworkGraph records={records} />

      <LiveTransactionFeed />

    </div>

  );
}

export default Dashboard;