/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const Toast = ({ message, type }) => (
  <div
    className={`fixed top-5 right-5 px-4 py-2 rounded shadow-md text-white transition ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`}
  >
    {message}
  </div>
);

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch logged-in user
  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      const id = data.user?.id;
      if (!id) return;
      setUserId(id);
    } catch (err) {
      console.error(err);
      showToast("Error fetching user", "error");
    }
  };

  // Fetch notifications (assigned projects)
  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("project_assignments")
        .select(`
          id,
          role,
          created_at,
          projects (
            id,
            title,
            description,
            start_date,
            end_date,
            manager_id,
            created_at
          ),
          profiles (
            id,
            full_name
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map notifications to a user-friendly structure
      const mappedNotifications = data.map((n) => ({
        id: n.id,
        projectTitle: n.projects?.title || "Untitled Project",
        projectDescription: n.projects?.description || "-",
        startDate: n.projects?.start_date,
        endDate: n.projects?.end_date,
        assignedRole: n.role,
        managerName: n.profiles?.full_name || "Unknown",
        assignedAt: n.created_at,
      }));

      setNotifications(mappedNotifications);
    } catch (err) {
      console.error(err);
      showToast("Error fetching notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  return (
    <div className="p-6 bg-white rounded shadow-md min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <h2 className="text-3xl font-bold mb-6 text-emerald-900">Your Notifications</h2>

      {loading && <p className="text-black-600 font-semibold">Loading...</p>}

      {notifications.length === 0 && !loading && (
        <p className="text-gray-500">No assigned projects yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-blue-50 p-4 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-blue-700">{n.projectTitle}</h3>
            <p className="text-gray-700 mt-2">{n.projectDescription}</p>
            <div className="mt-3 text-gray-600 text-sm">
              <p>
                <strong>Role:</strong> {n.assignedRole}
              </p>
              <p>
                <strong>Manager:</strong> {n.managerName}
              </p>
              <p>
                <strong>Start:</strong> {n.startDate ? new Date(n.startDate).toLocaleDateString() : "-"} |{" "}
                <strong>End:</strong> {n.endDate ? new Date(n.endDate).toLocaleDateString() : "-"}
              </p>
              <p>
                <strong>Assigned At:</strong> {n.assignedAt ? new Date(n.assignedAt).toLocaleString() : "-"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
