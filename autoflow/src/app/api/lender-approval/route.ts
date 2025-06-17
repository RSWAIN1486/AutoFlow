import { NextRequest, NextResponse } from 'next/server';
import { updateApplicationWithApproval, getApplication } from '@/lib/applicationStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get the application to check if it exists and get vehicle info
    const application = getApplication(applicationId);
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    console.log(`Application ${applicationId} current status: ${application.status}`);

    // Check if application is in the right status for approval
    if (application.status !== 'documents-uploaded') {
      return NextResponse.json(
        { error: `Application must have documents uploaded before approval simulation. Current status: ${application.status}` },
        { status: 400 }
      );
    }

    // Generate realistic mock approval terms
    const vehiclePrice = application.selectedVehicle?.price || 25000;
    const annualIncome = parseInt(application.annualIncome) || 50000;
    
    // Calculate loan amount (typically 80-90% of vehicle price for good credit)
    const downPaymentPercentage = Math.random() * 0.2 + 0.1; // 10-30% down payment
    const loanAmount = Math.round(vehiclePrice * (1 - downPaymentPercentage));
    
    // Generate interest rate based on income and randomization (3-12% APR)
    const baseRate = 3.5; // Base rate for good credit
    const incomeAdjustment = Math.max(0, (60000 - annualIncome) / 10000); // Higher rate for lower income
    const randomAdjustment = Math.random() * 2; // Random variation
    const interestRate = Math.round((baseRate + incomeAdjustment + randomAdjustment) * 100) / 100;
    
    // Generate term length (typically 36, 48, 60, or 72 months)
    const termOptions = [36, 48, 60, 72];
    const termLength = termOptions[Math.floor(Math.random() * termOptions.length)];
    
    // Calculate monthly payment using loan formula
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termLength)) / 
      (Math.pow(1 + monthlyRate, termLength) - 1)
    );

    // Update application with approval terms
    const approvalTerms = {
      loanAmount,
      interestRate,
      termLength,
      monthlyPayment
    };

    const success = updateApplicationWithApproval(applicationId, approvalTerms);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update application with approval terms' },
        { status: 500 }
      );
    }

    // Get updated application to return with approval ID
    const updatedApplication = getApplication(applicationId);
    
    return NextResponse.json({
      success: true,
      approvalTerms: updatedApplication?.approvalTerms,
      message: 'Lender approval simulation completed successfully'
    });

  } catch (error) {
    console.error('Error in lender approval simulation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 