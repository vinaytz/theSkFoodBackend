import React from 'react';
import Header from './Header';
import Cart from '@/features/cart/Cart';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
      <Cart />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Layout;