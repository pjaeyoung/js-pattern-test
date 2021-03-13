export default function redicabTransportCompany(httpService) {
  const schedulePickupUrl = 'http://redicab.com/schedulepickup';

  return {
    schedulePickup(transportDetails) {
      const details = {
        passeger: transportDetails.passengerName,
        pickup: '콘퍼런트 센터',
        pickupTime: transportDetails.departureTime,
        dropoff: '공항',
        rateCode: 'JavascriptConference',
      };

      return httpService.post(schedulePickupUrl, details).then(function onSuccess(confirmation) {
        return confirmation.confirmationCode;
      });
    },
  };
}
