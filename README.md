# HOSPITAL-MANAGEMENT-SYSTEM---SEN412
// USAGE EXAMPLES 
 
 --- Module 1 ---
const p = registerPatient({ firstName:"Jane", lastName:"Doe", age:34, gender:"Female", bloodType:"O+", chiefComplaint:"Chest pain" });
console.log(p); // { success: true, data: { id: "P1001", ... } }

advancePatientState("P1001", "Triage");
advancePatientState("P1001", "Admitted");
console.log(getPatientPipeline());

 --- Module 2 ---
recordVitals("P1001", { bpSystolic:145, bpDiastolic:92, pulse:88, temperature:37.2, spO2:97, doctorNote:"Slightly elevated BP" });
addDiagnosis("P1001", { doctor:"Dr. Mensah", icdCode:"I10", diagnosisName:"Hypertension", severity:"Moderate", notes:"Start antihypertensives" });
bloodBankTransaction("donate", "O+", 2, "Kofi Adu");

 --- Module 3 ---
const inv = createInvoice("P1001", {
  consultationFee: 150,
  procedures: [{ name: "X-Ray", quantity: 1 }, { name: "Blood Test", quantity: 2 }],
  insuranceProvider: "BlueCross"
});
console.log(inv.data.patientOwes); // after 80% coverage
markInvoicePaid(inv.data.id);
console.log(getFinancialSummary());

 --- Module 4 ---
addDrugToInventory({ name:"Lisinopril", category:"Antihypertensive", stock:100, unitPrice:5.50, minStockLevel:20 });
const rx = issuePrescription("P1001", { doctor:"Dr. Mensah", drugName:"Lisinopril", dosage:"10mg", frequency:"Once daily", durationDays:30, refillsAllowed:3 });
const ref = requestRefill(rx.data.id, "Jane Doe");
processRefill(ref.data.id, "approve", "Pharm. Sandra");

