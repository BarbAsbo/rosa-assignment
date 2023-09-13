import * as hp from './hp-model';

// Mock data for the health professional repository
// Should be replaced by real repository calls to DB
const healthProfessionalsMockList: hp.HealthProfessional[] = [
  {
    id: 1,
    name: 'Barbason',
    surname: 'Martin',
    specialty: 'Cardiologist',
    schedule: [
      { dayOfWeek: hp.DayOfWeek.Monday, startTime: new Date('2021-01-01T09:00:00'), endTime: new Date('2021-01-01T17:00:00') },
      { dayOfWeek: hp.DayOfWeek.Tuesday, startTime: new Date('2021-01-01T09:00:00'), endTime: new Date('2021-01-01T17:00:00') },
      { dayOfWeek: hp.DayOfWeek.Wednesday, startTime: new Date('2021-01-01T09:00:00'), endTime: new Date('2021-01-01T17:00:00') },
      { dayOfWeek: hp.DayOfWeek.Thursday, startTime: new Date('2021-01-01T09:00:00'), endTime: new Date('2021-01-01T17:00:00') },
      { dayOfWeek: hp.DayOfWeek.Friday, startTime: new Date('2021-01-01T09:00:00'), endTime: new Date('2021-01-01T17:00:00') }
    ],
  },

  {
    id: 2,
    name: 'Gonzalez',
    surname: 'Maria',
    specialty: 'Dermatologist',
    schedule: [
      { dayOfWeek: hp.DayOfWeek.Monday, startTime: new Date('2021-01-01T09:00:00'), endTime: new Date('2021-01-01T17:00:00') },
      { dayOfWeek: hp.DayOfWeek.Tuesday, startTime: new Date('2021-01-01T09:00:00'), endTime: new Date('2021-01-01T17:00:00') },
      { dayOfWeek: hp.DayOfWeek.Wednesday, startTime: new Date('2021-01-01T09:00:00'), endTime: new Date('2021-01-01T17:00:00') },
    ],
  }
];

/**
 * @returns List of all health professionals from DB
 */
export const findAllHp = async (): Promise<hp.HealthProfessional[]> => {
  return healthProfessionalsMockList;
};

/**
 * 
 * @param id (number): health professional id
 * @returns  Health professional object if found, null otherwise
 */
export const findHpById = async (id: number): Promise<hp.HealthProfessional | null> => {
  return healthProfessionalsMockList.find((hp) => hp.id === id) || null;
};

