import { useState } from "react";
import axios from "axios";

function AddRecord() {

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/records",
        {
          patient_id: patientId,
          doctor_id: doctorId,
          diagnosis: diagnosis,
          prescription: prescription
        }
      );

      setMessage(res.data.message);

      setPatientId("");
      setDoctorId("");
      setDiagnosis("");
      setPrescription("");

    } catch (error) {

      setMessage("Error adding record");

    }

  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Add Medical Record
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md space-y-4"
      >

        <input
          type="number"
          placeholder="Patient ID"
          className="border p-2 w-full"
          value={patientId}
          onChange={(e)=>setPatientId(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Doctor ID"
          className="border p-2 w-full"
          value={doctorId}
          onChange={(e)=>setDoctorId(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Diagnosis"
          className="border p-2 w-full"
          value={diagnosis}
          onChange={(e)=>setDiagnosis(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Prescription"
          className="border p-2 w-full"
          value={prescription}
          onChange={(e)=>setPrescription(e.target.value)}
          required
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Add Record
        </button>

      </form>

      {message && (
        <p className="mt-4 text-green-600 font-semibold">
          {message}
        </p>
      )}

    </div>
  );
}

export default AddRecord;