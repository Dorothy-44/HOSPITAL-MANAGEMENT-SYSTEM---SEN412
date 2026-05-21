// features/prescription/hooks/useMedicationTemplates.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/api/client';
import type { MedicationTemplate } from '../types';

export const templateKeys = {
  all: ['medication-templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  search: (query: string) => [...templateKeys.lists(), { query }] as const,
};

export function useMedicationTemplates(search?: string) {
  return useQuery({
    queryKey: templateKeys.search(search || ''),
    queryFn: async () => {
      const { data } = await apiClient.get<MedicationTemplate[]>(
        '/medications/templates',
        { params: { search } }
      );
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - meds don't change often
  });
}

export function useFrequentlyPrescribedMedications(doctorId: string) {
  return useQuery({
    queryKey: [...templateKeys.all, 'frequent', doctorId],
    queryFn: async () => {
      const { data } = await apiClient.get<MedicationTemplate[]>(
        `/doctors/${doctorId}/frequent-medications`
      );
      return data;
    },
    enabled: !!doctorId,
  });
}