// features/prescription/hooks/usePrescriptionValidation.ts
import { useMemo } from 'react';
import type { Medication, Prescription } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationWarning {
  type: 'interaction' | 'allergy' | 'dosage' | 'duplicate' | 'controlled';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export function usePrescriptionValidation(
  medications: Medication[],
  patientAllergies?: string[],
  patientCurrentMeds?: string[]
): ValidationResult {
  return useMemo(() => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate medications array
    if (!medications.length) {
      errors.push({
        field: 'medications',
        message: 'At least one medication is required',
      });
    }

    medications.forEach((med, index) => {
      // Validate required fields
      if (!med.drugName) {
        errors.push({
          field: `medications[${index}].drugName`,
          message: 'Drug name is required',
        });
      }

      if (!med.dosage) {
        errors.push({
          field: `medications[${index}].dosage`,
          message: 'Dosage is required',
        });
      }

      // Check for duplicate medications
      const duplicates = medications.filter(
        (m, i) => i !== index && m.drugId === med.drugId
      );
      if (duplicates.length > 0) {
        warnings.push({
          type: 'duplicate',
          message: `${med.drugName} appears multiple times in this prescription`,
          severity: 'medium',
        });
      }

      // Check controlled substances
      if (med.isControlledSubstance) {
        warnings.push({
          type: 'controlled',
          message: `${med.drugName} is a controlled substance (Schedule ${med.schedule})`,
          severity: 'high',
        });
      }

      // Check dosage ranges
      if (med.strength) {
        const strengthValue = parseFloat(med.strength);
        if (strengthValue > 1000) {
          warnings.push({
            type: 'dosage',
            message: `Unusually high dosage for ${med.drugName}: ${med.strength}`,
            severity: 'high',
          });
        }
      }
    });

    // Check allergies
    if (patientAllergies?.length) {
      medications.forEach((med) => {
        if (patientAllergies.includes(med.drugName)) {
          errors.push({
            field: 'medications',
            message: `Patient is allergic to ${med.drugName}`,
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [medications, patientAllergies, patientCurrentMeds]);
}