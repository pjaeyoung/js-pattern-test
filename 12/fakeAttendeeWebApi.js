const Conference = {};

// attendeeWebApi의 가짜 버전. 진짜와 메서드는 같지만 전체적으로 클라이언트 측 코드만 있다.
Conference.fakeAttendeeWebApi = function () {
  const attendees = []; // 가짜 데이터베이스 테이블

  return {
    // 서버에 attendee를 POST 전송하는 척 한다.
    // attendee 사본(마치 서버에서 새 버전을 조회해오는 것처럼)으로
    // 귀결되는 프라미스를 반환하고, 귀결 시점에 이 레코드에는
    // 데이터베이스에서 할당된 PK(attendeeId)l가 들어있을 것이다.

    // 프라미스를 버려야 하는 테스트라면 스파이를 이용하자
    post(attendee) {
      return new Promise(function (resolve, reject) {
        // 5 밀리 초에 불과하지만,
        // setTimeout은 프라미스 귀결을 다음 차례로 지연한다.
        setTimeout(function pretendPostingToServer() {
          const copyOfAttendee = attendee.copy();
          copyOfAttendee.setId(attendees.length + 1);
          attendees.push(copyOfAttendee);
          resolve(copyOfAttendee);
        }, 5);
      });
    },
    // 전체 참가자에 대한 프라미스를 반환한다.
    // 이 프라미스는 반드시 귀결되지만, 필요하면 테스트 코등에서 스파이를 심을 수 있다
    getAll() {
      return new Promise(function (resolve, reject) {
        // setTimeout은 실제 조건을 흉내 내기 위해
        // post 보다 지연 시간이 짧다
        setTimeout(function pretendToGetAllFromServer() {
          const copies = attendees.map((attendee) => attendee.copy());
          resolve(copies);
        }, 1);
      });
    },
  };
};

export default Conference;
