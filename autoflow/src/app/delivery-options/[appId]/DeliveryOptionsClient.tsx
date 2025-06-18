'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditApplication } from '@/lib/applicationStore';

interface DeliveryOptionsClientProps {
  application: CreditApplication;
}

export default function DeliveryOptionsClient({ application }: DeliveryOptionsClientProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<'pickup' | 'home-delivery' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(
    `${application.firstName} ${application.lastName}\n123 Main Street\nAnytown, CA 90210`
  );

  // Store information for pickup
  const storeInfo = {
    name: "AutoFlow Dealership",
    address: "456 Auto Drive, Los Angeles, CA 90028",
    phone: "(555) 123-4567",
    hours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
    mapUrl: "https://maps.google.com/?q=456+Auto+Drive,+Los+Angeles,+CA+90028"
  };

  // Generate available time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleOptionSelect = (option: 'pickup' | 'home-delivery') => {
    setSelectedOption(option);
    // Reset form fields when switching options
    setScheduledDate('');
    setScheduledTime('');
  };

  const isFormValid = () => {
    return selectedOption && scheduledDate && scheduledTime && 
           (selectedOption === 'pickup' || (selectedOption === 'home-delivery' && deliveryAddress.trim()));
  };

  const handleConfirmChoice = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);

    try {
      const deliveryDetails = {
        scheduledDate,
        scheduledTime,
        ...(selectedOption === 'home-delivery' && { deliveryAddress })
      };

      const response = await fetch('/api/delivery-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application.id,
          deliveryChoice: selectedOption,
          deliveryDetails
        }),
      });

      if (response.ok) {
        // Navigate to thank you page
        router.push(`/thank-you/${application.id}?token=${application.token}`);
      } else {
        console.error('Failed to update delivery choice');
        alert('Failed to save delivery choice. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating delivery choice:', error);
      alert('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Choose Your Delivery Option</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Congratulations! Your contract has been signed. Now choose how you'd like to receive your vehicle.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Contract Signed Successfully!
                </p>
                <p className="text-sm text-green-700">
                  Application ID: {application.id} | {application.firstName} {application.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pick up option */}
          <div 
            className={`border-2 rounded-lg p-6 transition-colors cursor-pointer ${
              selectedOption === 'pickup' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleOptionSelect('pickup')}
          >
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedOption === 'pickup' ? 'bg-blue-200' : 'bg-blue-100'
              }`}>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pick Up Vehicle</h3>
              <p className="text-sm text-gray-600 mb-4">
                Visit our dealership to pick up your vehicle at your convenience.
              </p>
            </div>

            {/* Store Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <h4 className="font-semibold text-gray-900 mb-2">{storeInfo.name}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{storeInfo.address}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{storeInfo.phone}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{storeInfo.hours}</span>
                </div>
              </div>
              <a
                href={storeInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                View on Google Maps
              </a>
            </div>

            <div className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedOption === 'pickup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {selectedOption === 'pickup' ? '✓ Selected' : 'Select Pickup'}
            </div>
          </div>

          {/* Home delivery option */}
          <div 
            className={`border-2 rounded-lg p-6 transition-colors cursor-pointer ${
              selectedOption === 'home-delivery' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => handleOptionSelect('home-delivery')}
          >
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedOption === 'home-delivery' ? 'bg-green-200' : 'bg-green-100'
              }`}>
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Delivery</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have your vehicle delivered directly to your home address.
              </p>
            </div>

            {/* Delivery Address */}
            {selectedOption === 'home-delivery' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter delivery address..."
                />
                {deliveryAddress.trim() && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700 font-medium mb-1">Selected Address:</p>
                    <p className="text-sm text-green-600 whitespace-pre-line">
                      {deliveryAddress}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedOption === 'home-delivery'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {selectedOption === 'home-delivery' ? '✓ Selected' : 'Select Delivery'}
            </div>
          </div>
        </div>

        {/* Date and Time Selection */}
        {selectedOption && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Schedule Your {selectedOption === 'pickup' ? 'Pickup' : 'Delivery'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ colorScheme: 'light' }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available from tomorrow up to 30 days
                </p>
                {scheduledDate && (
                  <p className="text-sm text-green-600 mt-1 font-medium">
                    Selected: {formatDate(scheduledDate)}
                  </p>
                )}
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time *
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a time...</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedOption === 'pickup' ? 'Store hours: ' + storeInfo.hours : 'Delivery available 9AM-7PM'}
                </p>
                {scheduledTime && (
                  <p className="text-sm text-green-600 mt-1 font-medium">
                    Selected: {scheduledTime}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm button */}
        {selectedOption && (
          <div className="text-center mb-6">
            <button
              onClick={handleConfirmChoice}
              disabled={isSubmitting || !isFormValid()}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 inline-block"></div>
                  Confirming...
                </>
              ) : (
                `Confirm ${selectedOption === 'pickup' ? 'Pickup' : 'Home Delivery'}`
              )}
            </button>
            {!isFormValid() && selectedOption && (
              <p className="text-sm text-red-600 mt-2">
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        )}

        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 