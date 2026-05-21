

export type PrescriptionStatus =
  | "PENDING"
  | "DISPENSED"
  | "CANCELLED"
  | "EXPIRED";

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  prescribedBy: string;
  drugName: string;
  dosage: string;
  frequency: string;
  quantity: number;
  refillsAllowed: number;
  refillsUsed: number;
  status: PrescriptionStatus;
  prescribedAt: Date;
  dispensedAt?: Date;
  expiresAt: Date;
  notes?: string;
}

export type NewPrescription = Omit
  Prescription,
  "id" | "refillsUsed" | "status" | "prescribedAt" | "dispensedAt"
>;

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class PharmacyMockStore {
  private prescriptions: Prescription[] = [];

  addPrescription(data: NewPrescription): Prescription {
    if (!data.patientId || !data.drugName || !data.prescribedBy)
      throw new Error("Missing required fields: patientId, drugName, prescribedBy");
    if (data.quantity <= 0)
      throw new Error("Quantity must be a positive number.");
    if (data.expiresAt <= new Date())
      throw new Error("Expiry date must be in the future.");

    const prescription: Prescription = {
      ...data,
      id: generateId(),
      refillsUsed: 0,
      status: "PENDING",
      prescribedAt: new Date(),
    };

    this.prescriptions.push(prescription);
    return prescription;
  }

  getPatientHistory(patientId: string, filterStatus?: PrescriptionStatus): Prescription[] {
    if (!patientId) throw new Error("patientId is required.");

    let results = this.prescriptions.filter((p) => p.patientId === patientId);
    if (filterStatus) results = results.filter((p) => p.status === filterStatus);

    return results.sort((a, b) => b.prescribedAt.getTime() - a.prescribedAt.getTime());
  }

  dispensePrescription(prescriptionId: string): Prescription {
    const rx = this.findById(prescriptionId);

    if (rx.status === "CANCELLED") throw new Error("Cannot dispense a cancelled prescription.");
    if (rx.status === "EXPIRED" || new Date() > rx.expiresAt) {
      rx.status = "EXPIRED";
      throw new Error("Prescription has expired.");
    }
    if (rx.refillsUsed > rx.refillsAllowed) throw new Error("No refills remaining.");

    rx.status = "DISPENSED";
    rx.dispensedAt = new Date();
    rx.refillsUsed += 1;
    return rx;
  }

  cancelPrescription(prescriptionId: string, reason?: string): Prescription {
    const rx = this.findById(prescriptionId);
    if (rx.status === "DISPENSED") throw new Error("Cannot cancel an already dispensed prescription.");
    rx.status = "CANCELLED";
    if (reason) rx.notes = `Cancelled: ${reason}`;
    return rx;
  }

  searchByDrug(drugName: string): Prescription[] {
    const term = drugName.toLowerCase();
    return this.prescriptions.filter((p) => p.drugName.toLowerCase().includes(term));
  }

  getAll(): Prescription[] {
    return [...this.prescriptions];
  }

  private findById(id: string): Prescription {
    const rx = this.prescriptions.find((p) => p.id === id);
    if (!rx) throw new Error(`Prescription not found: ${id}`);
    return rx;
  }
}

// ── Usage ────────────────────────────────────────────────────
const store = new PharmacyMockStore();

const rx = store.addPrescription({
  patientId:      "PAT-001",
  patientName:    "Amara Okonkwo",
  prescribedBy:   "DR-042",
  drugName:       "Amoxicillin",
  dosage:         "500mg",
  frequency:      "Three times daily",
  quantity:       21,
  refillsAllowed: 1,
  expiresAt:      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  notes:          "Take with food",
});

store.dispensePrescription(rx.id);
console.log(store.getPatientHistory("PAT-001"));