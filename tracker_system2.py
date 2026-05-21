# tracker_system2.py
# Group 1
# Authors: Joshua, Russell, and Faith
# Assignment: Patient Lifecycle & Identity

import datetime
# We are importing a 'blueprint' from another file to handle medical data
from clinical_records import ClinicalRecord

class PatientTracker:
    """
    This class acts like a manager. It tracks where the patient is 
    in the hospital and records every move they make.
    """

    def __init__(self, patient_id, name, blood_type):
        """
        INITIALIZATION: This runs the moment you 'create' a patient.
        It sets up their starting information.
        """
        # We create a 'ClinicalRecord' object and store it inside this class.
        # This links Admin data (this script) with Medical data (clinical_records.py).
        self.clinical_file = ClinicalRecord(patient_id, name, blood_type)
        
        # Setup the initial status
        self.current_state = "Registered"
        self.arrival_time = datetime.datetime.now()
        self.bed_id = None
        self.log = []           # A list to keep track of history
        self.is_locked = False  # Becomes True when the patient leaves
        
        # Record the very first event in our log
        self._add_log("Patient Registered and record initialized.")

    def _add_log(self, message):
        """
        INTERNAL HELPER: Adds a timestamped note to the patient's history.
        The '_' at the start of the name means this is for internal use.
        """
        timestamp = datetime.datetime.now().strftime("%H:%M")
        entry = f"[{timestamp}] Status: {self.current_state} | {message}"
        self.log.append(entry)

    def move_to_triage(self, bp, pulse, temp):
        """
        STEP 1: Moves patient to Triage. 
        It takes medical vitals and sends them to the clinical_file.
        """
        self.current_state = "Triaged"
        # We tell the OTHER script to save these vitals
        self.clinical_file.add_vitals(bp, pulse, temp)
        self._add_log("Vitals captured. Priority queue updated.")
        print(f"✅ {self.clinical_file.name} moved to Triage.")

    def move_to_admitted(self, bed_number):
        """
        STEP 2: Moves patient to a room.
        Saves the bed number so we know where they are.
        """
        self.current_state = "Admitted"
        self.bed_id = bed_number
        self._add_log(f"Admitted to Bed: {bed_number}. Hourly billing started.")
        print(f"🏨 {self.clinical_file.name} assigned to {bed_number}.")

    def move_to_pending(self):
        """
        STEP 3: Prepares for discharge.
        """
        self.current_state = "Discharge Pending"
        self._add_log("Care completed. Final bill requested. Housekeeping notified.")
        print(f"⌛ {self.clinical_file.name} is clearing for discharge.")

    def move_to_discharged(self):
        """
        STEP 4: Final step. 
        Locks the record so no more changes can be made.
        """
        self.current_state = "Discharged"
        self.is_locked = True
        self._add_log("Patient exited building. Record moved to Archive.")
        print(f"🏁 {self.clinical_file.name} discharged. Bed {self.bed_id} is now free.")


# --- THE INTERFACE (The Menu) ---

def run_tracker():
    """
    This function runs the interactive menu in the console.
    """
    print("--- HOSPITAL WORKFLOW TRACKER ---")
    
    # Get initial info from the user
    p_id = input("Patient ID: ")
    name = input("Patient Name: ")
    blood = input("Blood Type: ")

    # Create the 'tracker' object based on our class above
    tracker = PatientTracker(p_id, name, blood)

    # Keep the menu running until the user chooses to exit
    while True:
        print(f"\nLocation: [{tracker.current_state.upper()}]")
        print("1. Process Triage (Vitals)")
        print("2. Admit to Ward (Bed)")
        print("3. Move to Pending (Billing)")
        print("4. Final Discharge")
        print("5. View Admin Log & Medical Summary")
        print("6. Exit")

        choice = input("\nSelect Action: ")

        if choice == '1':
            bp = input("BP (e.g. 120/80): ")
            p = input("Pulse (e.g. 72): ")
            t = input("Temp (e.g. 98.6): ")
            tracker.move_to_triage(bp, p, t)
        
        elif choice == '2':
            bed = input("Assign Bed ID: ")
            tracker.move_to_admitted(bed)

        elif choice == '3':
            tracker.move_to_pending()

        elif choice == '4':
            tracker.move_to_discharged()
            print("System locked for this patient.")
            break # Stop the loop because the patient left

        elif choice == '5':
            # Show the history we stored in the list
            print("\n--- ADMINISTRATIVE LOG ---")
            for entry in tracker.log: 
                print(entry)
            
            # Show medical data from the linked ClinicalRecord object
            print("\n--- CLINICAL SUMMARY ---")
            print(f"Blood Type: {tracker.clinical_file.blood_type}")
            print(f"Vitals recorded: {len(tracker.clinical_file.vitals_history)} times")

        elif choice == '6':
            print("Exiting system...")
            break
        else:
            print("Invalid choice, please try again.")

# This ensures the code only runs if you run THIS file directly
if __name__ == "__main__":
    run_tracker()
    
    