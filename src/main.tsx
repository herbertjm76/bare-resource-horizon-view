
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CompanyProvider } from './context/CompanyContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        <App />
      </CompanyProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
