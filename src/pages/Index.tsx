
import React from 'react';
import { ClosetProvider } from '@/context/ClosetContext';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <ClosetProvider>
      <div className="min-h-screen bg-background">
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
