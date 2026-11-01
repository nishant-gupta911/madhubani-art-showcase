import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Studio Portal — Vernika Enterprises',
  description: 'Natasha Gupta Studio & Order Management Portal',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
