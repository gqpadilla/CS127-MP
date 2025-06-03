export interface Item {
  id: string;
  code: string;
  name: string;
  basePrice: number;
  category: string;
  type: 'DRINK' | 'FOOD' | 'MERCHANDISE';
  sizes?: SizeOption[];
  customizations?: Customization[];
}

export interface SizeOption {
  name: string;
  priceModifier: number;
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  item: Item;
  quantity: number;
  selectedSize?: SizeOption;
  selectedCustomizations: CustomizationOption[];
}

export interface Transaction {
  id: string;
  date: string;
  items: OrderItem[];
  isMember: boolean;
  memberId?: string;
  total: number;
}