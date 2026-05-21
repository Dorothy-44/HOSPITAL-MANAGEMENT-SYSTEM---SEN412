// features/prescription/components/PrescriptionBuilder.tsx
import React, { useState, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { 
  Plus, 
  Trash2, 
  Search, 
  AlertTriangle, 
  Check,
  Save,
  Send,
  Printer,
  History,
  Eye
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { PatientSearch } from './PatientSearch';
import { MedicationSelector } from './MedicationSelector';
import { DiagnosisForm } from './DiagnosisForm';
import { PrescriptionPreview } from './PrescriptionPreview';
import { useCreatePrescription, useCheckDrugInteractions } from '../hooks/usePrescriptions';
import { usePrescriptionValidation } from '../hooks/usePrescriptionValidation';
import type { Medication, Diagnosis } from '../types';

const medicationSchema = z.object({
  drugId: z.string().min(1, 'Medication is required'),
  drugName: z.string().min(1),
  genericName: z.string().optional(),
  strength: z.string().min(1, 'Strength is required'),
  form: z.enum(['tablet', 'capsule', 'liquid', 'injection', 'topical', 'inhaler', 'drops', 'suppository', 'patch', 'other']),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  quantity: z.number().min(1, 'Quantity is required'),
  refills: z.number().min(0).max(12),
  instructions: z.string().min(1, 'Instructions are required'),
  isPRN: z.boolean().default(false),
  startDate: z.date(),
});

const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  diagnosis: z.object({
    primary: z.object({
      code: z.string().min(1),
      description: z.string().min(1),
      severity: z.enum(['mild', 'moderate', 'severe']),
    }),
    secondary: z.array(z.object({
      code: z.string(),
      description: z.string(),
      severity: z.enum(['mild', 'moderate', 'severe']),
    })).optional(),
    notes: z.string(),
  }),
  medications: z.array(medicationSchema).min(1, 'At least one medication is required'),
  instructions: z.string().min(1, 'General instructions are required'),
  notes: z.string().optional(),
  pharmacyId: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

export const PrescriptionBuilder: React.FC = () => {
  const [step, setStep] = useState<'patient' | 'diagnosis' | 'medications' | 'review'>('patient');
  const [showPreview, setShowPreview] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  
  const createPrescription = useCreatePrescription();
  const checkInteractions = useCheckDrugInteractions();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  const medications = watch('medications');
  
  const validation = usePrescriptionValidation(
    medications || [],
    // TODO: Get from patient context
    [],
    []
  );

  const handleAddMedication = (medication: Medication) => {
    append(medication);
  };

  const handleRemoveMedication = (index: number) => {
    remove(index);
  };

  const handleCheckInteractions = async () => {
    const meds = getValues('medications');
    if (meds.length > 1) {
      const interactions = await checkInteractions.mutateAsync(
        meds.map(m => m.drugId)
      );
      
      if (interactions.length > 0) {
        // Show interaction warnings
        toast.warning(`${interactions.length} potential drug interactions found`);
      } else {
        toast.success('No drug interactions found');
      }
    }
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    if (saveAsDraft) {
      // Save as draft logic
      console.log('Saving as draft:', data);
      return;
    }

    await createPrescription.mutateAsync(data as any);
  };

  const steps = [
    { id: 'patient', label: 'Select Patient' },
    { id: 'diagnosis', label: 'Diagnosis' },
    { id: 'medications', label: 'Medications' },
    { id: 'review', label: 'Review & Send' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            New Prescription
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage patient prescriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => setSaveAsDraft(true)}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center space-x-4">
        {steps.map((s, index) => (
          <React.Fragment key={s.id}>
            <Button
              variant={step === s.id ? 'default' : 'outline'}
              className={`${
                step === s.id ? '' : ''
              } relative`}
              onClick={() => setStep(s.id as any)}
            >
              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2">
                {index + 1}
              </span>
              {s.label}
            </Button>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-border" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 'patient' && (
          <Card>
            <CardHeader>
              <CardTitle>Select Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="patientId"
                control={control}
                render={({ field }) => (
                  <PatientSearch
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.patientId && (
                <p className="text-sm text-destructive mt-2">
                  {errors.patientId.message}
                </p>
              )}
              <div className="flex justify-end mt-4">
                <Button onClick={() => setStep('diagnosis')}>
                  Next: Diagnosis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'diagnosis' && (
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="diagnosis"
                control={control}
                render={({ field }) => (
                  <DiagnosisForm
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.diagnosis && (
                <p className="text-sm text-destructive mt-2">
                  {errors.diagnosis.message}
                </p>
              )}
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setStep('patient')}>
                  Back
                </Button>
                <Button onClick={() => setStep('medications')}>
                  Next: Medications
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'medications' && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Medications</CardTitle>
                <Button
                  variant="outline"
                  onClick={handleCheckInteractions}
                  disabled={medications?.length < 2}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Check Interactions
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Validation Warnings */}
                {validation.warnings.length > 0 && (
                  <Alert variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warnings</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4 mt-2 space-y-1">
                        {validation.warnings.map((warning, index) => (
                          <li key={index}>{warning.message}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Medication List */}
                {fields.map((field, index) => (
                  <Card key={field.id} className="relative">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {field.drugName}
                          </h4>
                          {field.genericName && (
                            <p className="text-sm text-muted-foreground">
                              {field.genericName}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMedication(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Strength
                          </label>
                          <Input
                            {...register(`medications.${index}.strength`)}
                            placeholder="e.g., 500mg"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Form
                          </label>
                          <Controller
                            name={`medications.${index}.form`}
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <option value="tablet">Tablet</option>
                                <option value="capsule">Capsule</option>
                                <option value="liquid">Liquid</option>
                                <option value="injection">Injection</option>
                                <option value="topical">Topical</option>
                                <option value="inhaler">Inhaler</option>
                                <option value="drops">Drops</option>
                              </Select>
                            )}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Dosage
                          </label>
                          <Input
                            {...register(`medications.${index}.dosage`)}
                            placeholder="e.g., 1 tablet"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Frequency
                          </label>
                          <Input
                            {...register(`medications.${index}.frequency`)}
                            placeholder="e.g., twice daily"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Duration
                          </label>
                          <Input
                            {...register(`medications.${index}.duration`)}
                            placeholder="e.g., 7 days"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Quantity
                          </label>
                          <Input
                            type="number"
                            {...register(`medications.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Refills
                          </label>
                          <Input
                            type="number"
                            {...register(`medications.${index}.refills`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-medium">
                          Special Instructions
                        </label>
                        <Textarea
                          {...register(`medications.${index}.instructions`)}
                          placeholder="e.g., Take with food..."
                          rows={2}
                        />
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            {...register(`medications.${index}.isPRN`)}
                          />
                          <span className="text-sm">Take as needed (PRN)</span>
                        </label>
                      </div>

                      {field.isControlledSubstance && (
                        <Badge variant="destructive" className="mt-4">
                          Controlled Substance - Schedule {field.schedule}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Add Medication Button */}
                <div className="flex justify-center">
                  <MedicationSelector
                    onSelect={handleAddMedication}
                    trigger={
                      <Button variant="outline" size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medication
                      </Button>
                    }
                  />
                </div>

                {errors.medications && (
                  <p className="text-sm text-destructive">
                    {errors.medications.message}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('diagnosis')}>
                Back
              </Button>
              <Button onClick={() => setStep('review')}>
                Review Prescription
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    General Instructions
                  </h3>
                  <Textarea
                    {...register('instructions')}
                    placeholder="Enter general instructions for the patient..."
                    rows={4}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Additional Notes (Optional)
                  </h3>
                  <Textarea
                    {...register('notes')}
                    placeholder="Any additional notes for pharmacist or patient..."
                    rows={3}
                  />
                </div>

                <PrescriptionPreview
                  data={getValues()}
                  medications={medications || []}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep('medications')}
              >
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSaveAsDraft(true);
                    handleSubmit(onSubmit)();
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !validation.isValid}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Issue Prescription
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Prescription Preview</DialogTitle>
          </DialogHeader>
          <PrescriptionPreview
            data={getValues()}
            medications={medications || []}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};