/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";

const Toast = ({ message, type }) => (
  <div
    className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white text-sm font-medium
      animate-slide-in
      ${type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}
  >
    {message}
  </div>
);

const AttendanceList = ({ isAdmin }) => {
  const [attendance, setAttendance] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      const id = data.user?.id;
      if (!id) return;
      setUserId(id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (!profile) {
        await supabase
          .from("profiles")
          .insert([{ id, full_name: data.user.email }]);
      }
    } catch {
      showToast("Error fetching user", "error");
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name");
      if (error) throw error;
      setProfiles(data || []);
    } catch {
      showToast("Error fetching profiles", "error");
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

      let query = supabase
        .from("attendance")
        .select("*")
        .gte("check_in", start)
        .lte("check_in", end)
        .order("check_in", { ascending: false });

      if (!isAdmin && userId) query = query.eq("user_id", userId);

      const { data, error } = await query;
      if (error) throw error;

      setAttendance(
        data.map((att) => ({
          ...att,
          full_name: profiles.find((p) => p.id === att.user_id)?.full_name || "Unknown",
        }))
      );
    } catch {
      showToast("Error fetching attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (profiles.length && userId) fetchAttendance();
  }, [profiles, userId]);

  const handleCheckIn = async () => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];
    try {
      const { data: existing } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", userId)
        .gte("check_in", `${today}T00:00:00Z`)
        .lte("check_in", `${today}T23:59:59Z`)
        .maybeSingle();

      if (existing) return showToast("Already checked in today", "error");

      setLoading(true);
      await supabase.from("attendance").insert([
        { user_id: userId, check_in: new Date().toISOString(), note: note || null },
      ]);

      setNote("");
      fetchAttendance();
      showToast("Check-in successful");
    } catch {
      showToast("Check-in failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      setLoading(true);
      await supabase
        .from("attendance")
        .update({ check_out: new Date().toISOString() })
        .eq("id", id);

      fetchAttendance();
      showToast("Checked out successfully");
    } catch {
      showToast("Check-out failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {toast && <Toast {...toast} />}

      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
        <span className="text-sm text-gray-500">
          {new Date().toDateString()}
        </span>
      </header>

      {!isAdmin && (
        <div className="bg-gray-50 border rounded-xl p-4 space-y-3">
          <textarea
            placeholder="Optional note for today..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
          />
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            {loading ? "Processing..." : "Check In"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-800">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3">Date</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
              <th className="p-3">Note</th>
              {!isAdmin && <th className="p-3">Action</th>}
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No attendance records today
                </td>
              </tr>
            )}

            {attendance.map((att) => (
              <tr
                key={att.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">{att.full_name}</td>
                <td className="p-3">{new Date(att.check_in).toLocaleDateString()}</td>
                <td className="p-3">{new Date(att.check_in).toLocaleTimeString()}</td>
                <td className="p-3">
                  {att.check_out
                    ? new Date(att.check_out).toLocaleTimeString()
                    : "—"}
                </td>
                <td className="p-3 text-gray-600">{att.note || "—"}</td>

                {!isAdmin && att.check_in && !att.check_out && (
                  <td className="p-3">
                    <button
                      onClick={() => handleCheckOut(att.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg transition"
                    >
                      Check Out
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
