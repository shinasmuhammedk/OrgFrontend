import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Canvas from "./Canvas";
import RunHistory from "./RunHistory";
import Layout from "./Layout";
import VerifyEmail from "./VerifyEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes WITHOUT Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Routes WITH Navbar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflows/:id/canvas" element={<Canvas />} />
          <Route path="/workflow-runs/:id" element={<RunHistory />} />

          <Route path="/services" element={<Dashboard />} />
          <Route path="/graphql" element={<Dashboard />} />
          <Route path="/integrations" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;