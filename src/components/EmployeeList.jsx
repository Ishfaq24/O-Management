import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { FaSearch, FaUsers } from "react-icons/fa";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching employees:", error);
    else setEmployees(data || []);
    setLoading(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || emp.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br p-8 rounded-xl transition-all">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold mb-6 text-black-700 flex items-center gap-2">
          <FaUsers className="text-green-600" /> Employees
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or dept..."
              className="bg-white border border-gray-300 pl-10 pr-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
  className="bg-green-100 text-green-900 border border-green-300 px-3 py-2 rounded-xl 
             focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none 
             cursor-pointer shadow-sm hover:bg-green-200 transition-all duration-200"
  value={filterRole}
  onChange={(e) => setFilterRole(e.target.value)}
>
  <option value="all">All Roles</option>
  <option value="admin">Admin</option>
  <option value="manager">Manager</option>
  <option value="employee">Employee</option>
</select>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Avatar
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Department
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Phone
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Joined
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading employees...
                </td>
              </tr>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {emp.avatar_url ? (
                      <img
                        src={emp.avatar_url}
                        alt={emp.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-white font-semibold">
                        {emp.full_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {emp.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {emp.department || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : emp.role === "manager"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {emp.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(emp.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
