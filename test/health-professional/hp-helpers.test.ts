import { Appointment } from '../../src/models/appointment/appointment-model';
import { getHpNextAvailability, removeOverlapingAppointments } from '../../src/models/health-professional/hp-helpers';
import { getAvailableTimeSlotsPerDayOfWeek } from '../../src/models/health-professional/hp-helpers';
import { getHpMeetingAvailabilities } from '../../src/models/health-professional/hp-helpers';
import { DayOfWeek } from '../../src/models/health-professional/hp-model';

const minuteInMs: number = 60 * 1000;
const hourInMs: number = 60 * minuteInMs;
const dayInMs: number = 24 * hourInMs;

describe('removeOverlapingAppointments', () => {
  test('Should remove available slots if appointment overlaping', () => {
    const appointments: Appointment[] = [
      { id: 1, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'One', startTime: new Date('2021-01-01T10:00:00Z'), endTime: new Date('2021-01-01T10:30:00Z') },
      { id: 2, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Two', startTime: new Date('2021-01-01T10:30:00Z'), endTime: new Date('2021-01-01T11:00:00Z') },
      { id: 3, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Three', startTime: new Date('2021-01-01T14:45:00Z'), endTime: new Date('2021-01-01T15:15:00Z') },
    ];
    const availableTimeSlots: number[] = [
      new Date('2021-01-01T09:00:00Z').getTime(), // 1609488000000
      new Date('2021-01-01T09:30:00Z').getTime(), // 1609489800000
      new Date('2021-01-01T10:00:00Z').getTime(), // 1609491600000 to be delete
      new Date('2021-01-01T10:30:00Z').getTime(), // 1609493400000 to be delete
      new Date('2021-01-01T11:00:00Z').getTime(), // 1609495200000
      new Date('2021-01-01T11:30:00Z').getTime(), // 1609497000000 
      new Date('2021-01-01T12:00:00Z').getTime(), // 1609498800000
      new Date('2021-01-01T14:30:00Z').getTime(), // 1609507800000 to be delete
      new Date('2021-01-01T15:00:00Z').getTime(), // 1609509600000 to be delete
      new Date('2021-01-01T15:30:00Z').getTime(), // 1609511400000
      new Date('2021-01-01T16:00:00Z').getTime(), // 1609513200000
      new Date('2021-01-01T16:30:00Z').getTime(), // 1609515000000
      new Date('2021-01-02T10:00:00Z').getTime(), // 1609578000000
      new Date('2021-01-02T10:30:00Z').getTime(), // 1609579800000
      new Date('2021-01-02T11:00:00Z').getTime(), // 1609581600000
    ];

    const expected = [
      new Date('2021-01-01T09:00:00Z').getTime(), // 1609488000000
      new Date('2021-01-01T09:30:00Z').getTime(), // 1609489800000
      new Date('2021-01-01T11:00:00Z').getTime(), // 1609495200000
      new Date('2021-01-01T11:30:00Z').getTime(), // 1609497000000 
      new Date('2021-01-01T12:00:00Z').getTime(), // 1609498800000
      new Date('2021-01-01T15:30:00Z').getTime(), // 1609511400000
      new Date('2021-01-01T16:00:00Z').getTime(), // 1609513200000
      new Date('2021-01-01T16:30:00Z').getTime(), // 1609515000000
      new Date('2021-01-02T10:00:00Z').getTime(), // 1609578000000
      new Date('2021-01-02T10:30:00Z').getTime(), // 1609579800000
      new Date('2021-01-02T11:00:00Z').getTime(), // 1609581600000
    ];
    const actual = removeOverlapingAppointments(appointments, availableTimeSlots, 30);
    expect(actual).toEqual(expected);
  });

  test('Should not remove available slots if appointment are empty', () => {
    const appointments: Appointment[] = [];
    const availableTimeSlots: number[]= [
      new Date('2021-01-01T09:30:00Z').getTime(), // 1609491600000
      new Date('2021-01-01T10:00:00Z').getTime(), // 1609493400000
      new Date('2021-01-01T11:00:00Z').getTime(), // 1609495200000
      new Date('2021-01-01T11:30:00Z').getTime(), // 1609497000000 
      new Date('2021-01-01T12:00:00Z').getTime(), // 1609498800000
      new Date('2021-01-01T14:30:00Z').getTime(), // 1609507800000
    ];

    const expected = [
      new Date('2021-01-01T09:30:00Z').getTime(), // 1609491600000
      new Date('2021-01-01T10:00:00Z').getTime(), // 1609493400000
      new Date('2021-01-01T11:00:00Z').getTime(), // 1609495200000
      new Date('2021-01-01T11:30:00Z').getTime(), // 1609497000000 
      new Date('2021-01-01T12:00:00Z').getTime(), // 1609498800000
      new Date('2021-01-01T14:30:00Z').getTime(), // 1609507800000
    ];
    const actual = removeOverlapingAppointments(appointments, availableTimeSlots, 30);
    expect(actual).toEqual(expected);
  });

  test('Should return empty array if available slots are empty', () => {
    const appointments: Appointment[] = [
      { id: 1, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'One', startTime: new Date('2021-01-01T10:00:00Z'), endTime: new Date('2021-01-01T10:30:00Z') },
      { id: 2, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Two', startTime: new Date('2021-01-01T10:30:00Z'), endTime: new Date('2021-01-01T11:00:00Z') },
      { id: 3, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Three', startTime: new Date('2021-01-01T14:45:00Z'), endTime: new Date('2021-01-01T15:15:00Z') },
    ];
    const availableTimeSlots: number[] = [];

    const expected: number[] = [];
    const actual = removeOverlapingAppointments(appointments, availableTimeSlots, 30);
    expect(actual).toEqual(expected);
  });
});

describe('getAvailableTimeSlotsPerDayOfWeek', () => {
  test('Should return Map with key=dayOfWeek and value= list of available time slots per day of week', () => {
    const weeklySchedule = [
      { dayOfWeek: DayOfWeek.Monday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T11:00:00Z') },
      { dayOfWeek: DayOfWeek.Tuesday, startTime: new Date('2021-01-01T10:00:00Z'), endTime: new Date('2021-01-01T12:00:00Z') },
      { dayOfWeek: DayOfWeek.Wednesday, startTime: new Date('2021-01-01T11:00:00Z'), endTime: new Date('2021-01-01T13:00:00Z') },
      { dayOfWeek: DayOfWeek.Thursday, startTime: new Date('2021-01-01T12:00:00Z'), endTime: new Date('2021-01-01T14:00:00Z') },
      { dayOfWeek: DayOfWeek.Friday, startTime: new Date('2021-01-01T13:00:00Z'), endTime: new Date('2021-01-01T15:00:00Z') },
      { dayOfWeek: DayOfWeek.Saturday, startTime: new Date('2021-01-01T14:00:00Z'), endTime: new Date('2021-01-01T16:00:00Z') },
      { dayOfWeek: DayOfWeek.Sunday, startTime: new Date('2021-01-01T15:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
    ];
    const expected = new Map([
      [DayOfWeek.Monday, [9*hourInMs, 9.5*hourInMs, 10*hourInMs, 10.5*hourInMs]],
      [DayOfWeek.Tuesday, [10*hourInMs, 10.5*hourInMs, 11*hourInMs, 11.5*hourInMs]],
      [DayOfWeek.Wednesday, [11*hourInMs, 11.5*hourInMs, 12*hourInMs, 12.5*hourInMs]],
      [DayOfWeek.Thursday, [12*hourInMs, 12.5*hourInMs, 13*hourInMs, 13.5*hourInMs]],
      [DayOfWeek.Friday, [13*hourInMs, 13.5*hourInMs, 14*hourInMs, 14.5*hourInMs]],
      [DayOfWeek.Saturday, [14*hourInMs, 14.5*hourInMs, 15*hourInMs, 15.5*hourInMs]],
      [DayOfWeek.Sunday, [15*hourInMs, 15.5*hourInMs, 16*hourInMs, 16.5*hourInMs]],
    ]);
    const actual = getAvailableTimeSlotsPerDayOfWeek(weeklySchedule, 30);
    expect(actual).toEqual(expected);
    });
});

describe('getHpMeetingAvailabilities', () => {
  test('Should return the date list available time slots', () => {
    const from: Date = new Date('2021-01-01T00:00:00Z');
    const to: Date = new Date('2021-01-01T23:59:59Z');
    const meetingDuration: number = 30;
    const appointments: Appointment[] = [
      { id: 1, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'One', startTime: new Date('2021-01-01T10:00:00Z'), endTime: new Date('2021-01-01T10:30:00Z') },
      { id: 2, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Two', startTime: new Date('2021-01-01T10:30:00z'), endTime: new Date('2021-01-01T11:00:00Z') },
      { id: 3, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Three', startTime: new Date('2021-01-01T14:45:00Z'), endTime: new Date('2021-01-01T15:15:00Z') },
    ];
    const healthProfessional = {
      id: 1,
      name: 'Barbason',
      surname: 'Martin',
      specialty: 'Cardiologist',
      schedule: [
        { dayOfWeek: DayOfWeek.Monday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Tuesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Wednesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Thursday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Friday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') }
      ],
    };
    const expected = [
      new Date('2021-01-01T09:00:00Z'),
      new Date('2021-01-01T09:30:00Z'),
      new Date('2021-01-01T11:00:00Z'),
      new Date('2021-01-01T11:30:00Z'),
      new Date('2021-01-01T12:00:00Z'),
      new Date('2021-01-01T12:30:00Z'),
      new Date('2021-01-01T13:00:00Z'),
      new Date('2021-01-01T13:30:00Z'),
      new Date('2021-01-01T14:00:00Z'),
      new Date('2021-01-01T15:30:00Z'),
      new Date('2021-01-01T16:00:00Z'),
      new Date('2021-01-01T16:30:00Z'),
    ];
    const actual = getHpMeetingAvailabilities(from, to, meetingDuration, appointments, healthProfessional);
    expect(actual).toEqual(expected);
  });

  test('Should take the from and To argument time into account, only the date', () => {
    const from: Date = new Date('2021-01-01T00:00:00Z');
    const to: Date = new Date('2021-01-01T23:59:59Z');
    const meetingDuration: number = 30;
    const appointments: Appointment[] = [
      { id: 1, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'One', startTime: new Date('2021-01-01T10:00:00Z'), endTime: new Date('2021-01-01T10:30:00Z') },
      { id: 2, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Two', startTime: new Date('2021-01-01T10:30:00z'), endTime: new Date('2021-01-01T11:00:00Z') },
      { id: 3, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Three', startTime: new Date('2021-01-01T14:45:00Z'), endTime: new Date('2021-01-01T15:15:00Z') },
    ];
    const healthProfessional = {
      id: 1,
      name: 'Barbason',
      surname: 'Martin',
      specialty: 'Cardiologist',
      schedule: [
        { dayOfWeek: DayOfWeek.Monday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Tuesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Wednesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Thursday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Friday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') }
      ],
    };
    const expected = [
      new Date('2021-01-01T09:00:00Z'),
      new Date('2021-01-01T09:30:00Z'),
      new Date('2021-01-01T11:00:00Z'),
      new Date('2021-01-01T11:30:00Z'),
      new Date('2021-01-01T12:00:00Z'),
      new Date('2021-01-01T12:30:00Z'),
      new Date('2021-01-01T13:00:00Z'),
      new Date('2021-01-01T13:30:00Z'),
      new Date('2021-01-01T14:00:00Z'),
      new Date('2021-01-01T15:30:00Z'),
      new Date('2021-01-01T16:00:00Z'),
      new Date('2021-01-01T16:30:00Z'),
    ];
    const actual1 = getHpMeetingAvailabilities(from, to, meetingDuration, appointments, healthProfessional);
    const actual2 = getHpMeetingAvailabilities(new Date('2021-01-01T10:00:00Z'), new Date('2021-01-01T11:30:00Z'), meetingDuration, appointments, healthProfessional);
    const actual3 = getHpMeetingAvailabilities(to, from, meetingDuration, appointments, healthProfessional);
    expect(actual1).toEqual(expected);
    expect(actual2).toEqual(expected);
    expect(actual3).toEqual(expected);
  });

  test('Should return empty array if there is no availability', () => {
    const from: Date = new Date('2021-01-01T00:00:00Z');
    const to: Date = new Date('2021-12-31T23:59:59Z');
    const meetingDuration: number = 30;
    const appointments: Appointment[] = []
    const startDate: number = new Date('2021-01-01T09:00:00Z').getTime();
    for(let i = 0; i < 365; i++) {
      appointments.push({ id: 2*i, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'One', startTime: new Date(startDate + i * dayInMs), endTime: new Date(startDate + i * dayInMs + meetingDuration * minuteInMs) });
      appointments.push({ id: 2*i+1, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Two', startTime: new Date(startDate + i * dayInMs + meetingDuration * minuteInMs), endTime: new Date(startDate + i * dayInMs + 2* meetingDuration * minuteInMs) });
    }
    const healthProfessional = {
      id: 1,
      name: 'Barbason',
      surname: 'Martin',
      specialty: 'Cardiologist',
      schedule: [
        { dayOfWeek: DayOfWeek.Monday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') },
        { dayOfWeek: DayOfWeek.Tuesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') },
        { dayOfWeek: DayOfWeek.Wednesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') },
        { dayOfWeek: DayOfWeek.Thursday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') },
        { dayOfWeek: DayOfWeek.Friday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') }
      ],
    };
    const actual = getHpMeetingAvailabilities(from, to, meetingDuration, appointments, healthProfessional);
    expect(actual).toEqual([]);
  });
});

describe('getHpNextAvailability', () => {
  test('Should return the next available time slot', () => {
    const from: Date = new Date('2021-01-01T00:00:00Z');
    const meetingDuration: number = 30;
    const appointments: Appointment[] = [
      { id: 1, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'One', startTime: new Date('2021-01-01T10:00:00Z'), endTime: new Date('2021-01-01T10:30:00Z') },
      { id: 2, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Two', startTime: new Date('2021-01-01T10:30:00z'), endTime: new Date('2021-01-01T11:00:00Z') },
      { id: 3, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Three', startTime: new Date('2021-01-01T14:45:00Z'), endTime: new Date('2021-01-01T15:15:00Z') },
    ];
    const healthProfessional = {
      id: 1,
      name: 'Barbason',
      surname: 'Martin',
      specialty: 'Cardiologist',
      schedule: [
        { dayOfWeek: DayOfWeek.Monday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Tuesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Wednesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Thursday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') },
        { dayOfWeek: DayOfWeek.Friday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T17:00:00Z') }
      ],
    };
    const expected = new Date('2021-01-01T09:00:00Z');
    const actual = getHpNextAvailability(from, meetingDuration, appointments, healthProfessional);
    expect(actual).toEqual(expected);
  });

  test('Should return null if there is no availability for the next 365 days', () => {
    const from: Date = new Date('2021-01-01T00:00:00Z');
    const meetingDuration: number = 30;
    const appointments: Appointment[] = []
    const startDate: number = new Date('2021-01-01T09:00:00Z').getTime();
    for(let i = 0; i < 365; i++) {
      appointments.push({ id: 2*i, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'One', startTime: new Date(startDate + i * dayInMs), endTime: new Date(startDate + i * dayInMs + 30 * minuteInMs) });
      appointments.push({ id: 2*i+1, healthProfessionalId: 1, patientName: 'Test', patientSurname: 'Two', startTime: new Date(startDate + i * dayInMs + 30 * minuteInMs), endTime: new Date(startDate + i * dayInMs + 60 * minuteInMs) });
    }
    const healthProfessional = {
      id: 1,
      name: 'Barbason',
      surname: 'Martin',
      specialty: 'Cardiologist',
      schedule: [
        { dayOfWeek: DayOfWeek.Monday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') },
        { dayOfWeek: DayOfWeek.Tuesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') },
        { dayOfWeek: DayOfWeek.Wednesday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') },
        { dayOfWeek: DayOfWeek.Thursday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') },
        { dayOfWeek: DayOfWeek.Friday, startTime: new Date('2021-01-01T09:00:00Z'), endTime: new Date('2021-01-01T10:00:00Z') }
      ],
    };
    const actual = getHpNextAvailability(from, meetingDuration, appointments, healthProfessional);
    expect(actual).toEqual(null);
  });
});
