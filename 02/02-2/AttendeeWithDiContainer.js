import { DiContainer } from './DiContainer';

const MyApp = {};

MyApp.diContainer = new DiContainer();

MyApp.diContainer.register('Service', function () {
  return new CongerenceWebSvc();
});
MyApp.diContainer.register('Messenger', [], function () {
  return new Messenger();
});

MyApp.diContainer.register('AttendeeFactory', ['Service', 'Messenger'], function (service, messenger) {
  return function (attendeeId) {
    return new Attendee(service, messenger, attendeeId);
  };
});

const attendeeId = 123;
const sessionId = 1;

const attendee = MyApp.diContainer.get('AttendeeFactory')(attendeeId);
attendee.reserve(sessionId);
