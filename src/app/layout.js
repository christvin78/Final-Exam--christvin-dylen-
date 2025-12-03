// src/app/layout.js
"use client"; // Diperlukan karena menggunakan useGlobalContext

import { Inter } from 'next/font/google';
import AntdRegistry from './components/providers/AntdRegistry'; 
import { GlobalContextProvider, useGlobalContext } from './context/GlobalContext'; // Import useGlobalContext
import { ConfigProvider, theme as antdTheme } from 'antd'; // Import ConfigProvider dan antdTheme

const inter = Inter({ subsets: ['latin'] });

// --- Komponen yang Menggunakan Context ---
const ThemeWrapper = ({ children }) => {
  const { theme } = useGlobalContext();

  // Konfigurasi tema Ant Design
  const antdConfig = {
    algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
        colorPrimary: '#1890ff', // Warna utama yang bisa disesuaikan
    },
  };

  return (
    <ConfigProvider theme={antdConfig}>
      {/* Tambahkan class pada div agar CSS global bisa mengenali mode tema */}
      <div className={theme === 'dark' ? 'dark-mode' : 'light-mode'}>
        <main>{children}</main>
      </div>
    </ConfigProvider>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <GlobalContextProvider>
            <ThemeWrapper>{children}</ThemeWrapper>
          </GlobalContextProvider>
        </AntdRegistry>
        {/* CSS Sederhana untuk body saat Dark Mode (Hanya untuk latar belakang) */}
        <style jsx global>{`
          .dark-mode {
            background-color: #1f1f1f; /* Latar belakang gelap */
            color: #ffffff;
            min-height: 100vh;
          }
          .light-mode {
            background-color: #f0f2f5; /* Latar belakang terang Ant Design */
            color: #000000;
            min-height: 100vh;
          }
          .dark-mode h1, .dark-mode h2, .dark-mode p {
              color: inherit !important;
          }
        `}</style>
      </body>
    </html>
  );
}