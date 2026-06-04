// ============================================================
//  HOSPITAL MANAGEMENT SYSTEM — Backend Logic (JavaScript)
//  Modules: Patient Lifecycle | Clinical Records | Billing | Pharmacy
// ============================================================


const db = {
  patients: [],
  vitals: [],
  diagnoses: [],
  invoices: [],
  prescriptions: [],
  drugs: [],
  bloodBank: { "A+": 10, "A-": 4, "B+": 8, "B-": 3, "O+": 15, "O-": 8, "AB+": 5, "AB-": 2 },
  bloodTransactions: [],
  refillRequests: [],
  counters: { patientId: 1001, invoiceId: 5001, prescriptionId: 8001 },
};


// UTILITIES


function generateId(prefix, counter) {
  return `${prefix}${db.counters[counter]++}`;
}

function timestamp() {
  return new Date().toISOString();
}

function success(data) {
  return { success: true, data };
}

function error(message) {
  return { success: false, error: message };
}


// MODULE 1: PATIENT LIFECYCLE & IDENTITY


const PATIENT_STATES = ["Registered", "Triage", "Admitted", "Under Treatment", "Discharged"];

/**
 * Register a new patient into the system.
 * @param {Object} patientData - { firstName, lastName, age, gender, bloodType, phone, emergencyContact, chiefComplaint }
 * @returns {Object} result - success/error with patient record
 */
function registerPatient(patientData) {
  const { firstName, lastName, age, gender, bloodType, phone, emergencyContact, chiefComplaint } = patientData;

  if (!firstName || !lastName) return error("First name and last name are required.");
  if (!age || age < 0 || age > 150) return error("A valid age is required.");

  const patient = {
    id: generateId("P", "patientId"),
    firstName,
    lastName,
    age,
    gender: gender || "Not specified",
    bloodType: bloodType || "Unknown",
    phone: phone || "",
    emergencyContact: emergencyContact || "",
    chiefComplaint: chiefComplaint || "",
    state: "Registered",
    stateHistory: [{ state: "Registered", timestamp: timestamp() }],
    createdAt: timestamp(),
  };

  db.patients.push(patient);
  return success(patient);
}

/**
 * Advance a patient to a new state in their lifecycle.
 * @param {string} patientId
 * @param {string} newState - must be one of PATIENT_STATES
 * @returns {Object} result
 */
function advancePatientState(patientId, newState) {
  if (!PATIENT_STATES.includes(newState)) {
    return error(`Invalid state. Must be one of: ${PATIENT_STATES.join(", ")}`);
  }

  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) return error(`Patient ${patientId} not found.`);

  if (patient.state === "Discharged") {
    return error("Patient is already discharged. Cannot change state.");
  }

  const currentIndex = PATIENT_STATES.indexOf(patient.state);
  const newIndex = PATIENT_STATES.indexOf(newState);

  if (newIndex <= currentIndex) {
    return error(`Cannot move patient backward from "${patient.state}" to "${newState}".`);
  }

  patient.state = newState;
  patient.stateHistory.push({ state: newState, timestamp: timestamp() });

  return success(patient);
}

/**
 * Get a patient record by ID.
 * @param {string} patientId
 */
function getPatient(patientId) {
  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) return error(`Patient ${patientId} not found.`);
  return success(patient);
}

/**
 * Get all patients, optionally filtered by state.
 * @param {string|null} state - optional filter
 */
function getAllPatients(state = null) {
  const result = state
    ? db.patients.filter(p => p.state === state)
    : db.patients;
  return success(result);
}

/**
 * Get pipeline summary — count of patients per state.
 */
function getPatientPipeline() {
  const pipeline = {};
  PATIENT_STATES.forEach(s => {
    pipeline[s] = db.patients.filter(p => p.state === s).length;
  });
  return success(pipeline);
}


// MODULE 2: CLINICAL RECORDS & MEDICAL HISTORY


/**
 * Record vital signs for a patient.
 * @param {string} patientId
 * @param {Object} vitalsData - { bpSystolic, bpDiastolic, pulse, temperature, spO2, doctorNote }
 */
