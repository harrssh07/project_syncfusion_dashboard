import React, { useMemo } from 'react';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const ActivityLogs = () => {
  const { activityLogs, logActivity } = useStateContext();
  React.useEffect(() => {
    logActivity('nav:visit', { page: 'activity-logs' });
  }, [logActivity]);
  const rows = useMemo(() => activityLogs.slice(0, 200), [activityLogs]);

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-2xl shadow-sm">
      <Header category="System" title="Activity Logs" />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Actor</th>
              <th className="py-2 pr-4">Action</th>
              <th className="py-2 pr-4">Meta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-gray-100 dark:border-zinc-800">
                <td className="py-2 pr-4 whitespace-nowrap">{new Date(e.time).toLocaleString()}</td>
                <td className="py-2 pr-4 capitalize">{e.actorRole}</td>
                <td className="py-2 pr-4">{e.action}</td>
                <td className="py-2 pr-4 text-xs text-gray-500">{JSON.stringify(e.meta)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="py-6 pr-4 text-gray-400" colSpan="4">No activity yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;
