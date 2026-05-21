// pages/prescriptions/page.tsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { PrescriptionBuilder } from '@/features/prescription/components/PrescriptionBuilder';
import { PrescriptionHistory } from '@/features/prescription/components/PrescriptionHistory';
import { PendingApprovals } from '@/features/prescription/components/PendingApprovals';
import { PrescriptionStats } from '@/features/prescription/components/PrescriptionStats';

export const PrescriptionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="new" className="w-full">
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="new">New Prescription</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="new">
          <PrescriptionBuilder />
        </TabsContent>

        <TabsContent value="history">
          <PrescriptionHistory />
        </TabsContent>

        <TabsContent value="approvals">
          <PendingApprovals />
        </TabsContent>

        <TabsContent value="stats">
          <PrescriptionStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};