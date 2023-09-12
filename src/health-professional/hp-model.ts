enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export interface HealthPractitioner {
  id: number; // Unique identifier for the health practitioner
  name: string; // Name of the health practitioner
  surname: string; // Surname of the health practitioner
  specialty: string; // Specialty of the health practitioner
  schedule: WeeklySchedule[]; // Weekly schedule of the health practitioner
}

export interface WeeklySchedule {
  dayOfWeek: DayOfWeek; // Day of the week
  startTime: Date; // Start time of availability (e.g., "09:00 AM")
  endTime: Date; // End time of availability (e.g., "05:00 PM")
}
