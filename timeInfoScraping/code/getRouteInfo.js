import axios from "axios";
import fs from "fs";

import { mysql, routeTypeNameToIndex } from "./utils.js";

const getURL = (routeId) => {
  return `https://api.gbis.go.kr/ws/rest/busrouteservice/info/json?serviceKey=1234567890&routeId=${routeId}`;
};

const getRouteInfo = async () => {
  const busRoutesJSON = fs.readFileSync(
    "./data/busRoutes.json",
    "utf8",
    (err) => {
      console.log(err);
    }
  );

  const busRoutes = JSON.parse(busRoutesJSON);

  const routeInfo = {};

  for (const routeId of busRoutes) {
    const url = getURL(routeId);
    const request = await axios.get(url);

    const data = request.data.response?.msgBody?.busRouteInfoItem;

    const routeTypeName = data?.routeTypeName;
    const routeName = data?.routeName.toString();
    const adminName = data?.adminName.toString();

    if (routeTypeName !== undefined || routeName !== undefined)
      routeInfo[routeId] = { routeTypeName, routeName, adminName };
  }

  const routeInfoJSON = JSON.stringify(routeInfo);
  fs.writeFile("./data/routeInfo.json", routeInfoJSON, (err) =>
    console.log(err)
  );
};

const printLongestRouteName = () => {
  const file = fs.readFileSync("./data/routeInfo.json", "utf8", (err) => {
    console.log(err);
  });

  const data = JSON.parse(file);

  const routeNames = Object.entries(data)
    .map((key) => key[1].routeName)
    .reduce((a, b) => {
      return a.length > b.length ? a : b;
    });

  console.log("🚀 ~ file: getRouteInfo.js:53 ~ routeNames:", routeNames);
};

const printSmallestAndLargestRouteId = () => {
  const file = fs.readFileSync("./data/routeInfo.json", "utf8", (err) => {
    console.log(err);
  });

  const data = JSON.parse(file);

  const largestRouteId = Object.entries(data)
    .map((key) => key[0])
    .reduce((a, b) => {
      return a > b ? a : b;
    });
  console.log(
    "🚀 ~ file: getRouteInfo.js:80 ~ printSmallestAndLargestRouteId ~ largestRouteId:",
    largestRouteId
  );

  const smallestRouteId = Object.entries(data)
    .map((key) => key[0])
    .reduce((a, b) => {
      return a < b ? a : b;
    });
  console.log(
    "🚀 ~ file: getRouteInfo.js:88 ~ printSmallestAndLargestRouteId ~ smallestRouteId:",
    smallestRouteId
  );
};

const saveRouteInfo = async () => {
  const file = fs.readFileSync("./data/routeInfo.json", "utf8", (err) => {
    console.log(err);
  });

  const data = JSON.parse(file);
  const query = `INSERT INTO ROUTE_INFO(routeId, routeTypeName, routeName, adminName) VALUES (?, ?, ?, ?)`;

  for (const routeId of Object.keys(data)) {
    const routeTypeName = data[routeId].routeTypeName;
    const routeName = data[routeId].routeName;
    const adminName = data[routeId].adminName;

    const values = [
      Number(routeId),
      routeTypeNameToIndex[routeTypeName],
      routeName,
      adminName,
    ];

    // console.log(
    //   Number(routeId),
    //   routeTypeNameToIndex[routeTypeName],
    //   routeName
    // );

    await mysql.execute(query, values, (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    });
  }

  mysql.end();
};

saveRouteInfo();
