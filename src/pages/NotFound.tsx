
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, HomeIcon } from 'lucide-react';

interface NotFoundProps {
  companyNotFound?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({ companyNotFound = false }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {companyNotFound ? (
          <>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="text-3xl font-bold">Company Not Found</h1>
            <p className="text-muted-foreground">
              The company subdomain you're trying to access doesn't exist or has been removed.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-bold">404</h1>
            <p className="text-xl">Page not found</p>
            <p className="text-muted-foreground">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </>
        )}
        
        <div className="pt-6">
          <Button asChild size="lg">
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
