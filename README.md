# best-time-to-ride

출발 정류장에서 도착 정류장까지의 최적의 시간대를 알려주는 웹 어플

# functional requirements

요일별 10개의 최소 소요 시간의 시간대 제공
요일별 모든 시간대의 이동 소요시간 제공
이동 시간에 영향을 줄 수 있는 요소들(비, 눈, 공휴일 등등) 필터링 후 시간 계산 제공
History 기능 제공

현재는 한 개의 노선만 가능

# data collection

매일 00:30, 12:30에 날씨 데이터 수집

# tech used

React, react-native or flutter for front-end
express for back-end
mysql(rdb, replication) and redis(caching) for database
Jenkins for CI/CD

netlify for front-end hosting
koyeb for back-end hosting
db4free for database hosting
