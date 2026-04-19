import { useState, useEffect } from "react";
import { addRecord, getPatients, getDoctors, getAllRecords } from "../api";
import RecordsTable from "../components/records/RecordsTable";

function AddRecord() {
  const [patientId,    setPatientId]    = useState("");
  const [doctorId,     setDoctorId]     = useState("");
  const [diagnosis,    setDiagnosis]    = useState("");
  const [prescription, setPrescription] = useState("");
  const [date,         setDate]         = useState(new Date().toISOString().split("T")[0]);

  const [patients,  setPatients]  = useState([]);
  const [doctors,   setDoctors]   = useState([]);
  const [records,   setRecords]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [fetchLoad, setFetchLoad] = useState(true);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");

  useEffect(() => {
    loadDropdowns();
    loadRecords();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [pRes, dRes] = await Promise.all([getPatients(), getDoctors()]);
      setPatients(pRes.data.data || []);
      setDoctors(dRes.data.data  || []);
    } catch (err) {
      console.error("Failed to load dropdowns:", err);
    }
  };

  const loadRecords = async () => {
    setFetchLoad(true);
    try {
      const res = await getAllRecords();
      setRecords(res.data.data || []);
    } catch (err) {
      console.error("Failed to load records:", err);
    } finally {
      setFetchLoad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!patientId) { setError("Please select a patient.");   return; }
    if (!doctorId)  { setError("Please select a doctor.");    return; }
    if (!diagnosis.trim()) { setError("Diagnosis is required."); return; }
    if (!prescription.trim()) { setError("Prescription is required."); return; }

    setLoading(true);
    try {
      await addRecord({
        patient_id:   parseInt(patientId),
        doctor_id:    parseInt(doctorId),
        diagnosis:    diagnosis.trim(),
        prescription: prescription.trim(),
        date,
      });
      setSuccess("Record added and blockchain entry created.");
      setPatientId(""); setDoctorId(""); setDiagnosis(""); setPrescription("");
      setDate(new Date().toISOString().split("T")[0]);
      loadRecords();
    } catch (err) {
      const msg = err.response?.data?.error || "Error adding record. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add Medical Record</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md space-y-4">

          {error   && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">Patient *</label>
            <select
              id="record-patient-select"
              className="border p-2 w-full rounded"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.first_name} {p.last_name} (ID: {p.patient_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">Doctor *</label>
            <select
              id="record-doctor-select"
              className="border p-2 w-full rounded"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map((d) => (
                <option key={d.doctor_id} value={d.doctor_id}>
                  Dr. {d.first_name} {d.last_name}
                  {d.specialization ? ` — ${d.specialization}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">Diagnosis *</label>
            <input
              id="record-diagnosis"
              type="text"
              placeholder="e.g. Hypertension"
              className="border p-2 w-full rounded"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">Prescription *</label>
            <textarea
              id="record-prescription"
              rows={3}
              placeholder="e.g. Amlodipine 5mg daily"
              className="border p-2 w-full rounded"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">Date</label>
            <input
              id="record-date"
              type="date"
              className="border p-2 w-full rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            id="add-record-submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner"></span> Adding Record…
              </span>
            ) : "Add Record"}
          </button>
        </form>

        {/* Info panel */}
        <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-[color:var(--text-primary)]">How It Works</h2>
          <ul className="text-sm text-[color:var(--text-secondary)] space-y-2 list-disc list-inside">
            <li>Each record is stored in the MySQL database</li>
            <li>A SHA-256 blockchain hash is auto-generated via a DB trigger</li>
            <li>The record and its hash are permanently linked</li>
            <li>Any tampering with the record can be detected on the Verify page</li>
          </ul>
        </div>
      </div>

      {/* Records Table */}
      <h2 className="text-2xl font-bold mb-4">All Medical Records</h2>
      {fetchLoad ? (
        <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
          <span className="spinner"></span> Loading records…
        </div>
      ) : (
        <RecordsTable records={records} />
      )}
    </div>
  );
}

export default AddRecord;