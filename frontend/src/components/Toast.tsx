import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#fff',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          padding: '16px 24px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            border: '1px solid rgba(16, 185, 129, 0.3)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        },
        loading: {
          iconTheme: {
            primary: '#06b6d4',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}