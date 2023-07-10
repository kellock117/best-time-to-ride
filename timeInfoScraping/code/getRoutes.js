import axios from "axios";
import fs from "fs";

// 경기도 버스 노선들의 이름 수집

const getRoutes = () => {
  const getRouteURL = ({ keyword }) => {
    return `https://api.gbis.go.kr/ws/rest/busrouteservice/json?serviceKey=1234567890&keyword=${keyword}`;
  };

  const routeRequestArray = [];

  for (let i = 0; i < 10; i++) {
    const request = axios.get(getRouteURL({ keyword: i }));
    routeRequestArray.push(request);
  }

  const busRoutesSet = new Set();

  Promise.all(routeRequestArray)
    .then((res) => {
      for (let item of res) {
        for (const route of item.data.response.msgBody.busRouteList) {
          busRoutesSet.add(route.routeId);
        }
      }
    })
    .then(() => {
      const busRouteArray = Array.from(busRoutesSet);
      const busRouteJSON = JSON.stringify(busRouteArray);
      fs.writeFile("./data/busRoutes.json", busRouteJSON, (err) =>
        console.log(err)
      );
    });
};

export default getRoutes;
