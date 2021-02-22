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
      jest.spyOn(checkInRecorder, 'recordCheckIn');

      checkInService = Conference.checkInService(checkInRecorder);
      attendee = Conference.attendee('형철', '서');
    });

    describe('checkInService.checkIn(attendee)', function () {
      it('참가자를 체크인 처리한 것으로 표시한다', () => {
        checkInService.checkIn(attendee);
        expect(attendee.isCheckedIn()).toBe(true);
      });

      it('체크인을 등록한다', () => {
        checkInService.checkIn(attendee);
        expect(checkInRecorder.recordCheckIn).toHaveBeenCalledWith(attendee);
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
