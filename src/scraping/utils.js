import "dotenv/config";
import mysql2 from "mysql2";

export const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const coordinates = {
  고양: {
    x: 56,
    y: 129,
  },
  과천: {
    x: 60,
    y: 124,
  },
  광명: {
    x: 58,
    y: 125,
  },
  광주: {
    x: 65,
    y: 123,
  },
  구리: {
    x: 62,
    y: 127,
  },
  군포: {
    x: 59,
    y: 122,
  },
  김포: {
    x: 55,
    y: 128,
  },
  남양주: {
    x: 64,
    y: 128,
  },
  동두천: {
    x: 61,
    y: 134,
  },
  부천: {
    x: 56,
    y: 125,
  },
  성남: {
    x: 63,
    y: 124,
  },
  수원: {
    x: 60,
    y: 120,
  },
  시흥: {
    x: 77,
    y: 123,
  },
  안산: {
    x: 57,
    y: 121,
  },
  안성: {
    x: 65,
    y: 115,
  },
  안양: {
    x: 59,
    y: 123,
  },
  양주: {
    x: 61,
    y: 131,
  },
  여주: {
    x: 71,
    y: 121,
  },
  오산: {
    x: 62,
    y: 118,
  },
  용인: {
    x: 63,
    y: 120,
  },
  의왕: {
    x: 60,
    y: 122,
  },
  의정부: {
    x: 61,
    y: 130,
  },
  이천: {
    x: 68,
    y: 121,
  },
  파주: {
    x: 56,
    y: 131,
  },
  평택: {
    x: 62,
    y: 114,
  },
  포천: {
    x: 64,
    y: 134,
  },
  하남: {
    x: 64,
    y: 126,
  },
  화성: {
    x: 57,
    y: 119,
  },
};

export const indexToRouteTypeNames = [
  "마을버스",
  "직행좌석형시내버스",
  "직행좌석형농어촌버스",
  "좌석형시내버스",
  "일반형시내버스",
  "일반형농어촌버스",
  "일반형시외버스",
  "광역급행형시내버스",
  "리무진형 공항버스",
  "일반형 공항버스",
  "좌석형 공항버스",
];

export const routeTypeNameToIndex = {
  마을버스: 0,
  직행좌석형시내버스: 1,
  직행좌석형농어촌버스: 2,
  좌석형시내버스: 3,
  일반형시내버스: 4,
  일반형농어촌버스: 5,
  일반형시외버스: 6,
  광역급행형시내버스: 7,
  "리무진형 공항버스": 8,
  "일반형 공항버스": 9,
  "좌석형 공항버스": 10,
};

export const indexToCity = [
  "고양",
  "과천",
  "광명",
  "광주",
  "구리",
  "군포",
  "김포",
  "남양주",
  "동두천",
  "부천",
  "성남",
  "수원",
  "시흥",
  "안산",
  "안성",
  "안양",
  "양주",
  "여주",
  "오산",
  "용인",
  "의왕",
  "의정부",
  "이천",
  "파주",
  "평택",
  "포천",
  "하남",
  "화성",
];

export const cityToIndex = {
  고양: 0,
  과천: 1,
  광명: 2,
  광주: 3,
  구리: 4,
  군포: 5,
  김포: 6,
  남양주: 7,
  동두천: 8,
  부천: 9,
  성남: 10,
  수원: 11,
  시흥: 12,
  안산: 13,
  안성: 14,
  안양: 15,
  양주: 16,
  여주: 17,
  오산: 18,
  용인: 19,
  의왕: 20,
  의정부: 21,
  이천: 22,
  파주: 23,
  평택: 24,
  포천: 25,
  하남: 26,
  화성: 27,
};

// export const mysql = mysql2.createPool(process.env.DATABASE_URL).promise();
export const mysql = mysql2
  .createPool({
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    // port: process.env.MYSQL_PORT,
    dateStrings: true,
    ssl: { rejectUnauthorized: true },
  })
  .promise();
