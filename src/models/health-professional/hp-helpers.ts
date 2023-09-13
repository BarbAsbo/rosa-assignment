import { maximumDaysAppointmentSearch } from "../../config/constants";
import { Appointment } from "../appointment/appointment-model";
import { HealthProfessional, WeeklySchedule, DayOfWeek } from "./hp-model";

const minuteInMs: number = 60 * 1000;
const hourInMs: number = 60 * minuteInMs;
const dayInMs: number = 24 * hourInMs;

/** 
* Return a list of availabilities between from and to based on 
* the time needed for the meeting, the list of appointments, and the schedule of the hp
* Args:
*   @param from (Date): start date (not taking time into account)
*   @param to (Date): end date (not taking time into account)
*   @param hpId (number): health professional id
*   @param meetingDuration (number): duration of the meeting in minutes
*/
export function getHpMeetingAvailabilities(
  from: Date,
  to: Date,
  meetingDuration: number,
  appointments: Appointment[],
  healthProfessional: HealthProfessional,
): Date[] {
  const fromDate: Date = new Date(from);
  fromDate.setUTCHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setUTCHours(23, 59, 59, 999);
  if (!healthProfessional) {
    throw new Error("Health professional not found.");
  }

  // Create a map to track the booked time slots
  const availableTimeSlotsPerDayOfWeek: Map<DayOfWeek, number[]> = getAvailableTimeSlotsPerDayOfWeek(healthProfessional.schedule, meetingDuration);
  let availableTimeSlots: number[] = [];
  let currentDate = new Date(fromDate);
  while(currentDate <= toDate) {
    const currentDayOfWeek = currentDate.getUTCDay();
    const currentDayTimeSlots = availableTimeSlotsPerDayOfWeek.get(currentDayOfWeek);
    if(currentDayTimeSlots) {
      for(let i = 0; i < currentDayTimeSlots.length; i++) {
        availableTimeSlots.push(currentDayTimeSlots[i] + currentDate.getTime());
      }
    }
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  // Loop through the appointments and remove the booked time slots
  availableTimeSlots = removeOverlapingAppointments(appointments, availableTimeSlots, meetingDuration);
  return availableTimeSlots.map((timeSlot) => new Date(timeSlot));
}

/**
 * 
 * @param schedule  List of weekly schedule for the health professional
 * @param meetingDuration  Duration of the meeting in minutes
 * @returns  Map of available time slots per day of week (key: day of week, value: list of available time slots in EPOCH)
 * ex: Map(1 => [54000000, 54000000, 54000000, 54000000, 54000000, 54000000, 54000000])
 */
export function getAvailableTimeSlotsPerDayOfWeek(schedule: WeeklySchedule[], meetingDuration: number): Map<DayOfWeek, number[]> {
  const availableTimeSlotsPerDayOfWeek: Map<DayOfWeek, number[]> = new Map();

  for (const daySchedule of schedule) {
    const currentDay :DayOfWeek = daySchedule.dayOfWeek;
    const numberOfMeetingPerDay = Math.floor((daySchedule.endTime.getTime() - daySchedule.startTime.getTime()) / (meetingDuration * minuteInMs));
    const dayScheduleStartTimeMidnight = new Date(daySchedule.startTime);
    dayScheduleStartTimeMidnight.setUTCHours(0, 0, 0, 0);
    const dayScheduleStartTime = daySchedule.startTime.getTime() - dayScheduleStartTimeMidnight.getTime();
    const dailyTimeSlots: number[] = [];
    for(let i = 0; i < numberOfMeetingPerDay; i++) {
      dailyTimeSlots.push(dayScheduleStartTime + i * meetingDuration * minuteInMs);
    }
    availableTimeSlotsPerDayOfWeek.set(currentDay, dailyTimeSlots);
  }
  
  return availableTimeSlotsPerDayOfWeek;
}

/**
 * 
 * @param appointments  List of appointments
 * @param availablesSlots  List of available time slots in EPOCH
 * @param meetingDuration  Duration of the meeting in minutes
 * @returns  The same list availablesSlots with the overlaping appointments removed
 */
export function removeOverlapingAppointments(appointments: Appointment[], availablesSlots: number[], meetingDuration: number): number[] {
  const ascAvailablesSlots = availablesSlots.sort((a, b) => a - b);
  for (let appointment of appointments) {
    // Find the first index of the available time slot that is greater than the appointment start time
    const firstIndex = ascAvailablesSlots.findIndex((availableSlot: number) => availableSlot + meetingDuration * minuteInMs > appointment.startTime.getTime());
    // Find the last index of the available time slot that is smaller than the appointment end time
    const lastIndex = ascAvailablesSlots.findIndex((availableSlot: number) => availableSlot >= appointment.endTime.getTime());
    // If there is slots to remove, remove the time slots between the first and last index
    if(firstIndex !== -1 && lastIndex !== -1 && lastIndex > firstIndex) {
      ascAvailablesSlots.splice(firstIndex, lastIndex - firstIndex);
    }
    // Edge case when there is only one available time slot and it is overlaping with the appointment
    else if(firstIndex === 0 && lastIndex === -1 && ascAvailablesSlots.length === 1) {
      ascAvailablesSlots.splice(firstIndex, 1);
    }
  }
  return ascAvailablesSlots;
}

/**
 * 
 * @param from  (ISO Date): start date (not taking time into account)
 * @param meetingDuration  (number): duration of the meeting in minutes
 * @param appointments  List of appointments
 * @param healthProfessional  Health professional object
 * @returns  Date object representing the next available start time slot
 */
export function getHpNextAvailability(
  from: Date,
  meetingDuration: number,
  appointments: Appointment[],
  healthProfessional: HealthProfessional,
): Date | null {
  const dayInMs = 24 * 60 * minuteInMs;
  const fromDate: Date = new Date(from);
  fromDate.setUTCHours(0, 0, 0, 0);
  const maxDateToLook = fromDate.getTime() + maximumDaysAppointmentSearch * dayInMs;
  let currentDate = new Date(fromDate);
  while(currentDate.getTime() <= maxDateToLook) {
    const nextAvailability = getHpMeetingAvailabilities(currentDate, currentDate, meetingDuration, appointments, healthProfessional);
    if(nextAvailability.length > 0) {
      return nextAvailability[0];
    }
    currentDate = new Date(currentDate.getTime() + dayInMs);
  }
  return null;
}
