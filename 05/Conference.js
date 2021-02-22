const Conference = {};

Conference.attendee = function (firstName = 'None', lastName = 'None') {
  let checkedIn = false;

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
  return {
    recordCheckIn(attendee) {},
  };
};

Conference.checkInService = function (recorder) {
  return {
    checkIn(attendee) {
      attendee.checkIn();
      recorder.recordCheckIn(attendee);
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
