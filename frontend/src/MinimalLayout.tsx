// MinimalLayout.tsx
import type { ReactNode } from 'react';


interface MinimalLayoutProps {
  children: ReactNode;
}

export const MinimalLayout = ({ children }: MinimalLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {children}
    </div>
  );
};