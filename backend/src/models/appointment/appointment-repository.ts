import * as appointment from './appointment-model';

// Mock data for the appointment repository
// Should be replaced by real repository calls to DB
const appointmentMockList: appointment.Appointment[] = [
  {
    id: 1,
    healthProfessionalId: 1,
    patientName: 'Test',
    patientSurname: 'One',
    startTime: new Date('2021-01-01T10:00:00'),
    endTime: new Date('2021-01-01T10:30:00'),
  },
  {
    id: 2,
    healthProfessionalId: 1,
    patientName: 'Test',
    patientSurname: 'Two',
    startTime: new Date('2021-01-01T10:30:00'),
    endTime: new Date('2021-01-01T11:00:00'),
  },
  {
    id: 3,
    healthProfessionalId: 1,
    patientName: 'Test',
    patientSurname: 'Three',
    startTime: new Date('2021-01-01T11:00:00'),
    endTime: new Date('2021-01-01T11:30:00'),
  },
  {
    id: 4,
    healthProfessionalId: 2,
    patientName: 'Test',
    patientSurname: 'Four',
    startTime: new Date('2021-01-01T11:30:00'),
    endTime: new Date('2021-01-01T12:00:00'),
  },
];
/**
 * 
 * @param from (ISO Date): start date (not taking time into account)
 * @param to (ISO Date): end date (not taking time into account)
 * @returns List of all appointments from DB
 */
export const findAllAppointment = async (from: Date, to: Date): Promise<appointment.Appointment[]> => {
  return appointmentMockList;
};

/**
 * 
 * @param id (number): appointment id
 * @returns Appointment object if found, null otherwise
 */
export const findAppointmentById = async (id: number): Promise<appointment.Appointment | null> => {
  return appointmentMockList.find((appointment) => appointment.id === id) || null;
};

/**
 * 
 * @param from  (ISO Date): start date (not taking time into account)
 * @param to  (ISO Date): end date (not taking time into account)
 * @param healthProfessionalId  (number): health professional id
 * @returns  List of appointments for the given health professional id
 */
export const findAppointmentByHealthProfessionalId = async (from: Date, to: Date, healthProfessionalId: number): Promise<appointment.Appointment[]> => {
  return appointmentMockList.filter((appointment) => appointment.healthProfessionalId === healthProfessionalId);
};
