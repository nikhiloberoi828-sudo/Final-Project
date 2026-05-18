"use client";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AuthModal from "@/components/AuthModal";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AuthModalWrapper() {
  const { isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal } = useAuth();
  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      initialTab={authModalTab}
    />
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Navbar />
      <AuthModalWrapper />
      <main className="page-transition">{children}</main>
      <Footer />
      <BackToTop />
    </AuthProvider>
  );
}