function recordVitals(patientId, vitalsData) {
  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) return error(`Patient ${patientId} not found.`);

  const { bpSystolic, bpDiastolic, pulse, temperature, spO2, doctorNote } = vitalsData;

  if (!bpSystolic || !bpDiastolic || !pulse || !temperature || !spO2) {
    return error("All vitals fields (BP, pulse, temperature, SpO2) are required.");
  }

  const status = classifyVitals({ bpSystolic, bpDiastolic, pulse, temperature, spO2 });

  const record = {
    id: `V${Date.now()}`,
    patientId,
    bpSystolic,
    bpDiastolic,
    pulse,
    temperature,
    spO2,
    doctorNote: doctorNote || "",
    status,
    recordedAt: timestamp(),
  };

  db.vitals.push(record);
  return success(record);
}

/**
 * Classify vitals as Normal, Warning, or Critical.
 * @param {Object} v - vitals object
 */
function classifyVitals(v) {
  if (
    v.bpSystolic > 180 || v.bpSystolic < 90 ||
    v.pulse > 120 || v.pulse < 40 ||
    v.temperature > 39 || v.temperature < 35 ||
    v.spO2 < 90
  ) return "Critical";

  if (
    v.bpSystolic > 140 ||
    v.pulse > 100 ||
    v.temperature > 38.3 ||
    v.spO2 < 95
  ) return "Warning";

  return "Normal";
}

/**
 * Get vitals history for a patient.
 * @param {string} patientId
 */
function getVitalsHistory(patientId) {
  const records = db.vitals.filter(v => v.patientId === patientId);
  return success(records);
}

/**
 * Add a diagnosis log entry for a patient.
 * @param {string} patientId
 * @param {Object} diagData - { doctor, icdCode, diagnosisName, severity, notes }
 */
function addDiagnosis(patientId, diagData) {
  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) return error(`Patient ${patientId} not found.`);

  const { doctor, icdCode, diagnosisName, severity, notes } = diagData;
  const validSeverities = ["Mild", "Moderate", "Severe", "Critical"];

  if (!diagnosisName) return error("Diagnosis name is required.");
  if (!validSeverities.includes(severity)) {
    return error(`Severity must be one of: ${validSeverities.join(", ")}`);
  }

  const record = {
    id: `D${Date.now()}`,
    patientId,
    doctor: doctor || "Unknown",
    icdCode: icdCode || "",
    diagnosisName,
    severity,
    notes: notes || "",
    diagnosedAt: timestamp(),
  };

  db.diagnoses.push(record);
  return success(record);
}

/**
 * Get all diagnoses for a patient.
 * @param {string} patientId
 */
function getDiagnoses(patientId) {
  const records = db.diagnoses.filter(d => d.patientId === patientId);
  return success(records);
}

/**
 * Register a blood donation or request.
 * @param {string} type - "donate" or "request"
 * @param {string} bloodType - e.g. "O+"
 * @param {number} units
 * @param {string} donorOrPatientName
 */
function bloodBankTransaction(type, bloodType, units, donorOrPatientName) {
  if (!["donate", "request"].includes(type)) return error('Type must be "donate" or "request".');
  if (!db.bloodBank.hasOwnProperty(bloodType)) return error(`Invalid blood type: ${bloodType}`);
  if (!units || units < 1) return error("Units must be at least 1.");

  if (type === "request" && db.bloodBank[bloodType] < units) {
    return error(`Insufficient ${bloodType} blood. Available: ${db.bloodBank[bloodType]} units.`);
  }

  db.bloodBank[bloodType] += type === "donate" ? units : -units;

  const tx = {
    id: `BT${Date.now()}`,
    type,
    bloodType,
    units,
    name: donorOrPatientName || "Anonymous",
    timestamp: timestamp(),
  };

  db.bloodTransactions.push(tx);
  return success({ transaction: tx, currentStock: db.bloodBank[bloodType] });
}

/**
 * Get current blood bank stock levels.
 */
function getBloodBankStatus() {
  return success(db.bloodBank);
}

// MODULE 3: BILLING & FINANCIAL LOGIC


const PROCEDURE_FEES = {
  "Blood Test": 80,
  "X-Ray": 120,
  "MRI Scan": 650,
  "CT Scan": 450,
  "ECG": 95,
  "Ultrasound": 200,
  "Surgery": 2500,
  "ICU (per day)": 800,
  "Ward (per day)": 250,
};

const INSURANCE_COVERAGE = {
  "BlueCross": 0.80,
  "Aetna": 0.70,
  "Medicaid": 0.60,
  "PremiumPlan": 0.90,
  "None": 0.00,
};

/**
 * Create an invoice for a patient.
 * @param {string} patientId
 * @param {Object} invoiceData - { consultationFee, procedures: [{name, quantity}], insuranceProvider }
 */
