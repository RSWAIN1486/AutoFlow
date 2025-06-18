"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  Building, 
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockVehicles } from '@/lib/mockData';
import { submitCreditApplication } from './actions';

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Income Information
  annualIncome: string;
  employmentStatus: string;
  // Employment Details
  employerName: string;
  jobTitle: string;
  workPhone: string;
  // Vehicle Information
  vehicleId?: string;
}

interface FormErrors {
  [key: string]: string;
}

function ApplyPageContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  const selectedVehicle = vehicleId ? mockVehicles.find(v => v.id === vehicleId) : null;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    annualIncome: '',
    employmentStatus: '',
    employerName: '',
    jobTitle: '',
    workPhone: '',
    vehicleId: vehicleId || ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Income & Employment', icon: Briefcase },
    { id: 3, title: 'Review & Submit', icon: CheckCircle }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email format is invalid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    }

    if (step === 2) {
      if (!formData.annualIncome.trim()) newErrors.annualIncome = 'Annual income is required';
      if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
      if (!formData.employerName.trim()) newErrors.employerName = 'Employer name is required';
      if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setIsSubmitting(true);
    
    // Create FormData object
    const form = new FormData();
    form.append('firstName', formData.firstName);
    form.append('lastName', formData.lastName);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('annualIncome', formData.annualIncome);
    form.append('employmentStatus', formData.employmentStatus);
    form.append('employer', formData.employerName);
    form.append('jobTitle', formData.jobTitle);
    
    // Add selected vehicle data if available
    if (selectedVehicle) {
      form.append('selectedVehicle', JSON.stringify(selectedVehicle));
    }
    
    try {
      await submitCreditApplication(form);
    } catch (err) {
      console.error('Error submitting application:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <Car className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-2xl font-bold text-gray-900">AutoFlow</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/inventory" className="text-gray-700 hover:text-blue-600 transition-colors">
                Inventory
              </Link>
              <span className="text-blue-600 font-semibold">Apply</span>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Credit Application
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get pre-approved for financing in minutes. Simple, secure, and fast.
          </p>
        </motion.div>

        {/* Selected Vehicle */}
        {selectedVehicle && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Vehicle
            </h3>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </h4>
                <p className="text-green-600 font-bold text-lg">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(selectedVehicle.price)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Step {step.id}
                  </p>
                  <p className={`text-sm ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="First Name"
                    icon={User}
                    type="text"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange('firstName', value)}
                    error={errors.firstName}
                    placeholder="Enter your first name"
                  />
                  <FormField
                    label="Last Name"
                    icon={User}
                    type="text"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange('lastName', value)}
                    error={errors.lastName}
                    placeholder="Enter your last name"
                  />
                  <FormField
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    error={errors.email}
                    placeholder="Enter your email"
                  />
                  <FormField
                    label="Phone Number"
                    icon={Phone}
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    error={errors.phone}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Income & Employment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Annual Income"
                    icon={DollarSign}
                    type="text"
                    value={formData.annualIncome}
                    onChange={(value) => handleInputChange('annualIncome', value)}
                    error={errors.annualIncome}
                    placeholder="$50,000"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment Status
                    </label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white ${
                        errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select employment status</option>
                      <option value="employed">Employed Full-Time</option>
                      <option value="part-time">Employed Part-Time</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="retired">Retired</option>
                      <option value="student">Student</option>
                    </select>
                    {errors.employmentStatus && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.employmentStatus}
                      </p>
                    )}
                  </div>
                  <FormField
                    label="Employer Name"
                    icon={Building}
                    type="text"
                    value={formData.employerName}
                    onChange={(value) => handleInputChange('employerName', value)}
                    error={errors.employerName}
                    placeholder="Company name"
                  />
                  <FormField
                    label="Job Title"
                    icon={Briefcase}
                    type="text"
                    value={formData.jobTitle}
                    onChange={(value) => handleInputChange('jobTitle', value)}
                    error={errors.jobTitle}
                    placeholder="Your position"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Review & Submit
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Application Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium text-gray-900">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium text-gray-900">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium text-gray-900">{formData.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Annual Income:</span>
                        <span className="ml-2 font-medium text-gray-900">{formData.annualIncome}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Employment:</span>
                        <span className="ml-2 font-medium text-gray-900">{formData.employmentStatus}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Employer:</span>
                        <span className="ml-2 font-medium text-gray-900">{formData.employerName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                    <p className="text-blue-800 text-sm">
                      After submitting your application, you&apos;ll receive an instant pre-approval decision. 
                      Our finance team will then contact you within 24 hours to finalize your loan terms.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </motion.button>

            {currentStep < 3 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                <CheckCircle className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

function FormField({ label, icon: Icon, type, value, onChange, error, placeholder }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">Loading...</div>}>
      <ApplyPageContent />
    </Suspense>
  );
} 