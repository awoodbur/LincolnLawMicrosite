'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { intakeSchema, type IntakeFormData } from '@/lib/validation/intake';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProgressBar } from '@/components/ProgressBar';
import { InfoCard } from '@/components/InfoCard';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';

const TOTAL_STEPS = 5;
const STORAGE_KEY = 'lincoln-law-intake-data';

export default function IntakePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      state: 'Utah',
      county: '',
      householdSize: 1,
      maritalStatus: 'Single',
      monthlyIncomeRange: '<$3k',
      unsecuredDebtRange: '<$10k',
      employmentStatus: 'Employed',
      missedPayments: false,
      wageGarnishment: false,
      propertyConcerns: false,
      notes: '',
      // Step 5 fields
      monthlyIncome: undefined,
      monthlyExpenses: undefined,
      homeEquity: undefined,
      vehicleEquity: undefined,
      hasValuableAssets: undefined,
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach((key) => {
          setValue(key as keyof IntakeFormData, data[key]);
        });
      } catch (e) {
        console.error('Failed to load saved data', e);
      }
    }
  }, [setValue]);

  // Auto-save to localStorage on change
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: IntakeFormData) => {
    // Store intake data for next page
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    router.push('/intake/email');
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              Financial Assessment
            </h1>
            <p className="text-gray-600">
              Help us understand your situation so we can provide the best guidance for your bankruptcy options in Utah.
            </p>
          </div>

          {/* Info Card - Privacy Notice */}
          <InfoCard variant="info" className="mb-6">
            <p>
              Your information is securely stored and will only be used to assess your bankruptcy options.
              All responses are confidential and protected by attorney-client privilege.
            </p>
          </InfoCard>

          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar step={currentStep} total={TOTAL_STEPS} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Utah Validation */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Location Information</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value="Utah"
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-sm text-blue-600 mt-1">
                        ✓ This service is available for Utah residents
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="county">County (Optional)</Label>
                      <Input
                        id="county"
                        {...register('county')}
                        placeholder="e.g., Salt Lake"
                      />
                      {errors.county && (
                        <p className="text-sm text-red-600 mt-1">{errors.county.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Household Info */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Household Information</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="householdSize">Household Size *</Label>
                      <Select
                        value={watch('householdSize')?.toString()}
                        onValueChange={(value) => setValue('householdSize', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select household size" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'person' : 'people'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.householdSize && (
                        <p className="text-sm text-red-600 mt-1">{errors.householdSize.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Marital Status *</Label>
                      <RadioGroup
                        value={watch('maritalStatus')}
                        onValueChange={(value) => setValue('maritalStatus', value as any)}
                        className="mt-2"
                      >
                        {['Single', 'Married', 'Separated'].map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <RadioGroupItem value={status} id={status} />
                            <Label htmlFor={status} className="font-normal cursor-pointer">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.maritalStatus && (
                        <p className="text-sm text-red-600 mt-1">{errors.maritalStatus.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Financial Snapshot */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Financial Snapshot</h2>

                  <div className="space-y-4">
                    <div>
                      <Label>Monthly Income Range *</Label>
                      <RadioGroup
                        value={watch('monthlyIncomeRange')}
                        onValueChange={(value) => setValue('monthlyIncomeRange', value as any)}
                        className="mt-2"
                      >
                        {['<$3k', '$3–5k', '$5–8k', '$8k+'].map((range) => (
                          <div key={range} className="flex items-center space-x-2">
                            <RadioGroupItem value={range} id={`income-${range}`} />
                            <Label htmlFor={`income-${range}`} className="font-normal cursor-pointer">
                              {range}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.monthlyIncomeRange && (
                        <p className="text-sm text-red-600 mt-1">{errors.monthlyIncomeRange.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Unsecured Debt Range *</Label>
                      <RadioGroup
                        value={watch('unsecuredDebtRange')}
                        onValueChange={(value) => setValue('unsecuredDebtRange', value as any)}
                        className="mt-2"
                      >
                        {['<$10k', '$10–25k', '$25–50k', '$50k+'].map((range) => (
                          <div key={range} className="flex items-center space-x-2">
                            <RadioGroupItem value={range} id={`debt-${range}`} />
                            <Label htmlFor={`debt-${range}`} className="font-normal cursor-pointer">
                              {range}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.unsecuredDebtRange && (
                        <p className="text-sm text-red-600 mt-1">{errors.unsecuredDebtRange.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Employment Status *</Label>
                      <RadioGroup
                        value={watch('employmentStatus')}
                        onValueChange={(value) => setValue('employmentStatus', value as any)}
                        className="mt-2"
                      >
                        {['Employed', 'Self-employed', 'Unemployed', 'Retired'].map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <RadioGroupItem value={status} id={`employment-${status}`} />
                            <Label htmlFor={`employment-${status}`} className="font-normal cursor-pointer">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.employmentStatus && (
                        <p className="text-sm text-red-600 mt-1">{errors.employmentStatus.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Situation */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Current Situation</h2>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="missedPayments"
                          {...register('missedPayments')}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="missedPayments" className="font-normal cursor-pointer">
                          I have missed payments on debts
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="wageGarnishment"
                          {...register('wageGarnishment')}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="wageGarnishment" className="font-normal cursor-pointer">
                          I am facing wage garnishment
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="propertyConcerns"
                          {...register('propertyConcerns')}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="propertyConcerns" className="font-normal cursor-pointer">
                          I have concerns about property/assets
                        </Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <textarea
                        id="notes"
                        {...register('notes')}
                        className="w-full mt-1 rounded-md border border-gray-300 p-3 min-h-[100px]"
                        placeholder="Tell us anything else that might be relevant to your situation..."
                      />
                      {errors.notes && (
                        <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Detailed Financial Information */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Detailed Financial Information</h2>
                  <p className="text-gray-600 mb-4">
                    This information helps us determine your preliminary bankruptcy eligibility and recommend the best chapter for your situation.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="monthlyIncome">
                        Average Monthly Gross Income (last 6 months) *
                      </Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 4000"
                        {...register('monthlyIncome', { valueAsNumber: true })}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Include all sources: wages, benefits, self-employment, etc.
                      </p>
                      {errors.monthlyIncome && (
                        <p className="text-sm text-red-600 mt-1">{errors.monthlyIncome.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="monthlyExpenses">
                        Monthly Necessary Living Expenses *
                      </Label>
                      <Input
                        id="monthlyExpenses"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 3800"
                        {...register('monthlyExpenses', { valueAsNumber: true })}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Rent/mortgage, utilities, food, transportation, insurance, etc.
                      </p>
                      {errors.monthlyExpenses && (
                        <p className="text-sm text-red-600 mt-1">{errors.monthlyExpenses.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="homeEquity">
                        Primary Residence Equity *
                      </Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex-1">
                          <Input
                            id="homeEquity"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g., 20000"
                            disabled={watch('homeEquity') === 'NA'}
                            {...register('homeEquity', {
                              setValueAs: (v) => (watch('homeEquity') === 'NA' ? 'NA' : parseFloat(v) || 0),
                            })}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="noHome"
                            checked={watch('homeEquity') === 'NA'}
                            onChange={(e) => setValue('homeEquity', e.target.checked ? 'NA' : 0)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="noHome" className="font-normal cursor-pointer">
                            I don't own a home
                          </Label>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Market value minus mortgage balance
                      </p>
                      {errors.homeEquity && (
                        <p className="text-sm text-red-600 mt-1">{errors.homeEquity.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="vehicleEquity">
                        Total Vehicle Equity (All Vehicles Combined) *
                      </Label>
                      <Input
                        id="vehicleEquity"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 3000"
                        {...register('vehicleEquity', { valueAsNumber: true })}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Combined market value minus loan balances for all vehicles
                      </p>
                      {errors.vehicleEquity && (
                        <p className="text-sm text-red-600 mt-1">{errors.vehicleEquity.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Do you own any non-exempt items worth more than $500? *</Label>
                      <p className="text-sm text-gray-500 mb-2">
                        Examples: jewelry, collectibles, valuable electronics, recreational vehicles, etc.
                      </p>
                      <RadioGroup
                        value={watch('hasValuableAssets') !== undefined ? String(watch('hasValuableAssets')) : undefined}
                        onValueChange={(value) => setValue('hasValuableAssets', value === 'true')}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="no-valuable" />
                          <Label htmlFor="no-valuable" className="font-normal cursor-pointer">
                            No, I don't have valuable items
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="yes-valuable" />
                          <Label htmlFor="yes-valuable" className="font-normal cursor-pointer">
                            Yes, I have valuable items
                          </Label>
                        </div>
                      </RadioGroup>
                      {errors.hasValuableAssets && (
                        <p className="text-sm text-red-600 mt-1">{errors.hasValuableAssets.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <InfoCard variant="info">
                  <p>
                    This information will be used to provide a preliminary bankruptcy eligibility assessment.
                    All data is confidential and protected.
                  </p>
                </InfoCard>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                    Continue to Email <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
