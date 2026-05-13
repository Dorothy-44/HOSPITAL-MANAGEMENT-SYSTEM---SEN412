// features/prescription/components/PrescriptionHistory.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { usePrescriptions } from '../hooks/usePrescriptions';
import { PrescriptionPreview } from './PrescriptionPreview';
import type { Prescription, PrescriptionStatus } from '../types';

const statusConfig: Record<PrescriptionStatus, {
  icon: React.ReactNode;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  label: string;
}> = {
  'draft': { icon: <FileText className="w-4 h-4" />, variant: 'secondary', label: 'Draft' },
  'pending-review': { icon: <Clock className="w-4 h-4" />, variant: 'secondary', label: 'Pending Review' },
  'approved': { icon: <CheckCircle2 className="w-4 h-4" />, variant: 'default', label: 'Approved' },
  'active': { icon: <CheckCircle2 className="w-4 h-4" />, variant: 'default', label: 'Active' },
  'dispensed': { icon: <CheckCircle2 className="w-4 h-4" />, variant: 'default', label: 'Dispensed' },
  'expired': { icon: <XCircle className="w-4 h-4" />, variant: 'destructive', label: 'Expired' },
  'cancelled': { icon: <XCircle className="w-4 h-4" />, variant: 'destructive', label: 'Cancelled' },
  'on-hold': { icon: <AlertCircle className="w-4 h-4" />, variant: 'outline', label: 'On Hold' },
};

export const PrescriptionHistory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filters = {
    status: statusFilter !== 'all' ? [statusFilter] : undefined,
    dateRange: dateRange !== 'all' ? {
      start: new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000),
      end: new Date(),
    } : undefined,
  };

  const { data: prescriptions, isLoading } = usePrescriptions(filters);

  const filteredPrescriptions = prescriptions?.filter(p => 
    p.prescriptionNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.patient?.firstName.toLowerCase().includes(search.toLowerCase()) ||
    p.patient?.lastName.toLowerCase().includes(search.toLowerCase()) ||
    p.doctor?.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescription History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all prescriptions
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by prescription #, patient name, or doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as PrescriptionStatus | 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending-review">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="dispensed">Dispensed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateRange}
              onValueChange={(value) => setDateRange(value as '7' | '30' | '90' | 'all')}
            >
              <SelectTrigger className="w-[150px]">
                <Clock className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prescription #</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Refills</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions?.map((prescription) => {
                const status = statusConfig[prescription.status];
                return (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">
                      {prescription.prescriptionNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {prescription.patient?.firstName} {prescription.patient?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {prescription.patient?.mrn}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      Dr. {prescription.doctor?.lastName}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{format(new Date(prescription.issuedDate), 'MMM d, yyyy')}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(prescription.issuedDate), 'h:mm a')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {prescription.medications.slice(0, 2).map((med, i) => (
                          <div key={i} className="text-sm">
                            {med.drugName} {med.strength}
                          </div>
                        ))}
                        {prescription.medications.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            +{prescription.medications.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        <span className="flex items-center gap-1">
                          {status.icon}
                          {status.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {prescription.refills - prescription.refillsUsed} / {prescription.refills}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPrescription(prescription);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <PrescriptionPreview
              data={selectedPrescription}
              medications={selectedPrescription.medications}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};