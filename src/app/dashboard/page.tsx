import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Direct student to the comprehensive Exam Result Dashboard
  redirect('/tests/result/sample-attempt-1');
}
