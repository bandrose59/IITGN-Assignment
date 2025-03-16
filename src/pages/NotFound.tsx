
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="panel p-12 text-center max-w-md animate-scale-in">
        <h1 className="text-5xl font-bold mb-6">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for cannot be found.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