function createInvoice(patientId, invoiceData) {
  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) return error(`Patient ${patientId} not found.`);

  const { consultationFee = 150, procedures = [], insuranceProvider = "None" } = invoiceData;

  // Validate and price procedures
  const lineItems = [];
  for (const proc of procedures) {
    if (!PROCEDURE_FEES[proc.name]) {
      return error(`Unknown procedure: "${proc.name}". Valid: ${Object.keys(PROCEDURE_FEES).join(", ")}`);
    }
    const qty = proc.quantity || 1;
    lineItems.push({
      name: proc.name,
      unitPrice: PROCEDURE_FEES[proc.name],
      quantity: qty,
      total: PROCEDURE_FEES[proc.name] * qty,
    });
  }

  const proceduresTotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const subtotal = consultationFee + proceduresTotal;

  // Insurance calculation
  const coverageRate = INSURANCE_COVERAGE[insuranceProvider] ?? 0;
  const insurancePays = parseFloat((subtotal * coverageRate).toFixed(2));
  const patientOwes = parseFloat((subtotal - insurancePays).toFixed(2));

  const invoice = {
    id: generateId("INV", "invoiceId"),
    patientId,
    patientName: `${patient.firstName} ${patient.lastName}`,
    consultationFee,
    lineItems,
    proceduresTotal,
    subtotal,
    insuranceProvider,
    coverageRate,
    insurancePays,
    patientOwes,
    status: "Pending",
    createdAt: timestamp(),
    paidAt: null,
  };

  db.invoices.push(invoice);
  return success(invoice);
}

/**
 * Mark an invoice as paid.
 * @param {string} invoiceId
 */
function markInvoicePaid(invoiceId) {
  const invoice = db.invoices.find(i => i.id === invoiceId);
  if (!invoice) return error(`Invoice ${invoiceId} not found.`);
  if (invoice.status === "Paid") return error("Invoice is already paid.");

  invoice.status = "Paid";
  invoice.paidAt = timestamp();
  return success(invoice);
}

/**
 * Get all invoices for a patient.
 * @param {string} patientId
 */
function getPatientInvoices(patientId) {
  const invoices = db.invoices.filter(i => i.patientId === patientId);
  return success(invoices);
}

/**
 * Get financial summary across all invoices.
 */
function getFinancialSummary() {
  const total = db.invoices.reduce((s, i) => s + i.subtotal, 0);
  const collected = db.invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.patientOwes, 0);
  const outstanding = db.invoices.filter(i => i.status === "Pending").reduce((s, i) => s + i.patientOwes, 0);
  return success({
    totalBilled: parseFloat(total.toFixed(2)),
    collected: parseFloat(collected.toFixed(2)),
    outstanding: parseFloat(outstanding.toFixed(2)),
    invoiceCount: db.invoices.length,
    paidCount: db.invoices.filter(i => i.status === "Paid").length,
  });
}

/**
 * Get list of valid procedures and their fees.
 */
function getProcedureFees() {
  return success(PROCEDURE_FEES);
}


// MODULE 4: PHARMACY & PRESCRIPTIONS

/**
 * Add a drug to the pharmacy inventory.
 * @param {Object} drugData - { name, category, stock, unitPrice, minStockLevel }
 */
function addDrugToInventory(drugData) {
  const { name, category, stock, unitPrice, minStockLevel } = drugData;
  if (!name) return error("Drug name is required.");
  if (db.drugs.find(d => d.name.toLowerCase() === name.toLowerCase())) {
    return error(`Drug "${name}" already exists in inventory.`);
  }

  const drug = {
    id: `DRUG${db.drugs.length + 1}`,
    name,
    category: category || "General",
    stock: stock || 0,
    unitPrice: unitPrice || 0,
    minStockLevel: minStockLevel || 20,
    addedAt: timestamp(),
  };

  db.drugs.push(drug);
  return success(drug);
}

/**
 * Restock a drug in inventory.
 * @param {string} drugId
 * @param {number} quantity
 */
function restockDrug(drugId, quantity) {
  const drug = db.drugs.find(d => d.id === drugId);
  if (!drug) return error(`Drug ${drugId} not found.`);
  if (quantity < 1) return error("Restock quantity must be at least 1.");
  drug.stock += quantity;
  return success(drug);
}

/**
 * Issue a prescription for a patient.
 * @param {string} patientId
 * @param {Object} rxData - { doctor, drugName, dosage, frequency, durationDays, refillsAllowed, instructions }
 */
