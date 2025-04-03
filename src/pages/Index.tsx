
import React, { useEffect } from 'react';
import { ClosetProvider } from '@/context/ClosetContext';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  // Add meta viewport to ensure proper scaling on mobile
  useEffect(() => {
    // Set viewport meta tag to ensure proper scaling on mobile
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);

    // Add status bar padding class to body
    document.body.classList.add('has-safe-area-padding');

    // Clean up on unmount
    return () => {
      document.head.removeChild(meta);
      document.body.classList.remove('has-safe-area-padding');
    };
  }, []);

  return (
    <ClosetProvider>
      <div className="min-h-screen bg-background bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBvcGFjaXR5PSIwLjA1Ij48cGF0aCBkPSJNNTAuOTkxIDMwYzAgMTEuNTk0LTkuMzk3IDIwLjk5MS0yMC45OTEgMjAuOTkxUzkuMDA5IDQxLjU5NCA5LjAwOSAzMCA5LjAwOSA5LjAwOSAyMCA5LjAwOVMxMi4wNjkgLjU2NiAyNSAuNTY2IDUwLjk5MSAxOC40MDYgNTAuOTkxIDMweiIgZmlsbD0iI2U4N2JkNyIvPjwvc3ZnPg==')]">
        <div className="safe-area-top"></div>
        <div className="container max-w-md mx-auto px-4 pb-safe">
          <div className="pt-12 md:pt-4"> {/* Increased padding for mobile */}
            <Outlet />
          </div>
        </div>
        <Navigation />
        <Toaster />
      </div>
    </ClosetProvider>
  );
};

export default Index;
