/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      showToast("Error fetching profiles", "error");
    }
  };

const fetchAttendance = async () => {
  setLoading(true);

  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let query = supabase
      .from("attendance")
      .select("*")
      .gte("check_in", `${today}T00:00:00Z`)
      .lte("check_in", `${today}T23:59:59Z`)
      .order("check_in", { ascending: false });

    // For regular users, filter by their userId
    if (!isAdmin && userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const mappedData = data.map((att) => {
      const profile = profiles.find((p) => p.id === att.user_id);
      return {
        ...att,
        full_name: profile?.full_name || "Unknown",
      };
    });

    setAttendance(mappedData);
  } catch (err) {
    console.error(err);
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
    if (profiles.length > 0 && userId) fetchAttendance();
  }, [profiles, userId]);

  const handleCheckIn = async () => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];

    try {
      const { data: existing, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", userId)
        .gte("check_in", `${today}T00:00:00Z`)
        .lte("check_in", `${today}T23:59:59Z`)
        .single();

      if (existing) return showToast("You have already checked in today!", "error");

      setLoading(true);
      const { error: insertError } = await supabase.from("attendance").insert([
        {
          user_id: userId,
          check_in: new Date().toISOString(),
          note: note || null,
        },
      ]);

      if (insertError) throw insertError;

      fetchAttendance();
      showToast("Checked in successfully!");
      setNote("");
    } catch (err) {
      console.error(err);
      showToast("Error during check-in", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("attendance")
        .update({ check_out: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      fetchAttendance();
      showToast("Checked out successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error during check-out", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <h2 className="text-3xl font-bold mb-6 text-green-600">Attendance Sheet</h2>

      {!isAdmin && (
        <div className="mb-6">
          <textarea
            placeholder="Optional note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-3 w-full mb-3 rounded focus:outline-green-500"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            >
              Check-In
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-green-600 font-semibold">Loading...</p>}

      <table className="w-full border-collapse border border-green-400 text-center">
        <thead>
          <tr className="bg-green-100">
            <th className="border p-2">Employee</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Check-In</th>
            <th className="border p-2">Check-Out</th>
            <th className="border p-2">Note</th>
            {!isAdmin && <th className="border p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {attendance.map((att) => (
            <tr key={att.id} className="hover:bg-green-50">
              <td className="border p-2">{att.full_name}</td>
              <td className="border p-2">{att.check_in ? new Date(att.check_in).toLocaleDateString() : "-"}</td>
              <td className="border p-2">{att.check_in ? new Date(att.check_in).toLocaleTimeString() : "-"}</td>
              <td className="border p-2">{att.check_out ? new Date(att.check_out).toLocaleTimeString() : "-"}</td>
              <td className="border p-2">{att.note || "-"}</td>
              {!isAdmin && att.check_in && !att.check_out && (
                <td className="border p-2">
                  <button
                    onClick={() => handleCheckOut(att.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Check-Out
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
