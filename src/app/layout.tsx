import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SatPrep — Bank Exam Quant & Aptitude Test Platform',
  description: 'Exam-realistic Quantitative Aptitude and Data Interpretation test platform for IBPS, SBI, RBI, and RRB aspirants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
