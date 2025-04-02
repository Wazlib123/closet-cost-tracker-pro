
export type Category = 
  | "Tops"
  | "Bottoms"
  | "Outerwear"
  | "Dresses"
  | "Shoes"
  | "Accessories"
  | "Other";

export const CATEGORIES: Category[] = [
  "Tops",
  "Bottoms",
  "Outerwear",
  "Dresses",
  "Shoes",
  "Accessories",
  "Other"
];

export interface ClothingItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  photoUrl?: string; // Optional photo
  purchaseDate: string; // ISO date string
  wearGoal?: number; // Optional wear goal
  notes?: string; // Optional notes
}

export interface WearEvent {
  id: string;
  itemId: string;
  date: string; // ISO date string
  notes?: string; // Optional notes about the wear
}
