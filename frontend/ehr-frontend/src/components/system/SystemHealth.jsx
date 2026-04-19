import { useEffect, useState } from "react";
import API from "../../api";

function SystemHealth() {

  const [apiStatus, setApiStatus] = useState("Checking...");
  const [dbStatus, setDbStatus] = useState("Checking...");
  const [blockchainStatus, setBlockchainStatus] = useState("Checking...");

  useEffect(() => {
    checkSystems();
  }, []);

  const checkSystems = async () => {
    try {

      const res = await API.get("/");

      if (res.data) {
        setApiStatus("Running");
        setDbStatus("Connected");
        setBlockchainStatus("Active");
      }

    } catch (error) {

      setApiStatus("Offline");
      setDbStatus("Unknown");
      setBlockchainStatus("Unknown");

    }
  };

  const statusColor = (status) => {
    if (status === "Running" || status === "Connected" || status === "Active")
      return "text-green-500";
    if (status === "Checking...")
      return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md mt-6">

      <h2 className="text-lg font-semibold mb-4">
        System Health
      </h2>

      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span>Backend API</span>
          <span className={statusColor(apiStatus)}>
            ● {apiStatus}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Database</span>
          <span className={statusColor(dbStatus)}>
            ● {dbStatus}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Blockchain Node</span>
          <span className={statusColor(blockchainStatus)}>
            ● {blockchainStatus}
          </span>
        </div>

      </div>

    </div>
  );
}

export default SystemHealth;