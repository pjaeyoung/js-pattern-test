// 콘퍼런스에 해당하는 파라미터를 제공하여
// 여행사의 원래 웹 서비스를 래핑
const TravelService = (function (rawWebService) {
  const conferenceAirport = 'BOS';
  const maxArrival = new Date(/*날짜 */);
  const minDeparture = new Date(/* 날짜 */);

  // 간단한 캐싱 : 인덱스는 공항이고 객체는 티켓
  const cache = [];

  return {
    getSuggestedTicket: function (homeAirport) {
      // 고객이 전체 콘퍼런스에 참가할 수 있게
      // 해당 지역의 공항에서 가장 저렴한 항공권을 조회한다.

      // 기존 기능(항공권 발급)에 새 기능(캐싱) 코드 추가함으로써 단위 테스트를 처음부터 새로 만들어야 함..이것 역시 반복!
      let ticket;
      if (cache[homeAirport]) {
        return cache[homeAirport];
      }
      ticket = rawWebService.getCheepestRoundTrip(homeAirport, conferenceAirport, maxArrival, minDeparture);

      return ticket;
    },
  };
})();

TravelService.getSuggestedTicket(attendee.homeAirport);
