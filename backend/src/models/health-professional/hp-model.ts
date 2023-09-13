export enum DayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

export interface HealthProfessional {
  id: number; // Unique identifier for the health Professional
  name: string; // Name of the health Professional
  surname: string; // Surname of the health Professional
  specialty: string; // Specialty of the health Professional
  schedule: WeeklySchedule[]; // Weekly schedule of the health Professional
}

export interface WeeklySchedule {
  dayOfWeek: DayOfWeek; // Day of the week
  startTime: Date; // Start time of availability (e.g., "09:00 AM")
  endTime: Date; // End time of availability (e.g., "05:00 PM")
}
