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

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const STORE_FILE = join(process.cwd(), '.applications.json');

// Load applications from file on startup
const loadApplications = (): CreditApplication[] => {
  try {
    if (existsSync(STORE_FILE)) {
      const data = readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      return parsed.map((app: any) => ({
        ...app,
        submittedAt: new Date(app.submittedAt),
        uploadedDocuments: app.uploadedDocuments?.map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt)
        })) || []
      }));
    }
  } catch (error) {
    console.error('Error loading applications:', error);
  }
  return [];
};

// Save applications to file
const saveApplications = () => {
  try {
    writeFileSync(STORE_FILE, JSON.stringify(applications, null, 2));
    console.log(`Saved ${applications.length} applications to file`);
  } catch (error) {
    console.error('Error saving applications:', error);
  }
};

// In-memory store for POC with persistence
let applications: CreditApplication[] = [];
let isLoaded = false;

// Initialize applications on first access or force reload
const ensureApplicationsLoaded = (forceReload = false) => {
  if (!isLoaded || forceReload) {
    applications = loadApplications();
    isLoaded = true;
    console.log(`Loaded ${applications.length} applications from file`);
  }
};

// Initialize on module load
ensureApplicationsLoaded();

// Generate a secure token for the application
const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const addApplication = (appData: Omit<CreditApplication, 'id' | 'submittedAt' | 'token' | 'status'>): CreditApplication => {
  ensureApplicationsLoaded();
  const newApp: CreditApplication = {
    ...appData,
    id: Date.now(),
    submittedAt: new Date(),
    token: generateToken(),
    status: 'documents-pending',
    uploadedDocuments: []
  };
  applications.push(newApp);
  saveApplications();
  return newApp;
};

export const getApplication = (id: number): CreditApplication | undefined => {
  ensureApplicationsLoaded();
  return applications.find(app => app.id === id);
};

export const getAllApplications = (): CreditApplication[] => {
  ensureApplicationsLoaded();
  return applications;
};

export const updateApplicationDocuments = (appId: number, documents: UploadedDocument[]): boolean => {
  ensureApplicationsLoaded();
  console.log(`Looking for application with ID: ${appId}`);
  console.log(`Current applications in store:`, applications.map(a => ({ id: a.id, status: a.status })));
  
  const app = applications.find(a => a.id === appId);
  if (app) {
    console.log(`Found application ${appId}, updating with ${documents.length} documents`);
    app.uploadedDocuments = documents;
    app.status = 'documents-uploaded';
    console.log(`Application ${appId} status updated to: ${app.status}`);
    saveApplications();
    return true;
  } else {
    console.error(`Application with ID ${appId} not found in store`);
  }
  return false;
};

export const updateApplicationStatus = (appId: number, status: CreditApplication['status']): boolean => {
  ensureApplicationsLoaded();
  const app = applications.find(a => a.id === appId);
  if (app) {
    app.status = status;
    saveApplications();
    return true;
  }
  return false;
};

// Force reload applications from file (useful for debugging)
export const reloadApplications = (): void => {
  ensureApplicationsLoaded(true);
}; 