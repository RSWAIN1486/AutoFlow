export interface UploadedDocument {
  originalName: string;
  filename: string;
  path: string;
  fieldName: string;
  uploadedAt: Date;
}

export interface ApprovalTerms {
  loanAmount: number;
  interestRate: number;
  termLength: number; // in months
  monthlyPayment: number;
  approvedAt: Date;
  approvalId: string;
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
  status: 'submitted' | 'documents-pending' | 'documents-uploaded' | 'under-review' | 'approved' | 'rejected' | 'contract-sent' | 'contract-signed' | 'awaiting-delivery';
  approvalTerms?: ApprovalTerms;
  deliveryChoice?: 'pickup' | 'home-delivery';
  deliveryDetails?: {
    scheduledDate?: string;
    scheduledTime?: string;
    deliveryAddress?: string;
  };
}

// Conditional imports for server-side only
let fs: typeof import('fs') | undefined;
let path: typeof import('path') | undefined;
let STORE_FILE: string;

// Only import fs and path when running on server side
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  path = require('path');
  STORE_FILE = path?.join(process.cwd(), '.applications.json') ?? '.applications.json';
}

// Load applications from file on startup (server-side only)
const loadApplications = (): CreditApplication[] => {
  // Return empty array if running on client side
  if (typeof window !== 'undefined' || !fs) {
    return [];
  }
  
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8').trim();
      
      // Handle empty file
      if (!data) {
        console.log('Applications file is empty, starting with empty array');
        return [];
      }
      
      const parsed = JSON.parse(data);
      
      // Handle case where file contains non-array data
      if (!Array.isArray(parsed)) {
        console.warn('Applications file does not contain an array, starting with empty array');
        return [];
      }
      
      // Convert date strings back to Date objects
      return parsed.map((app: CreditApplication & { submittedAt: string; uploadedDocuments?: (UploadedDocument & { uploadedAt: string })[]; approvalTerms?: ApprovalTerms & { approvedAt: string } }) => ({
        ...app,
        submittedAt: new Date(app.submittedAt),
        uploadedDocuments: app.uploadedDocuments?.map((doc: UploadedDocument & { uploadedAt: string }) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt)
        })) || [],
        approvalTerms: app.approvalTerms ? {
          ...app.approvalTerms,
          approvedAt: new Date(app.approvalTerms.approvedAt)
        } : undefined
      }));
    }
  } catch (error) {
    console.error('Error loading applications:', error);
    // If file is corrupted, create a backup and start fresh
    if (fs && fs.existsSync(STORE_FILE)) {
      try {
        const backupFile = STORE_FILE + '.backup.' + Date.now();
        const data = fs.readFileSync(STORE_FILE, 'utf-8');
        fs.writeFileSync(backupFile, data);
        console.log(`Corrupted applications file backed up to: ${backupFile}`);
      } catch (backupError) {
        console.error('Error creating backup:', backupError);
      }
    }
  }
  return [];
};

