import { Link, usePage, router, Head } from '@inertiajs/react';
import React from 'react';
type PageProps = {
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
};

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function AdminLayout({ title, children }: Props) {
  const { props } = usePage<PageProps>();
  const user = props.auth?.user;

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <div className="min-h-screen grid grid-cols-[200px_1fr]">
      <Head title={title ?? 'Admin'} />

      {/* Sidebar */}
      <aside className="p-4 border-r bg-gray-100 dark:bg-gray-900">
        <h2 className="font-bold text-lg mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <Link href={route('admin.dashboard')}>Dashboard</Link>
        </nav>
        <div className="mt-6">
          <p className="text-sm">Logged in as: {user?.name ?? 'Guest'}</p>
          <form onSubmit={handleLogout} className="mt-2">
            <button className="text-red-600">Logout</button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
