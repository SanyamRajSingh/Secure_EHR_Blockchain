import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

const API = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Auth
export const login = (data) => API.post("/login", data);

// Patients
export const getPatients = () => API.get("/patients");
export const getPatientById = (id) => API.get(`/patients/${id}`);
export const addPatient = (data) => API.post("/patients", data);

// Doctors
export const getDoctors = () => API.get("/doctors");

// Medical Records
export const getAllRecords = () => API.get("/records");
export const getRecords = (patientId) => API.get(`/records/${patientId}`);
export const addRecord = (data) => API.post("/records", data);
export const verifyRecord = (recordId) => API.get(`/records/verify/${recordId}`);

// Blockchain
export const getBlockchain = () => API.get("/blockchain");

// Dashboard
export const getDashboard = () => API.get("/dashboard");

export default API;