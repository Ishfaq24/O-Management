import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaUser,
  FaProjectDiagram,
  FaCode,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const ProjectList = () => {
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [formData, setFormData] = useState({
    project_id: "",
    user_id: "",
    role: "",
  });

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech_stack: "",
    status: "active",
    start_date: "",
    end_date: "",
    background_url: "",
  });

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!error) {
        const isAdminUser = data?.role === "admin";
        setIsAdmin(isAdminUser);
        fetchProjects(isAdminUser);
        fetchAssignments();
        fetchUsers();
      }
    }
  };

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from("project_assignments")
      .select(`
        id,
        role,
        created_at,
        projects (id, title, description, tech_stack, status, start_date, end_date, background_url),
        profiles (id, full_name)
      `);
    if (!error) setAssignments(data || []);
    setLoading(false);
  };

  const fetchProjects = async (isAdminUser) => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, description, tech_stack, status, start_date, end_date, background_url");
    if (!error) {
      if (isAdminUser) setProjects(data || []);
      else {
        const assignedIds = assignments.map((a) => a.projects?.id);
        setProjects(data.filter((p) => assignedIds.includes(p.id)));
      }
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("id, full_name");
    if (!error) setUsers(data || []);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("project_assignments").insert([formData]);
    if (error) alert("Error assigning project: " + error.message);
    else {
      setShowAssignModal(false);
      setFormData({ project_id: "", user_id: "", role: "" });
      fetchAssignments();
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const bgImage =
      newProject.background_url ||
      `https://source.unsplash.com/800x600/?${encodeURIComponent(
        newProject.tech_stack || newProject.title || "project"
      )}`;
    const { error } = await supabase.from("projects").insert([
      {
        title: newProject.title,
        description: newProject.description,
        tech_stack: newProject.tech_stack,
        status: newProject.status,
        start_date: newProject.start_date || null,
        end_date: newProject.end_date || null,
        background_url: bgImage,
      },
    ]);
    if (error) alert("Error creating project: " + error.message);
    else {
      setShowCreateModal(false);
      setNewProject({
        title: "",
        description: "",
        tech_stack: "",
        status: "active",
        start_date: "",
        end_date: "",
        background_url: "",
      });
      fetchProjects(true);
    }
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setNewProject(project);
    setShowEditModal(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("projects")
      .update({
        title: newProject.title,
        description: newProject.description,
        tech_stack: newProject.tech_stack,
        status: newProject.status,
        start_date: newProject.start_date || null,
        end_date: newProject.end_date || null,
        background_url: newProject.background_url,
      })
      .eq("id", selectedProject.id);
    if (error) alert("Error updating project: " + error.message);
    else {
      setShowEditModal(false);
      fetchProjects(true);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) alert("Error deleting project: " + error.message);
    else fetchProjects(true);
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  const visibleProjects = isAdmin
    ? projects
    : assignments.map((a) => a.projects).filter(Boolean);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        {isAdmin && (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-xl shadow-md hover:bg-green-600 transition-all text-sm sm:text-base"
            >
              <FaCode /> <span className="hidden sm:inline">Create Project</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 bg-green-700 text-white px-3 sm:px-4 py-2 rounded-xl shadow-md hover:bg-green-800 transition-all text-sm sm:text-base"
            >
              <FaPlus /> <span className="hidden sm:inline">Assign Project</span>
            </motion.button>
          </div>
        )}
      </div>

      {visibleProjects.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-600 text-lg mb-3">
            No projects found. {isAdmin && "Start by creating one!"}
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {visibleProjects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all border border-green-100 relative"
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleEditProject(p)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
              <div
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    p.background_url ||
                    `https://source.unsplash.com/800x600/?${encodeURIComponent(
                      p.tech_stack || p.title || "project"
                    )}`
                  })`,
                }}
              ></div>
              <div className="p-5 bg-white">
                <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                  <FaProjectDiagram /> {p.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {p.description}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Tech Stack:</strong>{" "}
                  <span className="text-green-600">{p.tech_stack || "N/A"}</span>
                </p>
                <div className="mt-3 text-gray-700 text-sm">
                  <p>Status: <span className="font-medium text-green-600">{p.status}</span></p>
                  <p>Start: {p.start_date || "—"}</p>
                  <p>End: {p.end_date || "—"}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* === Assign Modal === */}
      {showAssignModal && (
        <Modal title="Assign Project" onClose={() => setShowAssignModal(false)}>
          <form onSubmit={handleAssign} className="space-y-4">
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={formData.project_id}
              onChange={(e) =>
                setFormData({ ...formData, project_id: e.target.value })
              }
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              required
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Role (e.g., Developer)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Assign
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* === Create & Edit Modal (shared form) === */}
      {(showCreateModal || showEditModal) && (
        <Modal
          title={showEditModal ? "Edit Project" : "Create New Project"}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
          }}
        >
          <form
            onSubmit={
              showEditModal ? handleUpdateProject : handleCreateProject
            }
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Project Title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Project Description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Tech Stack (e.g. React, Node.js, Supabase)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={newProject.tech_stack}
              onChange={(e) =>
                setNewProject({ ...newProject, tech_stack: e.target.value })
              }
              required
            />
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={newProject.status}
              onChange={(e) =>
                setNewProject({ ...newProject, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={newProject.start_date}
              onChange={(e) =>
                setNewProject({ ...newProject, start_date: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={newProject.end_date}
              onChange={(e) =>
                setNewProject({ ...newProject, end_date: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Custom Background Image URL (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={newProject.background_url}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  background_url: e.target.value,
                })
              }
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                {showEditModal ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// === Reusable Modal Component ===
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-3">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
      {children}
    </motion.div>
  </div>
);

export default ProjectList;
