
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Camera, UploadCloud } from 'lucide-react';
import { useCloset } from '@/context/ClosetContext';
import { Category, CATEGORIES, ClothingItem } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Fix the enum type by using "as const" and z.enum
const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.enum(CATEGORIES as unknown as [string, ...string[]]),
  purchaseDate: z.string().optional(),
  wearGoal: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditItem = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, updateItem } = useCloset();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Find the item to edit
  const item = items.find(item => item.id === id);
  
  // If the item doesn't exist, redirect to the home page
  if (!item) {
    navigate('/');
    return null;
  }
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      price: item.price,
      category: item.category,
      purchaseDate: item.purchaseDate.split('T')[0],
      wearGoal: item.wearGoal,
      notes: item.notes || "",
    },
  });
  
  // Set the image preview if the item has a photo
  useEffect(() => {
    if (item.photoUrl) {
      setImagePreview(item.photoUrl);
    }
  }, [item.photoUrl]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (values: FormValues) => {
    const updatedItem: ClothingItem = {
      ...item,
      name: values.name,
      price: values.price,
      category: values.category as Category,
      photoUrl: imagePreview || undefined,
      purchaseDate: values.purchaseDate || new Date().toISOString(),
      wearGoal: values.wearGoal,
      notes: values.notes,
    };
    
    updateItem(updatedItem);
    navigate(`/item/${item.id}`);
  };
  
  return (
    <div className="pb-20">
      <header className="flex items-center py-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`/item/${item.id}`)}
          className="mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Edit {item.name}</h1>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Item Photo</label>
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative mb-4 w-full max-w-xs aspect-square">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => setImagePreview(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-md w-full max-w-xs aspect-square flex flex-col items-center justify-center p-6 mb-4">
                  <Camera className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Upload a photo of your item
                  </p>
                  <Button type="button" variant="secondary" size="sm" className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Item details */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Blue Denim Jacket" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="wearGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wear Goal (optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 30 wears"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional details about this item"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/item/${item.id}`)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditItem;
