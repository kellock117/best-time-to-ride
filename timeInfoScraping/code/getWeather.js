import axios from "axios";
import moment from "moment";

import { mysql, coordinates, sleep } from "./utils.js";

const getWeatherURL = ({ base_date, base_time, nx, ny }) => {
  return `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}&serviceKey=e4Z1Y2tRHRPH%2FofQg2ZU3nKd9KLxbpyBOcMoScsoH664pQjSRjY%2BymV%2BpOkN14NQhzDCNi0OC904Zea5CymJnQ%3D%3D`;
};

const validateData = (data) => {
  // 12시간의 정보를 가지고 있지 않다면 false 반환
  if (Object.keys(data).length !== 12) return false;

  for (const hour in data) {
    // 28개 도시의 정보를 포함하고 있지 않다면 false 반환
    if (data[hour].length !== 28) return false;
  }

  return true;
};

// 0030, 1230시에 업데이트
// -12부터 -1까지 총 12시간
const getTime = () => {
  const hourArray = [];
  const now = moment();

  for (let i = 12; i >= 1; i--) {
    const temp = now.clone();
    // fomat = YYYMMDD HH00 (date, hour)
    hourArray.push(temp.subtract(i, "h").format("YYYYMMDD HH") + "00");
  }

  return hourArray;
};

// 데이터를 mysql에 저장
const saveData = async ({ base_date, base_time, location, precipitation }) => {
  const query = `INSERT INTO WEATHER (base_date, base_time, location, precipitation) VALUES ?`;
  const values = [base_date, base_time, location, precipitation];

  const result = await mysql.query(query, [values]);
  console.log(result);
};

const getWeather = async () => {
  // 시간별 도시들의 강수 확인
  const precipitationInfoByHour = {};
  const hourArray = getTime();

  let coordinatesKeys = Object.keys(coordinates);
  let precipitationInfoByLocation = {};

  const saveWeatherInfo = async () => {
    for (const time of hourArray) {
      const [date, hour] = time.split(" ");
      console.log(date, hour);

      for (const location of coordinatesKeys) {
        // ip 차단되는걸 방지하기 위해 7개 시마다 1초씩 setTimeOut
        console.log(location);
        // if (
        //   ["고양", "구리", "동두천", "시흥", "양주", "의왕", "평택"].includes(
        //     location
        //   )
        // )
        //   await sleep(2000);

        // extract the date value and hour value from time

        const url = getWeatherURL({
          base_date: date,
          base_time: hour,
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
        const precipitation = item[0].obsrValue !== "0";

        precipitationInfoByLocation[location] = precipitation;
        coordinatesKeys = coordinatesKeys.filter((key) => key !== location);
      }

      precipitationInfoByHour[hour] = precipitationInfoByLocation;
      console.log(
        "🚀 ~ file: getWeather.js:182 ~ saveWeatherInfo ~ precipitationInfoByLocation:",
        precipitationInfoByLocation
      );
      coordinatesKeys = Object.keys(coordinates);
      // iterate 한 시간대는 제거
      hourArray = hourArray.filter((time) => time !== time);
    }

    if (validateData(precipitationInfoByHour))
      saveData(precipitationInfoByHour);
    else getWeather();
  };

  while (hourArray.length !== 0) {
    try {
      await saveWeatherInfo();
    } catch (error) {
      console.log(error.message);
    }
  }
};

getWeather();

export default getWeather;
