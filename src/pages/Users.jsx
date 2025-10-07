import React, { useMemo, useState } from 'react';
import { Header, RoleGuard } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const seedUsers = [
  { id: 'u1', name: 'Michael Brown', email: 'michael@example.com', role: 'admin', status: 'active' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'manager', status: 'active' },
  { id: 'u3', name: 'John Lee', email: 'john@example.com', role: 'viewer', status: 'suspended' },
];

const Users = () => {
  const { currentColor, logActivity } = useStateContext();
  const [users, setUsers] = useState(() => seedUsers);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, query]);

  React.useEffect(() => {
    logActivity('nav:visit', { page: 'users' });
  }, [logActivity]);

  const onAdd = () => {
    const id = `u${Date.now()}`;
    const newUser = { id, name: 'New User', email: `user${users.length + 1}@example.com`, role: 'viewer', status: 'active' };
    setUsers((prev) => [newUser, ...prev]);
    logActivity('users:add', { id });
  };

  const onDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    logActivity('users:delete', { id });
  };

  const onPromote = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: u.role === 'viewer' ? 'manager' : 'admin' } : u)));
    logActivity('users:promote', { id });
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-2xl shadow-sm">
      <Header category="Admin" title="Users" />
      <RoleGuard allow={['admin']} fallback={<p className="text-red-500">Only admins can manage users.</p>}>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name, email, or role"
          aria-label="Search users"
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/60 focus:outline-none focus:ring-2"
          style={{ outlineColor: currentColor }}
        />
        <button
          type="button"
          onClick={onAdd}
          className="px-4 py-2 rounded-lg text-white shadow hover:shadow-md"
          style={{ backgroundColor: currentColor }}
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-gray-100 dark:border-zinc-800">
                <td className="py-2 pr-4">{u.name}</td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4 capitalize">{u.role}</td>
                <td className="py-2 pr-4 capitalize">{u.status}</td>
                <td className="py-2 pr-4">
                  <div className="flex gap-2">
                    <button type="button" aria-label={`Promote ${u.name}`} onClick={() => onPromote(u.id)} className="px-3 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700">Promote</button>
                    <button type="button" aria-label={`Delete ${u.name}`} onClick={() => onDelete(u.id)} className="px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </RoleGuard>
    </div>
  );
};

export default Users;
