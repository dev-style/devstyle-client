"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRouteContent: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/admin/login"); // Redirect to login page if not authenticated
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Or any loading component
  }

  return session ? <>{children}</> : null;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <SessionProvider>
      <ProtectedRouteContent>{children}</ProtectedRouteContent>
    </SessionProvider>
  );
};

export default ProtectedRoute;
