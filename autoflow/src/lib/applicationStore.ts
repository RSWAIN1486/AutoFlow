export interface UploadedDocument {
  originalName: string;
  filename: string;
  path: string;
  fieldName: string;
  uploadedAt: Date;
}

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
  token: string;
  uploadedDocuments?: UploadedDocument[];
  status: 'submitted' | 'documents-pending' | 'documents-uploaded' | 'under-review' | 'approved' | 'rejected';
}

// In-memory store for POC
export let applications: CreditApplication[] = [];

// Generate a secure token for the application
const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const addApplication = (appData: Omit<CreditApplication, 'id' | 'submittedAt' | 'token' | 'status'>): CreditApplication => {
  const newApp: CreditApplication = {
    ...appData,
    id: Date.now(),
    submittedAt: new Date(),
    token: generateToken(),
    status: 'documents-pending',
    uploadedDocuments: []
  };
  applications.push(newApp);
  return newApp;
};

export const getApplication = (id: number): CreditApplication | undefined => {
  return applications.find(app => app.id === id);
};

export const getAllApplications = (): CreditApplication[] => {
  return applications;
};

export const updateApplicationDocuments = (appId: number, documents: UploadedDocument[]): boolean => {
  const app = applications.find(a => a.id === appId);
  if (app) {
    app.uploadedDocuments = documents;
    app.status = 'documents-uploaded';
    return true;
  }
  return false;
};

export const updateApplicationStatus = (appId: number, status: CreditApplication['status']): boolean => {
  const app = applications.find(a => a.id === appId);
  if (app) {
    app.status = status;
    return true;
  }
  return false;
}; 