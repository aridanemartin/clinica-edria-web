import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "../components/NavBar/NavBar";
import { AuthProvider } from "@/contexts/AuthContext";
import StaffNavBar from "@/components/StaffNavBar";
import styles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clínica Edria",
  description: "Tu salud es nuestra prioridad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <NavBar />
          <StaffNavBar />
          <div className={styles.mainContent}>{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
