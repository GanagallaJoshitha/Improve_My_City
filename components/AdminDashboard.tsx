import React, { useMemo } from 'react';
import type { Complaint } from '../types';
import { StatCard } from './StatCard';
import { ComplaintList } from './ComplaintList';
import { ListBulletIcon } from './icons/ListBulletIcon';

interface AdminDashboardProps {
  complaints: Complaint[];
  onComplaintClick: (complaint: Complaint) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ complaints, onComplaintClick }) => {
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    return { total, pending, inProgress, resolved };
  }, [complaints]);

  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [complaints]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 h-full overflow-y-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of all civic issues.</p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reports" value={stats.total.toString()} />
        <StatCard title="Pending" value={stats.pending.toString()} />
        <StatCard title="In Progress" value={stats.inProgress.toString()} />
        <StatCard title="Resolved" value={stats.resolved.toString()} />
      </div>

      {/* Recent Complaints */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <ListBulletIcon className="w-6 h-6 mr-2 text-slate-500" />
            Recent Reports
        </h2>
        {recentComplaints.length > 0 ? (
            <ComplaintList complaints={recentComplaints} onComplaintClick={onComplaintClick} />
        ) : (
            <p className="text-slate-500 text-center py-4">No reports have been filed yet.</p>
        )}
      </div>
    </div>
  );
};
