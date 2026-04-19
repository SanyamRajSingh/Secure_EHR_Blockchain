import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AddPatient from "./pages/AddPatient";
import Dashboard from "./pages/Dashboard";
import AddRecord from "./pages/AddRecord";
import ViewRecords from "./pages/ViewRecords";
import VerifyRecord from "./pages/VerifyRecord";
import BlockchainLog from "./pages/BlockchainLog";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import GSAPWrapper from "./components/GSAPWrapper";

function Layout() {
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/signup"].includes(location.pathname);

  // Global FOUC Removal Guard - Fixes the Blue Screen Error natively
  useEffect(() => {
    const style = document.getElementById('page-transition-style');
    if (style) {
      style.remove();
    }
  }, [location.pathname]);

  if (isAuthPage) {
    return (
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    );
  }

  return (
    <GSAPWrapper>
      <div className="flex page-wrapper">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-[color:var(--bg-secondary)] min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <Navbar />
          <div className="p-6 flex-1">
            <Routes>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/add"         element={<AddRecord />} />
            <Route path="/records"     element={<ViewRecords />} />
            <Route path="/verify"      element={<VerifyRecord />} />
            <Route path="/add-patient" element={<AddPatient />} />
            <Route path="/blockchain"  element={<BlockchainLog />} />
          </Routes>
        </div>
      </div>
    </div>
    </GSAPWrapper>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;