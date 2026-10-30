import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'SwS — Bank Exam Quant & Aptitude Test Platform',
  description: 'Exam-realistic Quantitative Aptitude and Data Interpretation test platform for IBPS, SBI, RBI, and RRB aspirants.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smqk74XYTSpenTM9c46Nd4P4MENT378229Uuo3mQUMU377"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${dmSans.className} min-h-screen bg-[#F7FDFF] text-[#0F172A] antialiased selection:bg-[#005CE6] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
