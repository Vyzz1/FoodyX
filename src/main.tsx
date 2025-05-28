import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./layout/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/auth-context.tsx";
import { HelmetProvider } from "react-helmet-async";
const queryclient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryclient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <App />
        </ThemeProvider>
      </AuthProvider>
      <Toaster richColors />
    </QueryClientProvider>
  </HelmetProvider>
);
