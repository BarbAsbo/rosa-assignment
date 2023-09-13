import express from "express";
import { getAvailabilitiesByDate, getNextAvailabilityByDate } from "../controllers/appointment-controller";

const router = express.Router();

// GET availabilities by date
router.get("/appointments/availabilities", async (req, res) => {
  try {
    const { from, to, healthProfessionalId, meetingDuration } = req.query;

    if(!isISOString(from as string) || !isISOString(to as string)) {
      throw new Error("Invalid date format. Should be ISO UTC format");
    }

    if(isNaN(parseInt(meetingDuration as string))) {
      throw new Error("Invalid meeting duration format. Should be a number");
    }

    const availabilities = await getAvailabilitiesByDate(
      new Date(from as string),
      new Date(to as string),
      parseInt(healthProfessionalId as string),
      parseInt(meetingDuration as string)
    );
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching availabilities." });
  }
});

// GET next availability
router.get("/appointments/nextAvailability/", async (req, res) => {
  try {
    const { from, healthProfessionalId, meetingDuration } = req.query;

    if(!isISOString(from as string)) {
      throw new Error("Invalid date format. Should be ISO UTC format");
    }

    if(isNaN(parseInt(meetingDuration as string))) {
      throw new Error("Invalid meeting duration format. Should be a number");
    }

    const nextAvailability = await getNextAvailabilityByDate(
      new Date(from as string),
      parseInt(healthProfessionalId as string),
      parseInt(meetingDuration as string)
    );
    res.status(200).json(nextAvailability);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching next availability." });
  }
});

const isISOString = (val: string) => {
  const d = new Date(val);
  return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};

export default router;