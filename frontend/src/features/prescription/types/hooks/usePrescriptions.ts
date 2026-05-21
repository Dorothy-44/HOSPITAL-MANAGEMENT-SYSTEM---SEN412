// features/prescription/hooks/usePrescriptions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/shared/api/client';
import type { 
  Prescription, 
  CreatePrescriptionDTO, 
  PrescriptionFilters 
} from '../types';

export const prescriptionKeys = {
  all: ['prescriptions'] as const,
  lists: () => [...prescriptionKeys.all, 'list'] as const,
  list: (filters?: PrescriptionFilters) => 
    [...prescriptionKeys.lists(), filters] as const,
  details: () => [...prescriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...prescriptionKeys.details(), id] as const,
  patientPrescriptions: (patientId: string) => 
    [...prescriptionKeys.all, 'patient', patientId] as const,
  pendingApprovals: () => [...prescriptionKeys.all, 'pending-approvals'] as const,
};

export function usePrescriptions(filters?: PrescriptionFilters) {
  return useQuery({
    queryKey: prescriptionKeys.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<Prescription[]>('/prescriptions', { 
        params: filters 
      });
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePrescription(id: string) {
  return useQuery({
    queryKey: prescriptionKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Prescription>(`/prescriptions/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function usePatientPrescriptions(patientId: string) {
  return useQuery({
    queryKey: prescriptionKeys.patientPrescriptions(patientId),
    queryFn: async () => {
      const { data } = await apiClient.get<Prescription[]>(
        `/patients/${patientId}/prescriptions`
      );
      return data;
    },
    enabled: !!patientId,
  });
}

export function usePendingApprovals() {
  return useQuery({
    queryKey: prescriptionKeys.pendingApprovals(),
    queryFn: async () => {
      const { data } = await apiClient.get<Prescription[]>(
        '/prescriptions/pending-approvals'
      );
      return data;
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prescription: CreatePrescriptionDTO) => {
      const { data } = await apiClient.post<Prescription>(
        '/prescriptions', 
        prescription
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: prescriptionKeys.patientPrescriptions(data.patientId) 
      });
      toast.success('Prescription created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create prescription');
    },
  });
}

export function useUpdatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Prescription> 
    }) => {
      const { data } = await apiClient.patch<Prescription>(
        `/prescriptions/${id}`, 
        updates
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: prescriptionKeys.detail(data.id) 
      });
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
      toast.success('Prescription updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update prescription');
    },
  });
}

export function useApprovePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      approved 
    }: { 
      id: string; 
      approved: boolean;
      reason?: string;
    }) => {
      const { data } = await apiClient.post<Prescription>(
        `/prescriptions/${id}/approve`, 
        { approved }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
      toast.success('Prescription approval updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update approval');
    },
  });
}

export function useCancelPrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      reason 
    }: { 
      id: string; 
      reason: string 
    }) => {
      const { data } = await apiClient.post<Prescription>(
        `/prescriptions/${id}/cancel`, 
        { reason }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
      toast.success('Prescription cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel prescription');
    },
  });
}

export function useCheckDrugInteractions() {
  return useMutation({
    mutationFn: async (medications: string[]) => {
      const { data } = await apiClient.post<DrugInteraction[]>(
        '/prescriptions/check-interactions',
        { medications }
      );
      return data;
    },
  });
}