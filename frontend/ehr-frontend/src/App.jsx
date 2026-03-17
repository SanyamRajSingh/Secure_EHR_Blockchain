import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AddPatient from "./pages/AddPatient"
import Dashboard from "./pages/Dashboard";
import AddRecord from "./pages/AddRecord";
import ViewRecords from "./pages/ViewRecords";
import VerifyRecord from "./pages/VerifyRecord";

function App() {
  return (
    <BrowserRouter>

      <div className="flex">

        <Sidebar />

        <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">

          <Navbar />

          <div className="p-6 flex-1">

            <Routes>

              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddRecord />} />
              <Route path="/records" element={<ViewRecords />} />
              <Route path="/verify" element={<VerifyRecord />} />
              <Route path="/add-patient" element={<AddPatient />} />

            </Routes>

          </div>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;