import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './context/ThemeContext';

// ✅ ADD THIS
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider>

      {/* ✅ GLOBAL TOAST CONTAINER */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#fff",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)"
          }
        }}
      />

      {/* ROUTES */}
      <RouterProvider router={router} />

    </ThemeProvider>
  );
}

export default App;
