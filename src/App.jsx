import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import { Layout as LayoutIcon } from "lucide-react";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Canvas from "./pages/Canvas";
import RunHistory from "./pages/RunHistory";
import Hero from "./pages/Hero";

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

          <Route path="/services" element={<Hero />} />
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