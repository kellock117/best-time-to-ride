import { CronJob } from "cron";

import weather from "./weather.js";
import time from "./time.js";
import holiday from "./holiday.js";

// weather = every 12 hours
const weatherJob = new CronJob("30 */12 * * *", () => {
  try {
    weather();
    const d = new Date();
    console.log(`weather job executed at ${d}`);
  } catch (error) {
    console.log(error.message);
  }
});

// time = everyday 7am
const timeJob = new CronJob("0 7 * * *", () => {
  try {
    time();
    const d = new Date();
    console.log(`time job executed at ${d}`);
  } catch (error) {
    console.log(error.message);
  }
});

// holiday = every month
const holidayJob = new CronJob("0 0 1 * *", () => {
  try {
    holiday();
    const d = new Date();
    console.log(`time job executed at ${d}`);
  } catch (error) {
    console.log(error.message);
  }
});

export default () => {
  weatherJob.start();
  timeJob.start();
  holidayJob.start();
};
