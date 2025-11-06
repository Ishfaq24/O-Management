/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import Navbar from "./Navbar.jsx";
import { FaUsers, FaProjectDiagram, FaClipboardCheck, FaCalendarCheck } from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProjects: 0,
    todayAttendance: 0,
    totalAssignments: 0,
  });

  const [projects, setProjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [projectsMap, setProjectsMap] = useState({});

  useEffect(() => {
    fetchMappings();
    fetchStats();
    fetchProjects();
    fetchAttendance();
    fetchAssignments();
  }, []);

  const fetchMappings = async () => {
    const { data: users } = await supabase.from("profiles").select("id, full_name");
    const { data: projects } = await supabase.from("projects").select("id, title");

    setUsersMap(users.reduce((acc, u) => ({ ...acc, [u.id]: u.full_name || "User" }), {}));
    setProjectsMap(projects.reduce((acc, p) => ({ ...acc, [p.id]: p.title || "Project" }), {}));
  };

  const fetchStats = async () => {
    try {
      const { data: employees } = await supabase.from("profiles").select("id");
      const { data: projects } = await supabase.from("projects").select("id");
      const { data: attendanceToday } = await supabase
        .from("attendance")
        .select("id")
        .eq("date", new Date().toISOString().split("T")[0]);
      const { data: assignments } = await supabase.from("project_assignments").select("id");

      setStats({
        totalEmployees: employees.length,
        totalProjects: projects.length,
        todayAttendance: attendanceToday.length,
        totalAssignments: assignments.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (!error) setProjects(data);
  };

  const fetchAttendance = async () => {
    const { data, error } = await supabase.from("attendance").select("*");
    if (!error) setAttendance(data);
  };

  const fetchAssignments = async () => {
    const { data, error } = await supabase.from("project_assignments").select("*");
    if (!error) setAssignments(data);
  };

  const formatDate = (isoString) => new Date(isoString).toLocaleDateString();
  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-black-700">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 flex items-center space-x-4">
            <FaUsers className="text-green-500 text-3xl" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 flex items-center space-x-4">
            <FaProjectDiagram className="text-green-400 text-3xl" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProjects}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 flex items-center space-x-4">
            <FaCalendarCheck className="text-green-300 text-3xl" />
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Attendance</p>
              <p className="text-2xl font-bold text-gray-800">{stats.todayAttendance}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 flex items-center space-x-4">
            <FaClipboardCheck className="text-green-600 text-3xl" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalAssignments}</p>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Projects</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100 text-green-900">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Manager</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Start Date</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project, idx) => (
                  <tr key={project.id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3 font-medium">{project.title}</td>
                    <td className="px-4 py-3">{usersMap[project.manager_id]}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs ${
                          project.status === "completed"
                            ? "bg-green-500"
                            : project.status === "ongoing"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(project.start_date)}</td>
                    <td className="px-4 py-3">{formatDate(project.end_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Attendance Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Attendance</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100 text-green-900">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">User</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Check-in</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Check-out</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendance.map((att, idx) => (
                  <tr key={att.id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3">{usersMap[att.user_id]}</td>
                    <td className="px-4 py-3">{formatTime(att.check_in)}</td>
                    <td className="px-4 py-3">{formatTime(att.check_out)}</td>
                    <td className="px-4 py-3">{formatDate(att.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Assignments Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Project Assignments</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100 text-green-900">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Project</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">User</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignments.map((assn, idx) => (
                  <tr key={assn.id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3">{projectsMap[assn.project_id]}</td>
                    <td className="px-4 py-3">{usersMap[assn.user_id]}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs capitalize">
                        {assn.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
