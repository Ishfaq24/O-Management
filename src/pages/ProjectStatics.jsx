import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { FaProjectDiagram, FaUsers, FaTasks, FaCheckCircle } from "react-icons/fa";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const defaultProjects = [
  {
    id: "1",
    title: "Website Redesign",
    status: "active",
    tech_stack: "React",
    start_date: "2025-11-01",
    end_date: "2025-12-15",
  },
  {
    id: "2",
    title: "Mobile App",
    status: "completed",
    tech_stack: "Flutter",
    start_date: "2025-09-01",
    end_date: "2025-10-20",
  },
  {
    id: "3",
    title: "API Integration",
    status: "on-hold",
    tech_stack: "Node.js",
    start_date: "2025-10-05",
    end_date: "2025-11-30",
  },
];

const ProjectStatistics = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const isAdminUser = profile?.role === "admin";
    setIsAdmin(isAdminUser);

    const { data: projectsData } = await supabase
      .from("projects")
      .select("id, title, status, tech_stack, start_date, end_date");
    setProjects(projectsData?.length ? projectsData : defaultProjects);

    const { data: usersData } = await supabase.from("profiles").select("id, full_name");
    setUsers(usersData || []);

    const { data: assignmentsData } = await supabase
      .from("project_assignments")
      .select("id, project_id, user_id");
    setAssignments(assignmentsData || []);

    setLoading(false);
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  const visibleProjects = isAdmin
    ? projects
    : projects.filter((p) =>
        assignments.some((a) => a.project_id === p.id && a.user_id === userId)
      );

  const totalProjects = visibleProjects.length;
  const completedProjects = visibleProjects.filter((p) => p.status === "completed").length;
  const activeProjects = visibleProjects.filter((p) => p.status === "active").length;
  const onHoldProjects = visibleProjects.filter((p) => p.status === "on-hold").length;

  const statusPieData = {
    labels: ["Active", "Completed", "On Hold"],
    datasets: [
      {
        label: "Projects Status",
        data: [activeProjects, completedProjects, onHoldProjects],
        backgroundColor: ["#34D399", "#3B82F6", "#FBBF24"],
      },
    ],
  };

  const techStackCounts = visibleProjects.reduce((acc, p) => {
    if (p.tech_stack) acc[p.tech_stack] = (acc[p.tech_stack] || 0) + 1;
    else acc["N/A"] = (acc["N/A"] || 0) + 1;
    return acc;
  }, {});

  const techStackData = {
    labels: Object.keys(techStackCounts),
    datasets: [
      {
        label: "Tech Stack Usage",
        data: Object.values(techStackCounts),
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"],
      },
    ],
  };

  const employeeProjectCounts = users.map((u) => ({
    name: u.full_name,
    count: assignments.filter((a) => a.user_id === u.id).length,
  }));

  const employeeData = {
    labels: employeeProjectCounts.map((e) => e.name),
    datasets: [
      {
        label: "Projects Assigned",
        data: employeeProjectCounts.map((e) => e.count),
        backgroundColor: "#10B981",
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <h1 className="text-3xl font-bold text-black-700 mb-6">Project Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center border-l-4 border-green-500">
          <FaProjectDiagram className="text-4xl text-green-600 mb-2" />
          <p className="text-gray-500 text-sm">Total Projects</p>
          <p className="text-2xl font-bold">{totalProjects}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center border-l-4 border-green-400">
          <FaTasks className="text-4xl text-green-500 mb-2" />
          <p className="text-gray-500 text-sm">Active Projects</p>
          <p className="text-2xl font-bold">{activeProjects}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center border-l-4 border-blue-500">
          <FaCheckCircle className="text-4xl text-blue-500 mb-2" />
          <p className="text-gray-500 text-sm">Completed Projects</p>
          <p className="text-2xl font-bold">{completedProjects}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center border-l-4 border-yellow-400">
          <FaUsers className="text-4xl text-yellow-500 mb-2" />
          <p className="text-gray-500 text-sm">On Hold Projects</p>
          <p className="text-2xl font-bold">{onHoldProjects}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Project Status</h2>
          <Pie data={statusPieData} />
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Tech Stack Usage</h2>
          <Doughnut data={techStackData} />
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Employee Projects</h2>
          <Bar data={employeeData} />
        </motion.div>
      </div>

      {/* Project Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Projects Overview</h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3 border-b">Project</th>
              <th className="py-2 px-3 border-b">Status</th>
              <th className="py-2 px-3 border-b">Tech Stack</th>
              <th className="py-2 px-3 border-b">Start</th>
              <th className="py-2 px-3 border-b">End</th>
              {isAdmin && <th className="py-2 px-3 border-b">Assigned Employees</th>}
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((p) => {
              const assigned = assignments
                .filter((a) => a.project_id === p.id)
                .map((a) => users.find((u) => u.id === a.user_id)?.full_name)
                .join(", ");
              return (
                <tr key={p.id} className="hover:bg-green-50 transition-colors">
                  <td className="py-2 px-3 border-b font-medium">{p.title}</td>
                  <td className="py-2 px-3 border-b capitalize">{p.status}</td>
                  <td className="py-2 px-3 border-b">
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {p.tech_stack || "N/A"}
                    </span>
                  </td>
                  <td className="py-2 px-3 border-b">{p.start_date || "—"}</td>
                  <td className="py-2 px-3 border-b">{p.end_date || "—"}</td>
                  {isAdmin && <td className="py-2 px-3 border-b">{assigned || "—"}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectStatistics;
