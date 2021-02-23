const Conference = {};

Conference.attendee = function (firstName = 'None', lastName = 'None') {
  let checkedIn = false;
  let checkInNumber;

  return {
    getFullName: function () {
      return `${firstName} ${lastName}`;
    },
    isCheckedIn: function () {
      return checkedIn;
    },
    checkIn: function () {
      checkedIn = true;
    },
    getCheckInNumber: function () {
      return checkInNumber;
    },
    setCheckInNumber: function (number) {
      checkInNumber = number;
    },
    undoCheckIn: function () {
      checkedIn = false;
      checkInNumber = undefined;
    },
  };
};

Conference.attendeeCollection = function () {
  let attendees = [];

  return {
    contains: function (attendee) {
      return attendees.some((_attendee) => _attendee.getFullName() === attendee.getFullName());
    },
    add: function (attendee) {
      if (!this.contains(attendee)) {
        attendees.push(attendee);
      }
    },
    remove: function (attendee) {
      if (this.contains(attendee)) {
        attendees = attendees.filter((_attendee) => _attendee !== attendee);
      }
    },
    iterate: function (callback) {
      // attendees의 각 attendee에 대해 콜백을 실행한다.
      attendees.forEach((attendee) => callback(attendee));
    },
  };
};

Conference.checkInRecorder = function () {
  const messages = {
    mustBeCheckedIn: '참가자는 체크인 된 것으로 표시되어야 합니다.',
  };
  return {
    recordCheckIn(attendee) {
      return new Promise((resolve, reject) => {
        if (attendee.isCheckedIn()) {
          resolve(4444);
        } else {
          reject(new Error(messages.mustBeCheckedIn));
        }
      });
    },
    getMessages() {
      return messages;
    },
  };
};

Conference.checkInService = function (recorder) {
  return {
    checkIn(attendee) {
      return new Promise((resolve, reject) => {
        attendee.checkIn();
        recorder.recordCheckIn(attendee).then(
          function onRecordCheckInSucceeded(checkInNumber) {
            attendee.setCheckInNumber(checkInNumber);
            resolve(checkInNumber);
          },
          function onRecordCheckInFailed(reason) {
            attendee.undoCheckIn();
            reject(reason);
          },
        );
      });
    },
  };
};

Conference.checkedInAttendeeCounter = function () {
  let checkedInAttendeesCount = 0;
  const self = {
    getCount() {
      return checkedInAttendeesCount;
    },
    increment() {
      checkedInAttendeesCount++;
    },
    countIfCheckedIn(attendee) {
      if (attendee.isCheckedIn()) {
        self.increment();
      }
    },
  };

  return self;
};

const checkInService = Conference.checkInService(Conference.checkInRecorder);
const attendees = Conference.attendeeCollection();

attendees.iterate(checkInService.checkIn);

export { Conference };
