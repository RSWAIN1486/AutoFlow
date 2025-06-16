export interface CreditApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  annualIncome: string;
  employmentStatus: string;
  employer: string;
  jobTitle: string;
  selectedVehicle?: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
  };
  submittedAt: Date;
}

// In-memory store for POC
export let applications: CreditApplication[] = [];

export const addApplication = (appData: Omit<CreditApplication, 'id' | 'submittedAt'>): number => {
  const newApp: CreditApplication = {
    ...appData,
    id: Date.now(),
    submittedAt: new Date()
  };
  applications.push(newApp);
  return newApp.id;
};

export const getApplication = (id: number): CreditApplication | undefined => {
  return applications.find(app => app.id === id);
};

export const getAllApplications = (): CreditApplication[] => {
  return applications;
}; 