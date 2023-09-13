export interface Appointment {
  id: number; // Unique identifier for the appointment
  healthProfessionalId: number; // ID of the health Professional for whom the appointment is scheduled
  patientName: string; // Name of the patient
  patientSurname: string; // Surname of the patient
  startTime: Date; // Start time of the appointment
  endTime: Date; // End time of the appointment
}