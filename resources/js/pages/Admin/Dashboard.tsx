import React from 'react';

import AdminLayout from '@/layouts/AdminLayout';



export default function Dashboard({ title }: { title: string }) {
  return (
    <AdminLayout title={title}>
      <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
      <p>Manage your site content from here.</p>
    </AdminLayout>
  );
}
