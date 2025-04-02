
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  CheckCircle, 
  Edit2, 
  PlusCircle, 
  Trash2 
} from 'lucide-react';
import { useCloset } from '@/context/ClosetContext';
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { formatCurrency, formatDate } from '@/lib/formatters';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    items, 
    wearEvents, 
    logWear, 
    deleteItem, 
    deleteWear, 
    getItemWears, 
    getCostPerWear,
    getWearGoalProgress
  } = useCloset();
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Find the item by id
  const item = items.find(item => item.id === id);
  
  // If the item doesn't exist, redirect to the home page
  if (!item) {
    navigate('/');
    return null;
  }
  
  // Get wear events for this item
  const wears = getItemWears(item.id).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate cost per wear
  const costPerWear = getCostPerWear(item.id);
  
  // Get wear goal progress
  const progress = item.wearGoal ? getWearGoalProgress(item.id) : 0;
  
  // Handle logging a new wear
  const handleLogWear = () => {
    logWear(item.id, selectedDate);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };
  
  // Handle deleting a wear event
  const handleDeleteWear = (wearId: string) => {
    deleteWear(wearId);
  };
  
  // Handle deleting the item
  const handleDeleteItem = () => {
    deleteItem(item.id);
    navigate('/');
  };
  
  return (
    <div className="pb-20">
      <header className="flex items-center py-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">{item.name}</h1>
      </header>
      
      {/* Item details */}
      <div className="mb-6">
        {item.photoUrl && (
          <div className="aspect-square w-full overflow-hidden mb-4">
            <img 
              src={item.photoUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">{item.category}</Badge>
          <span className="font-medium">{formatCurrency(item.price)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Total Wears</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{wears.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Cost Per Wear</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{formatCurrency(costPerWear)}</div>
            </CardContent>
          </Card>
        </div>
        
        {item.wearGoal && (
          <Card className="mb-4">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Wear Goal Progress</CardTitle>
              <CardDescription>
                {wears.length} of {item.wearGoal} wears
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Progress value={progress * 100} className="h-2" />
            </CardContent>
          </Card>
        )}
        
        {item.notes && (
          <Card className="mb-4">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm">{item.notes}</p>
            </CardContent>
          </Card>
        )}
        
        <div className="flex gap-2 mb-6">
          <Button 
            onClick={() => navigate(`/edit/${item.id}`)}
            variant="outline"
            className="flex-1"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {item.name} and all of its wear history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteItem}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Log a new wear */}
      <Card className="mb-6">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Log a Wear</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleLogWear}>
              <Check className="w-4 h-4 mr-2" />
              Log
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Wear history */}
      <div>
        <h2 className="text-lg font-medium mb-3">Wear History</h2>
        {wears.length > 0 ? (
          <div className="space-y-3">
            {wears.map((wear) => (
              <Card key={wear.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">{formatDate(wear.date)}</p>
                        {wear.notes && (
                          <p className="text-sm text-muted-foreground">{wear.notes}</p>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove this wear?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will affect your cost per wear calculations.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteWear(wear.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No wears logged yet</p>
              <Button onClick={handleLogWear}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Log First Wear
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Create a custom Input component for this view
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
};

export default ItemDetail;
