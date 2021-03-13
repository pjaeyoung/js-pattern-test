import redicabTransportCompany from './redicabTransportCompany';

describe('redicabTransportCompany', () => {
  let httpService, company, details, expectedData, testConfirmation;

  beforeEach(() => {
    httpService = Conference.httpService();
    company = redicabTransportCompany(httpService);

    details = {
      transportCompany: 'RediCab',
      passengerName: '김윤지',
      departureTime: '7:30 PM',
    };

    expectedData = {
      passeger: details.passengerName,
      pickup: '콘퍼런스 센터',
      pickupTime: details.departureTime,
      dropOff: '공항',
      rateCode: 'JavascriptConference',
    };

    testConfirmation = {
      confimationCode: 'AAA-BBB-CCC',
      anticipatedCharge: 34.0,
    };
  });

  describe('schedulePickup(transportDetails)', () => {
    it('기대 데이터를 올바른 URL로 전송한다', () => {
      jest.spyOn(httpService, 'post').mockImplementation((url, data) => {
        expect(data).toEqual(expectedData);
        expect(url).toEqual(company.getSchedulePickupUrl());
        return new Promise((resolve) => resolve(testConfirmation));
      });

      company.schedulePickup(details);
    });

    it('확인 코드로 귀결된다', (done) => {
      jest.spyOn(httpService, 'post').mockResolvedValue(testConfirmation);
      company.schedulePickup(details).then(
        function resolve(confirmation) {
          expect(confirmation).toEqual(testConfirmation.confimationCode);
          done();
        },
        function rejected(reason) {
          expect('버려졌을 리 없다').toBe(false);
          done();
        },
      );
    });
  });
});
