import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

export const addRecord = (data) => API.post("/records", data);

export const getRecords = (patientId) =>
  API.get(`/records/${patientId}`);

export const verifyRecord = (recordId) =>
  API.get(`/records/verify/${recordId}`);

export default API;