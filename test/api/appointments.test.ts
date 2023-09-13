import { baseURL } from "../../src/config/constants";
const request = require("supertest")

describe("GET /appointments/availabilities", () => {
  it("should return 200", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/availabilities')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        to: '2021-09-21T17:00:00.000Z',
        healthProfessionalId: '1',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(200);
  });
  it("should return body not empty", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/availabilities')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        to: '2021-09-21T17:00:00.000Z',
        healthProfessionalId: '1',
        meetingDuration: '30',
      });
    expect(response.body.length).toBeGreaterThan(0);
  });
  it("Should return 500 if healthProfessionalId is not a number", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/availabilities')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        to: '2021-09-21T17:00:00.000Z',
        healthProfessionalId: 'a',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if meetingDuration is not a number", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/availabilities')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        to: '2021-09-21T17:00:00.000Z',
        healthProfessionalId: '1',
        meetingDuration: 'a',
      });
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if from is not a date", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/availabilities')
      .query({
        from: 'a',
        to: '2021-09-21T17:00:00.000Z',
        healthProfessionalId: '1',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if to is not a date", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/availabilities')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        to: 'a',
        healthProfessionalId: '1',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if healthProfessionalId is not an existing id", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/availabilities')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        to: '2021-09-21T17:00:00.000Z',
        healthProfessionalId: '3',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(500);
  });
});

describe("GET /appointments/nextAvailability", () => {
  it("should return 200", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/nextAvailability')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        healthProfessionalId: '1',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(200);
  });
  it("should return body not empty", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/nextAvailability')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        healthProfessionalId: '1',
        meetingDuration: '30',
      });
    expect(response.body.length).toEqual("2021-09-20T08:00:00.000Z".length);
  });

  it("Should return 500 if healthProfessionalId is not a number", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/nextAvailability')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        healthProfessionalId: 'a',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if meetingDuration is not a number", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/nextAvailability')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        healthProfessionalId: '1',
        meetingDuration: 'a',
      });
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if from is not a date", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/nextAvailability')
      .query({
        from: 'a',
        healthProfessionalId: '1',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if healthProfessionalId is not an existing id", async () => {
    const response = await request(baseURL)
      .get('/api/appointments/nextAvailability')
      .query({
        from: '2021-09-20T09:00:00.000Z',
        healthProfessionalId: '3',
        meetingDuration: '30',
      });
    expect(response.statusCode).toBe(500);
  });
});