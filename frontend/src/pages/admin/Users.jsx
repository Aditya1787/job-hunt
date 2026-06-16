import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiSearch, FiSliders, FiTrash2, FiUser, FiUnlock, FiLock, FiArrowLeft } from 'react-icons/fi';

const AdminUsers = () => {
  const { showToast } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?search=${search}&role=${role}&status=${status}&page=${page}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, status, page, search]);

  const handleToggleBlock = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle-block`);
      showToast(res.data.message || 'User status toggled', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this user? All associated postings, profile entries, and applications will be deleted.')) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      showToast(res.data.message || 'User deleted', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-6">
      
      <div>
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-655 dark:hover:text-white transition">
          <FiArrowLeft /> Back to Console
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">User Account Control</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor user logs, search emails, toggle blocks, or remove accounts.
        </p>
      </div>

      {/* Filters bar */}
      <div className="glass p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-30">
        
        {/* Name/Email search */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg">
          <FiSearch className="text-slate-400 w-4 h-4 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-800 dark:text-slate-250"
          />
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg">
          <FiSliders className="text-slate-400 w-4 h-4 flex-shrink-0" />
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1); }}
            className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-805 dark:text-slate-250"
          >
            <option value="">All Roles</option>
            <option value="candidate">Candidate</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg">
          <FiSliders className="text-slate-400 w-4 h-4 flex-shrink-0" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-805 dark:text-slate-250"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

      </div>

      {/* Users table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(x => <div key={x} className="h-20 rounded-2xl glass shimmer"></div>)}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 glass border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-sm font-medium">
          No users match your filters.
        </div>
      ) : (
        <div className="glass rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                    <td className="p-4 font-bold flex items-center gap-2">
                      <FiUser className="text-slate-400 w-4 h-4" /> {u.name}
                    </td>
                    <td className="p-4 text-slate-455">{u.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-primary/10 text-primary">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => handleToggleBlock(u._id)}
                        disabled={u.role === 'admin'}
                        className={`p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 transition ${
                          u.status === 'blocked' ? 'text-emerald-500 bg-emerald-500/5' : 'text-amber-500 bg-amber-500/5'
                        }`}
                        title={u.status === 'blocked' ? 'Unblock user' : 'Block user'}
                      >
                        {u.status === 'blocked' ? <FiUnlock className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={u.role === 'admin'}
                        className="p-2 rounded-lg border border-slate-202 dark:border-slate-800 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition disabled:opacity-50"
                        title="Delete permanently"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
