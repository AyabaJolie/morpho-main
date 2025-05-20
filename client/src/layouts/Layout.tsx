import type { ReactNode } from 'react';
interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pb-20">
      {children}
      
    </div>
  );
}; 