
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Database, Download, Shield } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Settings = () => {
  const handleClearData = () => {
    localStorage.removeItem('closet-cost-tracker-items');
    localStorage.removeItem('closet-cost-tracker-wears');
    toast.success('All data cleared. Refresh the page to see changes.');
  };
  
  const handleExportData = () => {
    try {
      const items = localStorage.getItem('closet-cost-tracker-items') || '[]';
      const wears = localStorage.getItem('closet-cost-tracker-wears') || '[]';
      
      const data = {
        items: JSON.parse(items),
        wears: JSON.parse(wears),
        exportDate: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `closet-cost-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };
  
  return (
    <div className="pb-20">
      <header className="py-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your app settings and data
        </p>
      </header>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-primary" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export or clear your closet data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex justify-start"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full flex justify-start"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your closet data, including items, wear history, and analytics. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>
                    Yes, clear all data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              About
            </CardTitle>
            <CardDescription>
              About Closet Cost Tracker Pro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Closet Cost Tracker Pro helps you track your wardrobe value by calculating the cost per wear of your clothing items. All your data is stored locally on your device.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Version 1.0.0
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
