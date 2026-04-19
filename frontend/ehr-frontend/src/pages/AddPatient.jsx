import { useState } from "react";
import { addPatient, getPatients } from "../api";
import { useEffect } from "react";

function AddPatient() {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [gender,    setGender]    = useState("");
  const [phone,     setPhone]     = useState("");

  const [patients, setPatients] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [listLoad, setListLoad] = useState(true);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setListLoad(true);
    try {
      const res = await getPatients();
      setPatients(res.data.data || []);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setListLoad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim()) { setError("First name is required."); return; }
    if (!lastName.trim())  { setError("Last name is required.");  return; }
    if (!gender)           { setError("Please select a gender."); return; }

    setLoading(true);
    try {
      const res = await addPatient({
        first_name: firstName.trim(),
        last_name:  lastName.trim(),
        gender,
      });
      setSuccess(`Patient "${firstName} ${lastName}" created successfully (ID: ${res.data.data.patient_id}).`);
      setFirstName(""); setLastName(""); setGender(""); setPhone("");
      loadPatients();
    } catch (err) {
      const msg = err.response?.data?.error || "Error creating patient. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Patients</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Add Patient Form */}
        <form onSubmit={handleSubmit} className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-[color:var(--text-primary)] mb-2">Add New Patient</h2>

          {error   && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">First Name *</label>
            <input
              id="patient-first-name"
              type="text"
              placeholder="e.g. Amit"
              className="border p-2 w-full rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">Last Name *</label>
            <input
              id="patient-last-name"
              type="text"
              placeholder="e.g. Sharma"
              className="border p-2 w-full rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">Gender *</label>
            <select
              id="patient-gender"
              className="border p-2 w-full rounded"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            id="add-patient-submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner"></span> Creating Patient…
              </span>
            ) : "Create Patient"}
          </button>
        </form>

        {/* Patient Stats */}
        <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md flex flex-col justify-center items-center">
          <p className="text-[color:var(--text-secondary)] text-sm mb-1">Total Registered Patients</p>
          <p className="text-6xl font-bold text-blue-600">{patients.length}</p>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Patient List</h2>
          <input
            id="patient-search"
            type="text"
            placeholder="Search by name…"
            className="border p-2 rounded text-sm w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {listLoad ? (
          <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
            <span className="spinner"></span> Loading patients…
          </div>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No patients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[color:var(--text-secondary)] border-b bg-[color:var(--bg-secondary)]">
                <tr>
                  <th className="text-left py-2 px-3">ID</th>
                  <th className="text-left py-2 px-3">First Name</th>
                  <th className="text-left py-2 px-3">Last Name</th>
                  <th className="text-left py-2 px-3">Gender</th>
                  <th className="text-left py-2 px-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.patient_id} className="border-b hover:bg-[color:var(--bg-secondary)]">
                    <td className="py-2 px-3 text-[color:var(--text-secondary)]">#{p.patient_id}</td>
                    <td className="py-2 px-3 font-medium">{p.first_name}</td>
                    <td className="py-2 px-3">{p.last_name}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${p.gender === "Male"   ? "bg-blue-100 text-blue-700"   :
                          p.gender === "Female" ? "bg-pink-100 text-pink-700"   :
                                                  "bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)]"}`}>
                        {p.gender}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[color:var(--text-secondary)]">{p.phone_number || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPatient;