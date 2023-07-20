import axios from "axios";
import moment from "moment";
import fs from "fs";

import { mysql, indexToCity } from "./utils.js";

const now = moment().subtract(2, "days");

const getURL = ({ sDay, routeId, stationId, staOrder }) => {
  return `https://api.gbis.go.kr/ws/rest/pastarrivalservice/json?serviceKey=1234567890&sDay=${sDay}&routeId=${routeId}&stationId=${stationId}&staOrder=${staOrder}`;
};

const getInsertTimeQuery = (precipitation) => {
  `INSERT IGNORE INTO ${
    precipitation === undefined ? "NORMAL_TIME" : "SPECIAL_TIME"
  } (routeId, stationId, staOrder, sDay, hour, minute) VALUES (?, ?, ?, ?, ?, ?)`;
};

const getSelectWeatherQuery = (regions) => {
  return `SELECT * FROM WEATHER WHERE location IN (?${", ?".repeat(
    regions.length - 1
  )}) AND (base_date = ?) OR (base_date = ? AND base_time <= 3)`;
};

const getWeatherInfo = async (regionName) => {
  try {
    // 날씨 한 번에 select 할지 분할해서 병합 할지
    const regions = regionName.split(",");
    const query = getSelectWeatherQuery(regions);
    const locationValue = regions;

    const firstDate = now.format("YYYY-MM-DD");
    const secondDate = now.add(1, "days").format("YYYY-MM-DD");
    const dateValues = [firstDate, secondDate];

    const values = locationValue.concat(dateValues);
    console.log("🚀 ~ file: time.js:37 ~ getWeatherInfo ~ values:", values);

    const result = await mysql.execute(query, values, (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    })[0];

    return result;
  } catch (err) {
    console.log(err.message);
  }
};

const saveTime = async (data) => {
  const sDay = now.format("YYYY-MM-DD");

  const pastArrivalList = data[0].data.response?.msgBody?.pastArrivalList[0];
  if (pastArrivalList === undefined) return;

  const { routeId } = pastArrivalList;

  // select route info
  const regionName = await mysql.execute(
    `SELECT regionName FROM ROUTE_INFO WHERE routeId = ?`,
    [routeId],
    (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    }
  );

  const weather = getWeatherInfo(regionName);

  weather.reduce((acc, curr) => {
    const { base_date, base_time, location } = curr;

    if (acc[base_date]) {
      if (acc[base_date][base_time]) acc[base_date][base_time].push(location);
      else acc[base_date][base_time] = [location];
    } else acc[base_date] = { base_time: [location] };
  }, {});

  for (let item of data) {
    const pastArrivalList = item.data.response?.msgBody?.pastArrivalList;
    // undefined는 미정차 구간
    if (pastArrivalList === undefined) continue;
    const { stationId, staOrder } = pastArrivalList[0];

    for (const pastArrival of pastArrivalList) {
      const { RArrivalDate } = pastArrival;

      const [hour, minute] = RArrivalDate.split(" ")[1].split(":");
      const values = [
        routeId,
        stationId,
        staOrder,
        sDay,
        Number(hour),
        Number(minute),
      ];

      const query = getInsertTimeQuery(weather?.[RArrivalDate]?.[hour]);

      await mysql.execute(query, values, (err, result) => {
        if (err) console.log(err);
        else console.log(result);
      });
    }
  }

  console.log(`${routeId} saved`);
};

const getTime = async () => {
  const stationsJSON = fs.readFileSync(
    "./data/busStations.json",
    "utf8",
    (err) => {
      console.log(err);
    }
  );
  let stations = JSON.parse(stationsJSON);
  const m7412 = stations["234001241"];
  stations = { 234001241: m7412 };
  console.log("🚀 ~ file: time.js:57 ~ getTime ~ m7412:", m7412);

  const sDay = now.format("YYYY-MM-DD");

  for (const routeId in stations) {
    const requestArray = [];

    for (let i = 0; i < stations[routeId].length; i++) {
      const stationId = stations[routeId][i];
      const staOrder = i + 1;

      const url = getURL({ sDay, routeId, stationId, staOrder });
      const request = axios.get(url);
      requestArray.push(request);
    }

    await Promise.all(requestArray).then(async (res) => {
      await saveTime(res);
    });
  }

  mysql.end();
};

export default getTime;
