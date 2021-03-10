import Conference1 from './fakeAttendeeWebApi';
import Conference2 from './attendeeWebApiDecorator';

describe('attendeeWebApiDecorator', () => {
  let decoratedWebApi, baseWebApi, attendeeA, attendeeB;
  const underlyingFailure = '본함수 실패';

  function createAttendee(lastName, firstName) {
    let id;
    const attendee = {
      getFullName() {
        return `${firstName}${lastName}`;
      },
      getId() {
        return id;
      },
      setId(newId) {
        id = newId;
      },
      copy() {
        return { ...attendee };
      },
    };

    return attendee;
  }

  // decoratedWebApi.getAll()을 실행하면 프라미스가 귀결되어 반환될 것이다.
  // done - 비동기 처리 시 테스트 프레임워크에서 널리 쓰이는 done()함수
  // expectation - 반환된 attendees에 관한 기대식을 적용할 함수
  function getAllWithSuccessExpectation(done, expectation) {
    decoratedWebApi.getAll().then(
      function onSuccess(attendees) {
        expectation(attendees);
        done();
      },
      function onFailure() {
        expect('getAll 실패').toBe(false);
        done();
      },
    );
  }

  beforeEach(() => {
    baseWebApi = Conference1.fakeAttendeeWebApi();
    decoratedWebApi = Conference2.attendeeWebApiDecorator(baseWebApi);
    attendeeA = createAttendee('제이', '이');
    attendeeB = createAttendee('솔이', '이');
  });

  describe('getAll()', () => {
    describe('원 getAll이 성공할 경우', () => {
      it('미결 상태인 레코드가 하나도 없다면 처리된 전체 레코드에 대한 프라미스를 반환한다.', (done) => {
        jest.spyOn(baseWebApi, 'getAll').mockReturnValue(
          new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve([attendeeA, attendeeB]);
            }, 1);
          }),
        );

        decoratedWebApi.getAll().then(
          function onSuccess(attendees) {
            expect(attendees).toHaveLength(2);
            done();
          },
          function onFailure() {
            expect('getAll 실패').toBe(false);
            done();
          },
        );
      });
    });
    describe('원 getAll이 실패할 경우', () => {
      it('원버림 프라미스를 반환한다.', (done) => {
        jest.spyOn(baseWebApi, 'getAll').mockReturnValue(
          new Promise(function (resolve, reject) {
            setTimeout(function () {
              reject(underlyingFailure);
            }, 1);
          }),
        );

        decoratedWebApi.getAll().then(
          function onSuccess() {
            expect('Underlying getAll succeeded').toBe(false);
            done();
          },
          function onFailure(reason) {
            expect(reason).toBe(underlyingFailure);
            done();
          },
        );
      });
    });

    it('처리된 전체 레코드 + 미결 상태인 전체 레코드를 반환한다.', (done) => {
      decoratedWebApi.post(attendeeA).then(function () {
        decoratedWebApi.post(attendeeB);
        getAllWithSuccessExpectation(done, function onSuccess(attendees) {
          expect(attendees.length).toBe(2);
          expect(attendees[0].getId()).not.toBeUndefined();
          expect(attendees[1].getId()).toBeUndefined();
        });
      });
    });
  });

  describe('post(attendee)', () => {
    describe('원post가 성공할 경우', () => {
      it('ID가 채번된 attendee로 귀결되는 프라미스를 반환한다.', (done) => {
        decoratedWebApi.post(attendeeA).then(
          function onSuccess(attendee) {
            expect(attendee.getFullName()).toBe(attendeeA.getFullName());
            expect(attendee.getId()).not.toBeUndefined();
            done();
          },
          function onFailure() {
            expect('실패').toBe(false);
            done();
          },
        );
      });

      it('getAll을 즉시 실행하면 ID가 채번되지 않은 레코드가 포함된다', (done) => {
        decoratedWebApi.post(attendeeA);
        //post가 귀결되기를 기다리지 않고 getAll를 바로 실행한다.
        getAllWithSuccessExpectation(done, function onSuccess(attendees) {
          expect(attendees).toHaveLength(1);
          expect(attendees[0].getId()).toBeUndefined();
        });
      });

      it('getAll을 지연시키면 ID가 채번된 레코드가 포함된다.', (done) => {
        decoratedWebApi.post(attendeeA).then(function () {
          getAllWithSuccessExpectation(done, function onSuccess(attendees) {
            expect(attendees).toHaveLength(1);
            expect(attendees[0].getId()).not.toBeUndefined();
          });
        });
      });

      it('getAll에 이미 추가된 레코드의 ID들을 채운다.', (done) => {
        let recordsFromGetAll, promiseFromPostA;
        //post를 실행하고 그 결과를 기다리지 않는다.
        promiseFromPostA = decoratedWebApi.post(attendeeA);
        //getAll를 즉시 실행하고 그 결과를 포착한다.
        decoratedWebApi.getAll().then(function onSuccess(attendees) {
          recordsFromGetAll = attendees;
          expect(recordsFromGetAll[0].getId()).toBeUndefined();
        });

        // 이제 post가 최종 귀결되기를 기다린다.
        // post의 타임아웃이 getAll의 타임아웃보다 시간이 더 길다.
        // attendeeId가 그 모습을 드러낼 것이다.

        promiseFromPostA.then(function () {
          expect(recordsFromGetAll[0].getId()).not.toBeUndefined();
          done();
        });
      });
    });
    describe('전송한 참가자에 대해서만 호출할 때', () => {
      it('버림 프라미스를 반환한다.', (done) => {
        decoratedWebApi.post(attendeeA);
        decoratedWebApi.post(attendeeA).then(
          function onSuccess() {
            expect('전송 성공').toBe(false);
            done();
          },
          function onFailure(error) {
            expect(error instanceof Error).toBe(true);
            expect(error.message).toBe(decoratedWebApi.getMessages().postPending);
            done();
          },
        );
      });
    });
  });
});
