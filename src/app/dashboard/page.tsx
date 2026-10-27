import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Direct student to the Overall Exam Results Dashboard
  redirect('/results');
}
