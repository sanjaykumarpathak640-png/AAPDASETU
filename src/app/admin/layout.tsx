import React from 'react';
import { AdminNavbar } from '@/components/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col bg-navy-950 text-slate-100">
      <AdminNavbar />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

