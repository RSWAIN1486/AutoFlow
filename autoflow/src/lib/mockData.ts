export interface Vehicle {
  id: string;
  imageUrl: string;
  price: number;
  year: number;
  make: string;
  model: string;
  mileage: number;
  color?: string;
  transmission?: string;
  fuelType?: string;
}

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1727111449539-934756114007?q=80&w=2070&auto=format&fit=crop&w=2000&q=80",
    price: 28500,
    year: 2021,
    make: "Honda",
    model: "Civic",
    mileage: 15000,
    color: "Silver",
    transmission: "Automatic",
    fuelType: "Gasoline"
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    price: 32900,
    year: 2022,
    make: "Toyota",
    model: "Camry",
    mileage: 8500,
    color: "White",
    transmission: "Automatic",
    fuelType: "Gasoline"
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    price: 45200,
    year: 2023,
    make: "BMW",
    model: "3 Series",
    mileage: 2500,
    color: "Black",
    transmission: "Automatic",
    fuelType: "Gasoline"
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    price: 26800,
    year: 2020,
    make: "Nissan",
    model: "Altima",
    mileage: 22000,
    color: "Blue",
    transmission: "CVT",
    fuelType: "Gasoline"
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    price: 38900,
    year: 2022,
    make: "Ford",
    model: "Mustang",
    mileage: 12000,
    color: "Red",
    transmission: "Manual",
    fuelType: "Gasoline"
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    price: 55000,
    year: 2023,
    make: "Tesla",
    model: "Model 3",
    mileage: 5000,
    color: "White",
    transmission: "Single Speed",
    fuelType: "Electric"
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1646609236368-4bc7c4e67639?q=80&w=1974&auto=format&fit=crop&w=2000&q=80",
    price: 31500,
    year: 2021,
    make: "Hyundai",
    model: "Elantra",
    mileage: 18000,
    color: "Gray",
    transmission: "Automatic",
    fuelType: "Gasoline"
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1672349598989-07c440c7494a?q=80&w=2069&auto=format&fit=crop&w=2000&q=80",
    price: 42000,
    year: 2022,
    make: "Jeep",
    model: "Wrangler",
    mileage: 9500,
    color: "Green",
    transmission: "Manual",
    fuelType: "Gasoline"
  }
]; 