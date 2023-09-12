export interface Appointment {
  id: number; // Unique identifier for the appointment
  healthPractitionerId: number; // ID of the health practitioner for whom the appointment is scheduled
  patientName: string; // Name of the patient
  patientSurname: string; // Surname of the patient
  patientEmail: string; // Email of the patient
  startTime: Date; // Start time of the appointment
  endTime: Date; // End time of the appointment
}