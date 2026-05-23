import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Canvas from "./pages/Canvas";
import RunHistory from "./pages/RunHistory";
import Hero from "./pages/Hero";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Full-screen routes without Navbar */}
                <Route path="/workflows/:id/canvas" element={<Canvas />} />
                <Route path="/workflow-runs/:id" element={<RunHistory />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Routes with Navbar */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Hero />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/integrations" element={<Dashboard />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/services" element={<Hero />} />
                    <Route path="/graphql" element={<Dashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;