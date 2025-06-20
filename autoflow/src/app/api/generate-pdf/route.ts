import { NextRequest, NextResponse } from 'next/server';
import { getApplication } from '@/lib/applicationStore';
import jsPDF from 'jspdf';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');
    const token = searchParams.get('token');

    if (!appId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const application = getApplication(parseInt(appId));
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Optional: Verify token for security
    if (token && application.token !== token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false, maxWidth?: number) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      if (maxWidth) {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * (fontSize * 0.5);
      } else {
        doc.text(text, margin, yPosition);
        yPosition += fontSize * 0.5;
      }
      yPosition += 5; // Add some spacing
    };

    // Helper function to add a section header
    const addSectionHeader = (title: string) => {
      yPosition += 10;
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(margin, yPosition - 8, pageWidth - 2 * margin, 12, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 5, yPosition);
      doc.setTextColor(0, 0, 0); // Reset to black
      yPosition += 15;
    };

    // Helper function to check if we need a new page
    const checkPageBreak = (neededSpace: number = 30) => {
      if (yPosition + neededSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Document Header
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('AutoFlow Vehicle Financing', pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Complete Loan Documentation Package', pageWidth / 2, 35, { align: 'center' });
    
    yPosition = 50;
    doc.setTextColor(0, 0, 0);

    // Application Information
    addSectionHeader('APPLICATION INFORMATION');
    addText(`Application ID: ${application.id}`, 12, true);
    addText(`Application Date: ${new Date(application.submittedAt).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`);
    addText(`Status: ${application.status.toUpperCase()}`);

    // Borrower Information
    checkPageBreak();
    addSectionHeader('BORROWER INFORMATION');
    addText(`Name: ${application.firstName} ${application.lastName}`, 12, true);
    addText(`Email: ${application.email}`);
    addText(`Phone: ${application.phone}`);
    addText(`Annual Income: $${parseInt(application.annualIncome).toLocaleString()}`);
    addText(`Employment Status: ${application.employmentStatus}`);
    addText(`Employer: ${application.employer}`);
    addText(`Job Title: ${application.jobTitle}`);

    // Vehicle Information
    if (application.selectedVehicle) {
      checkPageBreak();
      addSectionHeader('VEHICLE INFORMATION');
      addText(`Vehicle: ${application.selectedVehicle.year} ${application.selectedVehicle.make} ${application.selectedVehicle.model}`, 12, true);
      addText(`Price: $${application.selectedVehicle.price.toLocaleString()}`);
    }

    // Loan Terms
    if (application.approvalTerms) {
      checkPageBreak();
      addSectionHeader('LOAN TERMS & APPROVAL');
      addText(`Lender: Westlake Financial Services`, 12, true);
      addText(`Approval ID: ${application.approvalTerms.approvalId}`);
      addText(`Approval Date: ${new Date(application.approvalTerms.approvedAt).toLocaleDateString()}`);
      addText(`Loan Amount: $${application.approvalTerms.loanAmount.toLocaleString()}`, 12, true);
      addText(`Interest Rate: ${application.approvalTerms.interestRate}% APR`, 12, true);
      addText(`Term Length: ${application.approvalTerms.termLength} months`, 12, true);
      addText(`Monthly Payment: $${application.approvalTerms.monthlyPayment.toLocaleString()}`, 12, true);
    }

    // Delivery Information
    if (application.deliveryChoice) {
      checkPageBreak();
      addSectionHeader('DELIVERY INFORMATION');
      const deliveryText = application.deliveryChoice === 'pickup' ? 'Vehicle Pickup' : 'Home Delivery';
      addText(`Delivery Method: ${deliveryText}`, 12, true);
      
      if (application.deliveryDetails) {
        if (application.deliveryDetails.scheduledDate) {
          addText(`Scheduled Date: ${new Date(application.deliveryDetails.scheduledDate).toLocaleDateString()}`);
        }
        if (application.deliveryDetails.scheduledTime) {
          addText(`Scheduled Time: ${application.deliveryDetails.scheduledTime}`);
        }
        if (application.deliveryChoice === 'pickup') {
          addText('Pickup Location: AutoFlow Dealership');
          addText('456 Auto Drive, Los Angeles, CA 90028');
          addText('Phone: (555) 123-4567');
        } else if (application.deliveryDetails.deliveryAddress) {
          addText('Delivery Address:');
          addText(application.deliveryDetails.deliveryAddress, 10, false, pageWidth - 2 * margin);
        }
      }
    }

    // Documents Submitted
    if (application.uploadedDocuments && application.uploadedDocuments.length > 0) {
      checkPageBreak();
      addSectionHeader('SUBMITTED DOCUMENTS');
      application.uploadedDocuments.forEach((doc, index) => {
        const docName = doc.fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        addText(`${index + 1}. ${docName} (${doc.originalName})`);
      });
    }

    // Contract Terms & Conditions
    checkPageBreak();
    addSectionHeader('CONTRACT TERMS & CONDITIONS');
    addText('IMPORTANT LOAN TERMS AND CONDITIONS:', 12, true);
    addText('');
    addText('1. PAYMENT TERMS: Monthly payments are due on the same day each month as specified in your loan agreement.');
    addText('');
    addText('2. INTEREST CALCULATION: Interest is calculated on the outstanding principal balance at the annual percentage rate specified.');
    addText('');
    addText('3. LATE PAYMENT: A late fee may be charged if payment is not received within the grace period specified in your loan agreement.');
    addText('');
    addText('4. PREPAYMENT: You may prepay the loan in whole or in part at any time without penalty.');
    addText('');
    addText('5. DEFAULT: Failure to make payments as agreed may result in default and repossession of the vehicle.');
    addText('');
    addText('6. INSURANCE: You must maintain comprehensive and collision insurance on the vehicle throughout the loan term.');
    addText('');
    addText('7. TITLE: The lender will hold the vehicle title as security until the loan is paid in full.');

    // Footer with generation info
    checkPageBreak();
    yPosition = pageHeight - 30;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Document generated on: ${new Date().toLocaleString()}`, margin, yPosition);
    doc.text('This is an electronically generated document.', margin, yPosition + 10);
    doc.text('For questions, contact AutoFlow at (555) 123-4567 or support@autoflow.com', margin, yPosition + 20);

    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="AutoFlow-Loan-Documents-${application.id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
} 