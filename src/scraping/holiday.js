import axios from "axios";
import moment from "moment";

import { mysql } from "./utils.js";

const getURL = ({ year, month }) =>
  `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=e4Z1Y2tRHRPH%2FofQg2ZU3nKd9KLxbpyBOcMoScsoH664pQjSRjY%2BymV%2BpOkN14NQhzDCNi0OC904Zea5CymJnQ%3D%3D&solYear=${year}&solMonth=${month}&_type=json`;

const saveHoliday = async (data) => {
  if (typeof data === "object") data = [data];
  const sql = `INSERT INTO HOLIDAY (year, month, day, dateName) VALUES (?, ?, ?, ?)`;

  for (let holiday of data) {
    const locdate = holiday.locdate.toString();

    const values = [
      locdate.slice(0, 4), // year
      locdate.slice(4, 6), // month
      locdate.slice(6, 8), // day
      holiday.dateName,
    ];

    console.log(values);

    await mysql.execute(sql, values, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  }

  console.log("holiday save success");

  mysql.end();
};

const getHoliday = async () => {
  const year = moment().year();
  let month = moment().add(1, "M").format("MM");

  const url = getURL({ year, month });

  const {
    data: {
      response: {
        body: {
          items: { item },
        },
      },
    },
  } = await axios.get(url);
  console.log(item);
  await saveHoliday(item);
};

export default getHoliday;
