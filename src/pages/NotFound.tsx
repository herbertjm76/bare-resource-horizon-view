
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, HomeIcon } from 'lucide-react';

interface NotFoundProps {
  companyNotFound?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({ companyNotFound = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center glass rounded-2xl p-8 shadow-lg border border-white/20">
        {companyNotFound ? (
          <>
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h1 className="text-3xl font-bold text-white">Company Not Found</h1>
            <p className="text-white/80 mt-3">
              The company subdomain you're trying to access doesn't exist or has been removed.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-bold text-white">404</h1>
            <p className="text-xl text-white/90">Page not found</p>
            <p className="text-white/80">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </>
        )}
        
        <div className="pt-6">
          <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
            <Link to="/" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
