/**
 * Dashboard Page
 * Redirects to overview page
 */

import { redirect } from 'next/navigation';

export default function Dashboard() {
  redirect('/dashboard/overview');
}
