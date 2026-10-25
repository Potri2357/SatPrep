import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

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
    <html lang="en" className={dmSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${dmSans.className} min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#2563EB] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
