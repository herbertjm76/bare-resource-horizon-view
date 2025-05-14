import { BrowserRouter } from 'react-router-dom';
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { createRoot } from 'react-dom/client'
import './index.css'

const App = () => {
  return (
    <BrowserRouter>
      {/* Rest of your application */}
      <ShadcnToaster />
      <SonnerToaster />
    </BrowserRouter>
  );
};

export default App;
