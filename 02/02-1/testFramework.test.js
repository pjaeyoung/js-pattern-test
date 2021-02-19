import { createReservation, createReservationUpdated, ReservationSaver } from './testFramework.js';

describe('createReservation(passenger, flight)', () => {
  it('주어진 passenger를 passengerInfo 프로퍼티에 할당한다.', () => {
    const testPassenger = {
      firstName: '윤지',
      lastName: '김',
    };

    const testFlight = {
      number: '3443',
      carrier: '대한항공',
      destination: '물산',
    };

    const reservation = createReservation(testPassenger, testFlight);
    expect(reservation.passengerInfo).toEqual(testPassenger);
  });
  it('주어진 flight를 flightInfo 프로퍼티에 할당한다.', () => {
    const testPassenger = {
      firstName: '윤지',
      lastName: '김',
    };

    const testFlight = {
      number: '3443',
      carrier: '대한항공',
      destination: '물산',
    };

    const reservation = createReservation(testPassenger, testFlight);
    expect(reservation.flightInfo).toEqual(testFlight);
  });
});

// DRY한 테스트 코드 작성
describe('createReservation(passenger, flight)', () => {
  let testPassenger;
  let testFlight;
  let reservation;

  beforeEach(() => {
    testPassenger = {
      firstName: '윤지',
      lastName: '김',
    };

    testFlight = {
      number: '3443',
      carrier: '대한항공',
      destination: '물산',
    };
    reservation = createReservation(testPassenger, testFlight);
  });
  it('주어진 passenger를 passengerInfo 프로퍼티에 할당한다.', () => {
    expect(reservation.passengerInfo).toEqual(testPassenger);
  });
  it('주어진 flight를 flightInfo 프로퍼티에 할당한다.', () => {
    expect(reservation.flightInfo).toEqual(testFlight);
  });
});

// 외부 시스템 배제한 테스트
describe('createReservation(passenger, flight)', () => {
  let testPassenger;
  let testFlight;
  let testSaver;
  let reservation;
  let saveReservationSpy;

  beforeEach(() => {
    testPassenger = {
      firstName: '윤지',
      lastName: '김',
    };

    testFlight = {
      number: '3443',
      carrier: '대한항공',
      destination: '물산',
    };

    testSaver = new ReservationSaver();
    saveReservationSpy = jest.spyOn(testSaver, 'saveReservation');
    reservation = createReservationUpdated(testPassenger, testFlight, testSaver);
  });

  afterEach(() => {
    saveReservationSpy.mockRestore();
  });

  it('예약 정보를 저장한다', () => {
    // saveReservation이 정말 호출되었는지 어떻게 알 수 있을까?
    expect(saveReservationSpy).toHaveBeenCalled();
  });
  it('주어진 passenger를 passengerInfo 프로퍼티에 할당한다.', () => {
    expect(reservation.passengerInfo).toEqual(testPassenger);
  });
  it('주어진 flight를 flightInfo 프로퍼티에 할당한다.', () => {
    expect(reservation.flightInfo).toEqual(testFlight);
  });
});
