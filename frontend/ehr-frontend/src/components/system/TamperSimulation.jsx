import { useState } from "react";

function TamperSimulation() {

  const [status, setStatus] = useState("");

  const simulateTamper = () => {

    setStatus("Simulating data tampering...");

    setTimeout(() => {
      setStatus("Tampering detected! Blockchain hash mismatch.");
    }, 2000);

  };

  return (
    <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md mt-6">

      <h2 className="text-lg font-semibold mb-4">
        Tamper Simulation
      </h2>

      <p className="text-sm text-[color:var(--text-secondary)] mb-4">
        Demonstrate how blockchain detects unauthorized record changes.
      </p>

      <button
        onClick={simulateTamper}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
      >
        Simulate Tampering
      </button>

      {status && (
        <p className="mt-4 font-semibold text-red-600">
          {status}
        </p>
      )}

    </div>
  );
}

export default TamperSimulation;