'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { intakeSchema, type IntakeFormData } from '@/lib/validation/intake';
import { getIncomeThreshold, formatThreshold } from '@/lib/config/income-thresholds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProgressBar } from '@/components/ProgressBar';
import { InfoCard } from '@/components/InfoCard';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';

const TOTAL_STEPS = 4;
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
      priorBankruptcy: undefined as any,
      missedPayments: false,
      wageGarnishment: false,
      propertyConcerns: false,
      notes: '',
      // Step 3 fields
      incomeAboveThreshold: undefined,
      monthlyExpenses: undefined,
      unsecuredDebt: undefined,
      homeEquity: undefined,
      vehicleEquity: undefined,
      hasValuableAssets: undefined,
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = form;

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

  const nextStep = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: (keyof IntakeFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['state', 'county', 'householdSize', 'maritalStatus'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['monthlyIncomeRange', 'unsecuredDebtRange', 'employmentStatus', 'priorBankruptcy', 'missedPayments', 'wageGarnishment', 'propertyConcerns'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['incomeAboveThreshold', 'monthlyExpenses', 'unsecuredDebt', 'homeEquity', 'vehicleEquity', 'hasValuableAssets'];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-parchment/80 backdrop-blur-sm rounded-2xl cabin-shadow parchment-texture border-2 border-wood-light/30 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-serif text-4xl font-bold text-wood-dark mb-3">
              Financial Assessment
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed">
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
            {/* Step 1: Location & Household */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-wood-dark mb-6">Location & Household</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="state">Are you a Utah resident? *</Label>
                      <Input
                        id="state"
                        value="Utah"
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-sm text-forest-dark font-medium mt-1">
                        ✓ This service is available for Utah residents
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="county">What county do you live in? (Optional)</Label>
                      <Select
                        value={watch('county') || ''}
                        onValueChange={(value) => setValue('county', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="(Select county)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beaver County">Beaver County</SelectItem>
                          <SelectItem value="Box Elder County">Box Elder County</SelectItem>
                          <SelectItem value="Cache County">Cache County</SelectItem>
                          <SelectItem value="Carbon County">Carbon County</SelectItem>
                          <SelectItem value="Daggett County">Daggett County</SelectItem>
                          <SelectItem value="Davis County">Davis County</SelectItem>
                          <SelectItem value="Duchesne County">Duchesne County</SelectItem>
                          <SelectItem value="Emery County">Emery County</SelectItem>
                          <SelectItem value="Garfield County">Garfield County</SelectItem>
                          <SelectItem value="Grand County">Grand County</SelectItem>
                          <SelectItem value="Iron County">Iron County</SelectItem>
                          <SelectItem value="Juab County">Juab County</SelectItem>
                          <SelectItem value="Kane County">Kane County</SelectItem>
                          <SelectItem value="Millard County">Millard County</SelectItem>
                          <SelectItem value="Morgan County">Morgan County</SelectItem>
                          <SelectItem value="Piute County">Piute County</SelectItem>
                          <SelectItem value="Rich County">Rich County</SelectItem>
                          <SelectItem value="Salt Lake County">Salt Lake County</SelectItem>
                          <SelectItem value="San Juan County">San Juan County</SelectItem>
                          <SelectItem value="Sanpete County">Sanpete County</SelectItem>
                          <SelectItem value="Sevier County">Sevier County</SelectItem>
                          <SelectItem value="Summit County">Summit County</SelectItem>
                          <SelectItem value="Tooele County">Tooele County</SelectItem>
                          <SelectItem value="Uintah County">Uintah County</SelectItem>
                          <SelectItem value="Utah County">Utah County</SelectItem>
                          <SelectItem value="Wasatch County">Wasatch County</SelectItem>
                          <SelectItem value="Washington County">Washington County</SelectItem>
                          <SelectItem value="Wayne County">Wayne County</SelectItem>
                          <SelectItem value="Weber County">Weber County</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.county && (
                        <p className="text-sm text-red-600 mt-1">{errors.county.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="householdSize">How many people are in your household? *</Label>
                      <Select
                        value={watch('householdSize')?.toString()}
                        onValueChange={(value) => setValue('householdSize', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select household size" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                          <SelectItem value="8">8+</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.householdSize && (
                        <p className="text-sm text-red-600 mt-1">{errors.householdSize.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>What is your marital status? *</Label>
                      <RadioGroup
                        value={watch('maritalStatus')}
                        onValueChange={(value) => setValue('maritalStatus', value as any)}
                        className="mt-2"
                      >
                        {['Single', 'Married', 'Separated', 'Divorced'].map((status) => (
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

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Employment & History */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-wood-dark mb-6">Employment & History</h2>

                  <div className="space-y-4">
                    <div>
                      <Label>What is your current employment status? *</Label>
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

                    <div>
                      <Label>Have you filed for bankruptcy before? *</Label>
                      <RadioGroup
                        value={watch('priorBankruptcy') !== undefined ? String(watch('priorBankruptcy')) : undefined}
                        onValueChange={(value) => setValue('priorBankruptcy', value === 'true')}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="prior-no" />
                          <Label htmlFor="prior-no" className="font-normal cursor-pointer">
                            No
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="prior-yes" />
                          <Label htmlFor="prior-yes" className="font-normal cursor-pointer">
                            Yes
                          </Label>
                        </div>
                      </RadioGroup>
                      {errors.priorBankruptcy && (
                        <p className="text-sm text-red-600 mt-1">{errors.priorBankruptcy.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Are any of these situations affecting you? (Optional - select all that apply)</Label>
                      <div className="space-y-3 mt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="missedPayments"
                            {...register('missedPayments')}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="missedPayments" className="font-normal cursor-pointer">
                            I am behind on debt payments
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
                            I am concerned about losing property or assets
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Is there anything else you'd like us to know? (Optional)</Label>
                      <textarea
                        id="notes"
                        {...register('notes')}
                        className="w-full mt-1 rounded-md border border-gray-300 p-3 min-h-[100px]"
                        placeholder="Optional: Share any additional details about your situation..."
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

            {/* Step 3: Detailed Financial Information */}
            {currentStep === 3 && (() => {
              const householdSize = watch('householdSize') || 1;
              const annualThreshold = getIncomeThreshold(householdSize);
              const formattedThreshold = formatThreshold(annualThreshold);

              return (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-wood-dark mb-2">Detailed Financial Information</h2>
                    <p className="text-gray-600 mb-6">
                      This information helps us determine your preliminary bankruptcy eligibility and recommend the best chapter for your situation.
                    </p>

                    <div className="space-y-6">
                      {/* Income & Expenses Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-wood-dark">Income & Expenses</h3>

                        <div>
                          <Label>Is your household income above or below {formattedThreshold} per year? *</Label>
                          <p className="text-sm text-gray-500 mb-2">
                            This is the Utah median income for a household of {householdSize} {householdSize === 1 ? 'person' : 'people'}
                          </p>
                          <RadioGroup
                            value={watch('incomeAboveThreshold') !== undefined ? String(watch('incomeAboveThreshold')) : undefined}
                            onValueChange={(value) => setValue('incomeAboveThreshold', value === 'true')}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id="income-above" />
                              <Label htmlFor="income-above" className="font-normal cursor-pointer">
                                Above {formattedThreshold}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="income-below" />
                              <Label htmlFor="income-below" className="font-normal cursor-pointer">
                                Below {formattedThreshold}
                              </Label>
                            </div>
                          </RadioGroup>
                          {errors.incomeAboveThreshold && (
                            <p className="text-sm text-red-600 mt-1">{errors.incomeAboveThreshold.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="monthlyExpenses">Monthly Necessary Living Expenses *</Label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              id="monthlyExpenses"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="e.g., 3800"
                              className="pl-7"
                              {...register('monthlyExpenses', { valueAsNumber: true })}
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Rent/mortgage, utilities, food, transportation, insurance, etc.
                          </p>
                          {errors.monthlyExpenses && (
                            <p className="text-sm text-red-600 mt-1">{errors.monthlyExpenses.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Debt Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-wood-dark">Debt</h3>

                        <div>
                          <Label>What is your approximate total unsecured debt? *</Label>
                          <p className="text-sm text-gray-500 mb-2">
                            Unsecured debt includes credit cards, medical bills, personal loans, etc. (not mortgages or car loans)
                          </p>
                          <RadioGroup
                            value={watch('unsecuredDebt') || ''}
                            onValueChange={(value) => setValue('unsecuredDebt', value as any)}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="<$10k" id="debt-10k" />
                              <Label htmlFor="debt-10k" className="font-normal cursor-pointer">
                                Less than $10,000
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="$10-25k" id="debt-10-25k" />
                              <Label htmlFor="debt-10-25k" className="font-normal cursor-pointer">
                                $10,000 - $25,000
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="$25-50k" id="debt-25-50k" />
                              <Label htmlFor="debt-25-50k" className="font-normal cursor-pointer">
                                $25,000 - $50,000
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="$50k+" id="debt-50k-plus" />
                              <Label htmlFor="debt-50k-plus" className="font-normal cursor-pointer">
                                More than $50,000
                              </Label>
                            </div>
                          </RadioGroup>
                          {errors.unsecuredDebt && (
                            <p className="text-sm text-red-600 mt-1">{errors.unsecuredDebt.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Assets Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-wood-dark">Assets</h3>

                        <div>
                          <Label htmlFor="homeEquity">Primary Residence Equity *</Label>
                          <div className="space-y-3 mt-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="noHome"
                                checked={watch('homeEquity') === 'NA'}
                                onChange={() => setValue('homeEquity', 'NA')}
                                className="rounded-full border-gray-300"
                              />
                              <Label htmlFor="noHome" className="font-normal cursor-pointer">
                                I don't own a home
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="hasHome"
                                checked={watch('homeEquity') !== 'NA' && watch('homeEquity') !== undefined}
                                onChange={() => {
                                  if (watch('homeEquity') === 'NA' || watch('homeEquity') === undefined) {
                                    setValue('homeEquity', 0);
                                  }
                                }}
                                className="rounded-full border-gray-300"
                              />
                              <Label htmlFor="hasHome" className="font-normal cursor-pointer">
                                OR enter equity amount:
                              </Label>
                            </div>
                            {watch('homeEquity') !== 'NA' && watch('homeEquity') !== undefined && (
                              <div className="relative ml-6">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                  id="homeEquity"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="e.g., 20000"
                                  className="pl-7"
                                  {...register('homeEquity', {
                                    setValueAs: (v) => (watch('homeEquity') === 'NA' ? 'NA' : parseFloat(v) || 0),
                                  })}
                                />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Market value minus mortgage balance
                          </p>
                          {errors.homeEquity && (
                            <p className="text-sm text-red-600 mt-1">{errors.homeEquity.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="vehicleEquity">Total Vehicle Equity (All Vehicles Combined) *</Label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              id="vehicleEquity"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="e.g., 3000"
                              className="pl-7"
                              {...register('vehicleEquity', { valueAsNumber: true })}
                            />
                          </div>
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
              );
            })()}
          </form>
        </div>
      </div>
    </div>
  );
}
