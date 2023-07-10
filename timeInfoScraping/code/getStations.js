// 각 노선의 정류소들 id와 order 수집
const getStations = async () => {
  const busRoutesJSON = fs.readFileSync(
    "./data/busRoutes.json",
    "utf8",
    (err) => {
      console.log(err);
    }
  );

  const busRoutes = JSON.parse(busRoutesJSON);

  const getStationsURL = ({ routeId }) => {
    return `https://api.gbis.go.kr/ws/rest/busrouteservice/station/json?serviceKey=1234567890&routeId=${routeId}`;
  };

  const stationInfo = {};

  for (const item of busRoutes) {
    const request = await axios.get(getStationsURL({ routeId: item }));
    const stations = [];

    for (const station of request.data.response.msgBody.busRouteStationList) {
      stations.push(station.stationId);
    }

    stationInfo[item] = stations;
  }

  const busRouteJSON = JSON.stringify(stationInfo);
  fs.writeFile("./data/busStations.json", busRouteJSON, (err) =>
    console.log(err)
  );
};

export default getStations;
