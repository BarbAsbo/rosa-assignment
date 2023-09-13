import { maximumDaysAppointmentSearch } from "../config/constants";
import { Appointment } from "../models/appointment/appointment-model";
import { findAppointmentByHealthProfessionalId } from "../models/appointment/appointment-repository";
import { getHpMeetingAvailabilities, getHpNextAvailability } from "../models/health-professional/hp-helpers";
import { HealthProfessional } from "../models/health-professional/hp-model";
import { findHpById } from "../models/health-professional/hp-repository";

/**
* Returns: List of Date objects representing available start time slots
*           Return an empty list if no availabilities are found 
* @param from (ISO Date): start date (not taking time into account)
* @param to (ISO Date): end date (not taking time into account)
* @param healthProfessionalId (number): health professional id
* @param meetingDuration (number): duration of the meeting in minutes
*/
export async function getAvailabilitiesByDate(from: Date, to: Date, healthProfessionalId: number, meetingDuration: number) {
  try{
    const availabilities: Date[] = [];
    const hp: HealthProfessional = await findHpById(healthProfessionalId);
    const appointments: Appointment[] = await findAppointmentByHealthProfessionalId(from, to, healthProfessionalId);
    if (!hp) {
      throw new Error("Health professional not found.");
    }
    return getHpMeetingAvailabilities(from, to, meetingDuration, appointments, hp);
  } catch (error) {
    throw new Error('Error in getAvailabilitiesByDate from appointment controller: ' + error.message);
  }
}

/** Returns Date object representing the next available start time slot 
*  Return null if no availabilities are found
* @param from (ISO Date): start date (not taking time into account)
*  @param healthProfessionalId (number): health professional id
*  @param meetingDuration (number): duration of the meeting in minutes
*/
export async function getNextAvailabilityByDate(from: Date, healthProfessionalId: number, meetingDuration: number) {
  try{
    const availabilities: Date[] = [];
    const hp: HealthProfessional = await findHpById(healthProfessionalId);
    const toDate = new Date(from.getTime() + maximumDaysAppointmentSearch * 24 * 60 * 60 * 1000);
    const appointments: Appointment[] = await findAppointmentByHealthProfessionalId(from, toDate, healthProfessionalId);
    if (!hp) {
      throw new Error("Health professional not found.");
    }
    return getHpNextAvailability(from, meetingDuration, appointments, hp);
  } catch (error) {
    throw new Error('Error in getNextAvailabilityByDate fromappointment controller: ' + error.message);
  }
}




