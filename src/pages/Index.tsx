
import React from 'react';
import { ClosetProvider } from '@/context/ClosetContext';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <ClosetProvider>
      <div className="min-h-screen bg-background bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBvcGFjaXR5PSIwLjA1Ij48cGF0aCBkPSJNNTAuOTkxIDMwYzAgMTEuNTk0LTkuMzk3IDIwLjk5MS0yMC45OTEgMjAuOTkxUzkuMDA5IDQxLjU5NCA5LjAwOSAzMCA5LjAwOSA5LjAwOSAyMCA5LjAwOVMxMi4wNjkgLjU2NiAyNSAuNTY2IDUwLjk5MSAxOC40MDYgNTAuOTkxIDMweiIgZmlsbD0iI2U4N2JkNyIvPjwvc3ZnPg==')]">
        <div className="container max-w-md mx-auto px-4">
          <Outlet />
        </div>
        <Navigation />
        <Toaster />
      </div>
    </ClosetProvider>
  );
};

export default Index;
