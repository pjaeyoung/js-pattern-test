function Attendee(attendeeId) {
  if (!(this instanceof Attendee)) {
    return new Attendee(attendeeId);
  }

  this.attendeeId = attendeeId;
  this.service = new ConferenceWebSvc();
  this.messenger = new Messenger();
}

// 주어진 세션에 좌석 예약을 시도한다.
// 성공/실패 여부를 메시지로 알려준다.
Attendee.prototype.reserve = function (sessionId) {
  if (this.service.reserve(this.attendeeId, sessionId)) {
    this.messenger.success(
      `좌석 예약이 완료되었습니다! 고객님은 ${this.service.getRemainingReservation()} 좌석을 추가 예약하실 수 있습니다.}`,
    );
  } else {
    this.messenger.failure('죄송합니다. 해당 좌석은 예약하실 수 없습니다.');
  }
};

// 의존성 주입식 변경
function Attendee(attendeeId, service, messenger) {
  if (!(this instanceof Attendee)) {
    return new Attendee(attendeeId);
  }

  this.attendeeId = attendeeId;
  this.service = service;
  this.messenger = messenger;
}

// 운영 환경
const attendee = new Attendee(id, new ConferenceWebSvc(), new Messenger());

// 개발(테스트) 환경
const attendee = new Attendee(id, fakeService, fakeMessenger);
