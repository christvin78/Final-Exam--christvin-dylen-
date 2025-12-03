// src/context/GlobalContext.js
"use client";

import { createContext, useContext, useState, useEffect } from 'react'; // Tambahkan useEffect

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export function GlobalContextProvider({ children }) {
  // Ambil tema dari localStorage saat inisialisasi, default ke 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  
  const [selectedCategory, setSelectedCategory] = useState("");

  // Simpan tema ke localStorage setiap kali tema berubah
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Fungsi toggle tema
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    selectedCategory,
    setSelectedCategory,
    theme,
    setTheme,
    toggleTheme, // Export toggleTheme
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}