// Save applications to file with better error handling and verification (server-side only)
const saveApplications = () => {
  // Skip file operations on client side
  if (typeof window !== 'undefined' || !fs) {
    return;
  }
  
  try {
    // Ensure we always write a valid JSON array
    const dataToSave = Array.isArray(applications) ? applications : [];
    const jsonData = JSON.stringify(dataToSave, null, 2);
    
    // Write to file synchronously to ensure completion
    fs.writeFileSync(STORE_FILE, jsonData, 'utf-8');
    console.log(`Saved ${dataToSave.length} applications to file`);
    
    // Verify the file was written correctly by reading it back
    const verifyData = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsedVerify = JSON.parse(verifyData);
    
    if (Array.isArray(parsedVerify) && parsedVerify.length === dataToSave.length) {
      console.log(`✅ File save verification successful: ${parsedVerify.length} applications`);
    } else {
      console.error(`❌ File save verification failed: expected ${dataToSave.length}, got ${parsedVerify?.length || 'invalid'}`);
    }
  } catch (error) {
    console.error('Error saving applications:', error);
    throw error; // Re-throw to let caller handle the error
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
    const source = typeof window !== 'undefined' ? 'memory (client-side)' : 'file (server-side)';
    console.log(`Loaded ${applications.length} applications from ${source}`);
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
  ensureApplicationsLoaded(true); // Force reload to get fresh data
  return applications.find(app => app.id === id);
};

export const getAllApplications = (): CreditApplication[] => {
  ensureApplicationsLoaded(true); // Always force reload to get fresh data
  return applications;
};

export const updateApplicationDocuments = (appId: number, documents: UploadedDocument[]): boolean => {
  // Force reload to ensure we have the latest data
  ensureApplicationsLoaded(true);
  console.log(`Looking for application with ID: ${appId}`);
  console.log(`Current applications in store:`, applications.map(a => ({ id: a.id, status: a.status })));
  
  const app = applications.find(a => a.id === appId);
  if (app) {
    console.log(`Found application ${appId}, current status: ${app.status}, updating with ${documents.length} documents`);
    app.uploadedDocuments = documents;
    app.status = 'documents-uploaded';
    console.log(`Application ${appId} status updated to: ${app.status}`);
    
    // Save immediately and verify the save was successful
    try {
      saveApplications();
      console.log(`Successfully saved application ${appId} with new status`);
      
      // Double-check by reloading and verifying the status was saved (server-side only)
      if (typeof window === 'undefined' && fs) {
        const verification = loadApplications();
        const verifyApp = verification.find(a => a.id === appId);
        if (verifyApp && verifyApp.status === 'documents-uploaded') {
          console.log(`✅ Verified: Application ${appId} status is correctly saved as ${verifyApp.status}`);
          return true;
        } else {
          console.error(`❌ Verification failed: Application ${appId} status not saved correctly`);
          return false;
        }
      } else {
        console.log(`✅ Application ${appId} updated successfully (client-side)`);
        return true;
      }
    } catch (error) {
      console.error(`Error saving application ${appId}:`, error);
      return false;
    }
  } else {
    console.error(`Application with ID ${appId} not found in store`);
    console.log(`Available application IDs:`, applications.map(a => a.id));
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

export const updateApplicationWithApproval = (appId: number, approvalTerms: Omit<ApprovalTerms, 'approvedAt' | 'approvalId'>): boolean => {
  ensureApplicationsLoaded();
  const app = applications.find(a => a.id === appId);
  if (app) {
    app.approvalTerms = {
      ...approvalTerms,
      approvedAt: new Date(),
      approvalId: `APPR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    app.status = 'approved';
    saveApplications();
    console.log(`Application ${appId} approved with terms:`, app.approvalTerms);
    return true;
  }
  console.error(`Application with ID ${appId} not found for approval`);
  return false;
};

// Update application status to contract-sent
export const markContractSent = (appId: number): boolean => {
  ensureApplicationsLoaded();
  const app = applications.find(a => a.id === appId);
  if (app) {
    app.status = 'contract-sent';
    saveApplications();
    console.log(`Application ${appId} status updated to contract-sent`);
    return true;
  }
  console.error(`Application with ID ${appId} not found for contract-sent update`);
  return false;
};

// Update application status to contract-signed
export const markContractSigned = (appId: number): boolean => {
  ensureApplicationsLoaded();
  const app = applications.find(a => a.id === appId);
  if (app) {
    app.status = 'contract-signed';
    saveApplications();
    console.log(`Application ${appId} status updated to contract-signed`);
    return true;
  }
  console.error(`Application with ID ${appId} not found for contract-signed update`);
  return false;
};

// Update application delivery choice and details
export const updateDeliveryChoice = (
  appId: number, 
  deliveryChoice: 'pickup' | 'home-delivery',
  deliveryDetails?: {
    scheduledDate?: string;
    scheduledTime?: string;
    deliveryAddress?: string;
  }
): boolean => {
  ensureApplicationsLoaded(true);
  const app = applications.find(a => a.id === appId);
  if (app) {
    app.deliveryChoice = deliveryChoice;
    app.deliveryDetails = deliveryDetails;
    saveApplications();
    console.log(`Application ${appId} delivery choice updated to: ${deliveryChoice}`, deliveryDetails);
    return true;
  }
  console.error(`Application with ID ${appId} not found for delivery choice update`);
  return false;
};

// Force reload applications from file (useful for debugging)
export const reloadApplications = (): void => {
  ensureApplicationsLoaded(true);
};

// Clear all applications and their uploaded documents
export const clearAllApplications = async (): Promise<{ success: boolean; message: string; deletedFiles?: string[] }> => {
  try {
    ensureApplicationsLoaded(true);
    
    const deletedFiles: string[] = [];
    const deletedCount = applications.length;
    
    // Collect all uploaded file paths before clearing
    for (const app of applications) {
      if (app.uploadedDocuments && app.uploadedDocuments.length > 0) {
        for (const doc of app.uploadedDocuments) {
          deletedFiles.push(doc.filename);
        }
      }
    }
    
    console.log(`Found ${deletedFiles.length} files to delete:`, deletedFiles);
    
    // Delete uploaded files from the uploads directory BEFORE clearing applications
    let actuallyDeletedFiles = 0;
    if (deletedFiles.length > 0 && typeof window === 'undefined') {
      // Only attempt file deletion on server-side
      const fs = await import('fs');
      const path = await import('path');
      
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      console.log(`Looking for files in: ${uploadsDir}`);
      
      for (const filename of deletedFiles) {
        try {
          const filePath = path.join(uploadsDir, filename);
          console.log(`Attempting to delete: ${filePath}`);
          
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            actuallyDeletedFiles++;
            console.log(`✅ Successfully deleted file: ${filename}`);
          } else {
            console.log(`⚠️ File not found: ${filename}`);
          }
        } catch (fileError) {
          console.error(`❌ Error deleting file ${filename}:`, fileError);
        }
      }
    }
    
    // Clear the applications array AFTER deleting files
    applications.length = 0;
    
    // Save the empty array to file
    saveApplications();
    
    console.log(`Cleared ${deletedCount} applications and ${actuallyDeletedFiles}/${deletedFiles.length} uploaded files`);
    
    return {
      success: true,
      message: `Successfully cleared ${deletedCount} applications and deleted ${actuallyDeletedFiles} uploaded files`,
      deletedFiles: deletedFiles
    };
    
  } catch (error) {
    console.error('Error clearing applications:', error);
    return {
      success: false,
      message: `Failed to clear applications: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 