function issuePrescription(patientId, rxData) {
  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) return error(`Patient ${patientId} not found.`);

  const { doctor, drugName, dosage, frequency, durationDays, refillsAllowed = 0, instructions } = rxData;

  if (!drugName || !dosage || !frequency || !durationDays) {
    return error("Drug name, dosage, frequency, and duration are required.");
  }

  // Check drug exists in inventory
  const drug = db.drugs.find(d => d.name.toLowerCase() === drugName.toLowerCase());
  if (!drug) return error(`Drug "${drugName}" not found in inventory.`);
  if (drug.stock < durationDays) {
    return error(`Insufficient stock for "${drugName}". Available: ${drug.stock} units, needed: ${durationDays}.`);
  }

  // Validate dosage rule (basic: dosage must contain a numeric value)
  if (!/\d/.test(dosage)) {
    return error('Dosage must include a numeric value (e.g. "500mg", "10ml").');
  }

  // Deduct from inventory
  drug.stock -= durationDays;

  const prescription = {
    id: generateId("Rx", "prescriptionId"),
    patientId,
    patientName: `${patient.firstName} ${patient.lastName}`,
    doctor: doctor || "Unknown",
    drugName,
    dosage,
    frequency,
    durationDays,
    refillsAllowed,
    refillsUsed: 0,
    refillsRemaining: refillsAllowed,
    instructions: instructions || "",
    status: "Active",
    issuedAt: timestamp(),
    expiresAt: new Date(Date.now() + durationDays * 86400000).toISOString(),
  };

  db.prescriptions.push(prescription);
  return success(prescription);
}

/**
 * Request a refill for an existing prescription.
 * @param {string} prescriptionId
 * @param {string} requestedBy - name of patient or staff
 */
function requestRefill(prescriptionId, requestedBy) {
  const rx = db.prescriptions.find(p => p.id === prescriptionId);
  if (!rx) return error(`Prescription ${prescriptionId} not found.`);
  if (rx.status !== "Active") return error("Cannot refill an inactive prescription.");
  if (rx.refillsRemaining <= 0) return error("No refills remaining for this prescription.");

  const existing = db.refillRequests.find(
    r => r.prescriptionId === prescriptionId && r.status === "Pending"
  );
  if (existing) return error("A refill request is already pending for this prescription.");

  const refillRequest = {
    id: `REF${Date.now()}`,
    prescriptionId,
    patientId: rx.patientId,
    drugName: rx.drugName,
    requestedBy: requestedBy || "Patient",
    status: "Pending",
    requestedAt: timestamp(),
    approvedAt: null,
  };

  db.refillRequests.push(refillRequest);
  return success(refillRequest);
}

/**
 * Approve or reject a refill request (pharmacist action).
 * @param {string} refillId
 * @param {string} decision - "approve" or "reject"
 * @param {string} pharmacist
 */
function processRefill(refillId, decision, pharmacist) {
  const refill = db.refillRequests.find(r => r.id === refillId);
  if (!refill) return error(`Refill request ${refillId} not found.`);
  if (refill.status !== "Pending") return error("Refill has already been processed.");

  if (!["approve", "reject"].includes(decision)) {
    return error('Decision must be "approve" or "reject".');
  }

  refill.status = decision === "approve" ? "Approved" : "Rejected";
  refill.pharmacist = pharmacist || "Pharmacist";
  refill.approvedAt = timestamp();

  if (decision === "approve") {
    const rx = db.prescriptions.find(p => p.id === refill.prescriptionId);
    if (rx) {
      const drug = db.drugs.find(d => d.name.toLowerCase() === rx.drugName.toLowerCase());
      if (!drug || drug.stock < rx.durationDays) {
        refill.status = "Rejected";
        return error(`Cannot approve: insufficient stock for "${rx.drugName}".`);
      }
      drug.stock -= rx.durationDays;
      rx.refillsUsed++;
      rx.refillsRemaining--;
    }
  }

  return success(refill);
}

/**
 * Get all drugs with low stock alerts.
 */
function getLowStockAlerts() {
  const lowStock = db.drugs.filter(d => d.stock < d.minStockLevel);
  return success(lowStock);
}

/**
 * Get all prescriptions for a patient.
 * @param {string} patientId
 */
function getPatientPrescriptions(patientId) {
  const records = db.prescriptions.filter(p => p.patientId === patientId);
  return success(records);
}

/**
 * Get full drug inventory.
 */
function getDrugInventory() {
  return success(db.drugs);
}
