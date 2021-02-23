import { Conference } from './Conference';

describe('Conference', () => {
  describe('Conference.attendeeCollection', () => {
    describe('iterate(callback)', () => {
      let collection, callbackSpy;

      function addAttendeesToCollection(attendees) {
        attendees.forEach((attendee) => {
          collection.add(attendee);
        });
      }

      function verifyCallbackWasExecutedForEachAttendee(attendees) {
        expect(callbackSpy).toHaveBeenCalledTimes(attendees.length);
        attendees.forEach((attendee, index) => {
          expect(callbackSpy).toHaveBeenNthCalledWith(index + 1, attendee);
        });
      }

      beforeEach(() => {
        collection = Conference.attendeeCollection();
        callbackSpy = jest.fn();
      });

      it('빈 컬렉션에서는 콜백을 실행하지 않는다.', () => {
        collection.iterate(callbackSpy);
        expect(callbackSpy).not.toHaveBeenCalled();
      });

      it('원소가 하나뿐인 컬렉션은 콜백을 한 번만 실행한다.', () => {
        const attendees = [Conference.attendee('윤지', '김')];
        addAttendeesToCollection(attendees);
        collection.iterate(callbackSpy);

        verifyCallbackWasExecutedForEachAttendee(attendees);
      });

      it('컬렉션 원소마다 한 번씩 콜백을 실행한다.', () => {
        const attendees = [
          Conference.attendee('Tom', 'Kazansky'),
          Conference.attendee('Charlotte', 'Blackwood'),
          Conference.attendee('태영', '김'),
        ];

        addAttendeesToCollection(attendees);

        collection.iterate(callbackSpy);

        verifyCallbackWasExecutedForEachAttendee(attendees);
      });
    });
  });

  describe('Conference.checkInService', () => {
    let checkInService;
    let checkInRecorder;
    let attendee;

    beforeEach(() => {
      checkInRecorder = Conference.checkInRecorder();
      checkInService = Conference.checkInService(checkInRecorder);
      attendee = Conference.attendee('형철', '서');
    });

    describe('checkInService.checkIn(attendee)', function () {
      describe('checkInRecorder 성공 시', () => {
        let checkInNumber = 1234;

        beforeEach(() => {
          jest.spyOn(checkInRecorder, 'recordCheckIn').mockImplementation(() => Promise.resolve(checkInNumber));
        });
        it('참가자를 체크인 처리한 것으로 표시한다', () => {
          checkInService.checkIn(attendee);
          expect(attendee.isCheckedIn()).toBe(true);
        });

        it('체크인을 등록한다', () => {
          checkInService.checkIn(attendee);
          expect(checkInRecorder.recordCheckIn).toHaveBeenCalledWith(attendee);
        });

        // 6장
        it('참가자의 checkInNumber를 지정한다', (done) => {
          checkInService.checkIn(attendee).then(
            function onPromiseResolved() {
              expect(attendee.getCheckInNumber()).toBe(checkInNumber);
              done();
            },
            function onPromiseRejected() {
              expect('이 실패 분기 코드가 실행됐다.').toBe(false);
              done();
            },
          );
        });
      });

      describe('checkInRecorder 실패 시', () => {
        const recorderError = new Error('체크인 등록 실패');

        beforeEach(() => {
          jest.spyOn(checkInRecorder, 'recordCheckIn').mockImplementation(() => Promise.reject(recorderError));
        });

        it('기대 사유와 함께 버릴 프라미스를 반환한다.', (done) => {
          checkInService.checkIn(attendee).then(
            function onPromiseResolved() {
              expect('이 성공 함수가 실행됐다.').toBe(false);
              done();
            },
            function onPromiseRejected(reason) {
              expect(reason).toBe(recorderError);
              done();
            },
          );
        });
      });
    });
  });

  describe('Conference.checkInRecorder', () => {
    let attendee, checkInRecorder;

    beforeEach(() => {
      attendee = Conference.attendee('Tom', 'Jones');
      checkInRecorder = Conference.checkInRecorder();
    });

    describe('recordCheckIn(attendee)', () => {
      it('참가자가 체크인되면 checkInNumber로 귀결된 프라미스를 반환한다.', (done) => {
        attendee.checkIn();
        checkInRecorder
          .recordCheckIn(attendee)
          .then(
            function onPromiseResolved(actualCheckInNumber) {
              expect(typeof actualCheckInNumber).toBe('number');
            },
            function onPromiseRejected() {
              expect('프라미스는 버려졌다.').toBe(false);
            },
          )
          .finally(() => {
            done();
          });
      });

      it('참가자가 체크인되지 않으면 에러와 버림 프라미스를 반환한다.', (done) => {
        checkInRecorder
          .recordCheckIn(attendee)
          .then(
            function onPromiseResolved() {
              expect('프라미스는 귀결됐다.').toBe(false);
            },
            function onPromiseRejected(reason) {
              expect(reason instanceof Error).toBe(true);
              expect(reason.message).toBe(checkInRecorder.getMessages().mustBeCheckedIn);
            },
          )
          .finally(() => {
            done();
          });
      });
    });
  });
  describe('Conference.checkedInAttendeeCounter', () => {
    let counter;

    beforeEach(() => {
      counter = Conference.checkedInAttendeeCounter();
    });

    describe('countIfCheckedIn(attendee)', () => {
      let attendee;

      beforeEach(() => {
        attendee = Conference.attendee('태영', '김');
      });

      it('참가자가 체크인하지 않으면 인원수를 세지 않는다.', () => {
        counter.countIfCheckedIn(attendee);
        expect(counter.getCount()).toBe(0);
      });

      it('참가자가 체크인하면 인원수를 센다', () => {
        attendee.checkIn();
        counter.countIfCheckedIn(attendee);
        expect(counter.getCount()).toBe(1);
      });

      it('this가 꼭 checkedInAttendeeCounter 인스턴스를 가리키는 것은 아니다', () => {
        attendee.checkIn();
        counter.countIfCheckedIn.call({}, attendee);
        expect(counter.getCount()).toBe(1);
      });
    });
  });
});
