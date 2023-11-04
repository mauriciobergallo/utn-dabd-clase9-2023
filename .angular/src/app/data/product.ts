export interface IProduct {
  id: number;
  name: string;
  description: string;
  inventories: IInventory[];
}

export interface IInventory {
  id: number;
  location: string;
  stock: number;
}

export const PRODUCTS: IProduct[] = [
  {
    id: 1,
    name: 'Yerba Playadito',
    description: 'Yerba para tomar unos mates',
    inventories: [
      { id: 1, location: 'Nueva Córdoba', stock: 10 },
      { id: 2, location: 'Hiper Libertad', stock: 15 },
    ],
  },
];
