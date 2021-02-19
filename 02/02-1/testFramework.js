export function ReservationSaver() {
  this.saveReservation = function (reservation) {
    // 예약 정보를 저장하는 웹 서비스와 연동하는 복잡한 코드
  };
}

export function createReservation(passenger, flight) {
  return {
    passengerInfo: passenger,
    flightInfo: flight,
  };
}

export function createReservationUpdated(passenger, flight, saver) {
  const reservation = {
    passengerInfo: passenger,
    flightInfo: flight,
  };

  saver.saveReservation(reservation);

  return reservation;
}
