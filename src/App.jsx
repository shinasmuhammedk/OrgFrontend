import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Canvas from "./Canvas";
import RunHistory from "./RunHistory";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes WITH Navbar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/run-history" element={<RunHistory />} />
          <Route path="/services" element={<Dashboard />} />
          <Route path="/graphql" element={<Dashboard />} />
          <Route path="/integrations" element={<Dashboard />} />
        </Route>

        {/* Routes WITHOUT Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;