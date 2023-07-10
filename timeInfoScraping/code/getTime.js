const getTime = () => {
  const getTimeURL = ({ sDay, routeId, stationId, staOrder }) => {
    return `https://api.gbis.go.kr/ws/rest/pastarrivalservice/json?serviceKey=1234567890&sDay=${sDay}&routeId=${routeId}&stationId=${stationId}&staOrder=${staOrder}`;
  };
};

//공휴일인지 확인

//날씨 확인
