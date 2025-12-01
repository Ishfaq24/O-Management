// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabaseClient.js";

import Navbar from "./components/Navbar.jsx";
import Signup from "./components/Signup.jsx";
import Signin from "./components/Signin.jsx";
import Dashboard from "./components/Dashboard.jsx";
import EmployeeList from "./components/EmployeeList.jsx";
import ProjectList from "./components/ProjectList.jsx";
import ProjectReports from "./components/ProjectReports.jsx";
import ProjectStatistics from "./pages/ProjectStatics.jsx";
import ProductServices from "./pages/ProductServices.jsx";
import Attendance from "./components/AttendanceList.jsx";
import Notfound from "./pages/Notfound.jsx";
import NotificationList from "./components/NotificationList.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Hide navbar on signin & signup routes even if user is logged in
  const authRoutes = ["/signin", "/signup"];
  const shouldShowNavbar =
    session && !authRoutes.includes(location.pathname);

  return (
    <>
      {/* Navbar only on protected pages, not on signin/signup */}
      {shouldShowNavbar && <Navbar session={session} setSession={setSession} />}

      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={session ? <Dashboard /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/employees"
          element={session ? <EmployeeList /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/projects/overview"
          element={session ? <ProjectList /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/projects/reports"
          element={session ? <ProjectReports /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/projects/stats"
          element={session ? <ProjectStatistics /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/products"
          element={session ? <ProductServices /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/notifications"
          element={session ? <NotificationList /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/attendance"
          element={session ? <Attendance /> : <Navigate to="/signin" replace />}
        />

        {/* 404 Page */}
        <Route path="*" element={<Notfound />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
