// src/components/ProjectReports.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { FaChartLine, FaPlus, FaUser, FaCommentDots } from "react-icons/fa";

const ProjectReports = () => {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentModal, setCommentModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReport, setNewReport] = useState({
    project_id: "",
    progress: "",
    summary: "",
    blockers: "",
  });
  const [adminComment, setAdminComment] = useState("");

  useEffect(() => {
    fetchUserRoleAndData();
  }, []);

  const fetchUserRoleAndData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdminUser = data?.role === "admin";
    setIsAdmin(isAdminUser);

    await fetchProjects();
    await fetchReports(isAdminUser, user.id);
    setLoading(false);
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("id, title");
    setProjects(data || []);
  };

  const fetchReports = async (isAdminUser, uid) => {
    let query = supabase
      .from("project_reports")
      .select(`
        id,
        progress,
        summary,
        blockers,
        admin_comments,
        report_date,
        created_at,
        projects (title, tech_stack),
        profiles (full_name)
      `)
      .order("created_at", { ascending: false });

    if (!isAdminUser) query = query.eq("created_by", uid);

    const { data, error } = await query;
    if (!error) setReports(data || []);
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("project_reports").insert([
      {
        project_id: newReport.project_id,
        progress: newReport.progress,
        summary: newReport.summary,
        blockers: newReport.blockers,
        created_by: user?.id,
      },
    ]);

    if (error) {
      alert("Error creating report: " + error.message);
    } else {
      setShowModal(false);
      setNewReport({ project_id: "", progress: "", summary: "", blockers: "" });
      fetchReports(isAdmin, user.id);
    }
  };

  const handleAddComment = async (reportId) => {
    if (!adminComment.trim()) return alert("Please write a comment first.");

    const { error } = await supabase
      .from("project_reports")
      .update({ admin_comments: adminComment })
      .eq("id", reportId);

    if (error) {
      alert("Error adding comment: " + error.message);
    } else {
      setCommentModal(null);
      setAdminComment("");
      fetchReports(true, userId);
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine /> Project Reports
        </h1>

        {!isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl shadow-md hover:bg-green-700 transition-all"
          >
            <FaPlus /> Submit Report
          </motion.button>
        )}
      </div>

      {/* Reports */}
      {reports.length === 0 ? (
        <div className="text-center mt-20 text-gray-600">
          No reports yet.{" "}
          {isAdmin
            ? "Employees haven't submitted any reports yet."
            : "Submit your first progress report."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl border border-green-100"
              style={{
                backgroundImage: `url(${
                  r.projects?.tech_stack
                    ? `/tech-backgrounds/${r.projects.tech_stack.toLowerCase()}.jpg`
                    : "/tech-backgrounds/default.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-white/90 p-4 rounded-xl">
                <h2 className="text-xl font-semibold text-green-700 mb-1">
                  {r.projects?.title || "Untitled Project"}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  Progress:{" "}
                  <span className="font-bold text-green-700">
                    {r.progress || 0}%
                  </span>
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Summary:</strong> {r.summary || "No summary provided."}
                </p>
                {r.blockers && (
                  <p className="text-red-600 text-sm">
                    <strong>Blockers:</strong> {r.blockers}
                  </p>
                )}
                {r.admin_comments && (
                  <p className="text-blue-700 text-sm mt-2">
                    <strong>Admin Comment:</strong> {r.admin_comments}
                  </p>
                )}
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <p className="flex items-center gap-1">
                    <FaUser className="text-green-500" />{" "}
                    {r.profiles?.full_name || "Unknown"}
                  </p>
                  <p>
                    {r.report_date
                      ? new Date(r.report_date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCommentModal(r.id)}
                    className="mt-4 flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all"
                  >
                    <FaCommentDots /> Add Comment
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Employee Submit Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Submit Progress Report
            </h2>
            <form onSubmit={handleCreateReport} className="space-y-4">
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                value={newReport.project_id}
                onChange={(e) =>
                  setNewReport({ ...newReport, project_id: e.target.value })
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

              <input
                type="number"
                placeholder="Progress (%)"
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                value={newReport.progress}
                onChange={(e) =>
                  setNewReport({ ...newReport, progress: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Summary"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                value={newReport.summary}
                onChange={(e) =>
                  setNewReport({ ...newReport, summary: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Blockers (if any)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                value={newReport.blockers}
                onChange={(e) =>
                  setNewReport({ ...newReport, blockers: e.target.value })
                }
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Admin Comment Modal */}
      {commentModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Add Comment / Suggestion
            </h2>
            <textarea
              placeholder="Write your feedback or suggestions..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-green-400"
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCommentModal(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddComment(commentModal)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Save Comment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectReports;
