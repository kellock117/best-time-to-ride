import axios from "axios";
import moment from "moment";

import { mysql, coordinates, cityToIndex } from "./utils.js";

const hour = 12;

const getWeatherURL = ({ base_date, base_time, nx, ny }) => {
  return `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}&serviceKey=e4Z1Y2tRHRPH%2FofQg2ZU3nKd9KLxbpyBOcMoScsoH664pQjSRjY%2BymV%2BpOkN14NQhzDCNi0OC904Zea5CymJnQ%3D%3D`;
};

const validateData = (data) => {
  // 12시간의 정보를 가지고 있지 않다면 false 반환
  if (Object.keys(data).length !== hour) {
    console.log(`missing hour value`);
    return false;
  }

  for (const hour in data) {
    // 28개 도시의 정보를 포함하고 있지 않다면 false 반환
    if (Object.keys(data[hour]).length !== 28) {
      console.log(`${hour} has missing data in ${data[hour]}`);
      return false;
    }
  }

  return true;
};

// 0030, 1230시에 업데이트
// -12부터 -1까지 총 12시간
const getTime = () => {
  const hourArray = [];
  const now = moment();

  for (let i = hour; i >= 1; i--) {
    const temp = now.clone();
    // fomat = YYYMMDD HH00 (date, hour)
    hourArray.push(temp.subtract(i, "h").format("YYYYMMDD HH") + "00");
  }

  return hourArray;
};

// 데이터를 mysql에 저장
const saveData = async (data) => {
  const query = `INSERT INTO WEATHER (base_date, base_time, location) VALUES (?, ?, ?)`;

  try {
    for (const time in data) {
      console.log(time);
      const [base_date, base_hour] = time.split(" ");

      for (const location in data[time]) {
        // 맑은 날씨면 스킵
        if (!data[time][location]) continue;

        const values = [
          base_date,
          Number(base_hour.slice(0, 2)),
          cityToIndex[location],
        ];

        await mysql.execute(query, values, (err, result) => {
          if (err) console.log(err);
          else console.log(result);
        });
      }
    }
  } catch (error) {
    console.log(error);
  }

  console.log("weather data saved");

  mysql.end();
};

const getWeather = async () => {
  // 시간별 도시들의 강수 확인
  const precipitationInfoByTime = {};
  let hourArray = getTime();

  let coordinatesKeys = Object.keys(coordinates);
  let precipitationInfoByLocation = {};

  const saveWeatherInfo = async () => {
    for (const time of hourArray) {
      // extract the date value and hour value from time
      const [base_date, base_hour] = time.split(" ");

      for (const location of coordinatesKeys) {
        const url = getWeatherURL({
          base_date: base_date,
          base_time: base_hour,
          nx: coordinates[location].x,
          ny: coordinates[location].y,
        });

        const {
          data: {
            response: {
              body: {
                items: { item },
              },
            },
          },
        } = await axios.get(url);

        // 0은 맑음 1~5는 비 또는 눈을 의미
        const precipitation = item[0].obsrValue !== "0" ? 1 : 0;

        precipitationInfoByLocation[location] = precipitation;
        coordinatesKeys = coordinatesKeys.filter((key) => key !== location);
      }

      precipitationInfoByTime[time] = precipitationInfoByLocation;
      coordinatesKeys = Object.keys(coordinates);
      // iterate 한 시간대는 제거
      hourArray = hourArray.filter((t) => t !== time);
    }

    if (validateData(precipitationInfoByTime))
      saveData(precipitationInfoByTime);
    else getWeather();
  };

  while (hourArray.length !== 0) {
    try {
      await saveWeatherInfo();
    } catch (error) {
      if (error.message !== "connect ETIMEDOUT 27.101.215.194:80")
        console.log(error.message);
    }
  }
};

export default getWeather;
