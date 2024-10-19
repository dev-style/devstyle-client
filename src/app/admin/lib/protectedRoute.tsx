"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRouteContent: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>; // Or your custom loading component
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
