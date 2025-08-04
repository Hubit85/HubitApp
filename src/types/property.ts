export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  type: "apartment" | "house" | "townhouse" | "condo" | "studio" | "commercial";
  status: "owned" | "rented" | "vacant";
  size?: number; // in square meters
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  description?: string;
  images?: string[];
  isCurrentlySelected?: boolean;
  communityInfo?: {
    communityName?: string;
    portalNumber?: string;
    apartmentNumber?: string;
    totalUnits?: number;
    managementCompany?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFormData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  type: Property["type"];
  status: Property["status"];
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  description?: string;
  communityName?: string;
  portalNumber?: string;
  apartmentNumber?: string;
}

export interface PropertyStats {
  totalProperties: number;
  ownedProperties: number;
  rentedProperties: number;
  vacantProperties: number;
}
