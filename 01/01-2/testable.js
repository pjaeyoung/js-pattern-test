const Users = {};
Users.registration = function () {
  return {
    validateAndRegisterUser: function validateAndDisplayUser(user) {
      // user 객체가 올바르게 채워졌는지 검증 (사용자 검증)
      if (!user || user.name === '' || user.password === '' || user.password.length < 6) {
        throw new Error('사용자 인증이 실패했습니다.');
      }

      // 검증을 마친 user 객체를 서버로 전송 (서버와 직접 통신)
      fetch('http://yourapplication.com/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      // UI에 메세지 표시 (UI 직접 다루기)
      document.getElementById('user-message').textContent = `가입해주셔서 감사합니다. ${user.name}님`;
    },
  };
};

/**
 * 1.사용자 검증
 * user 객체가 undefined이거나 null이면 인증 실패 에러를 발생해야 한다.
 * user 객체의 속성 name이 빈문자열이면 인증 실패 에러를 발생해야 한다.
 * user 객체의 속성 password가 빈문자열이면 인증 실패 에러를 발생해야 한다.
 * user 객체의 속성 password의 길이가 6미만이면 인증 실패 에러를 발생해야 한다.
 */

/**
 * 2. 서버와 통신
 * 인증 실패 응답을 받으면 인증 실패 에러를 발생해야 한다.
 */

/**
 * 3. UI
 * id가 user-message인 태그의 textContent가 user.name과 일치해야 한다.
 */

/**
 * 책에 적힌 내용
 * user가 null이면 에러를 낸다.
 * null인 user는 서버로 전송하지 않는다.
 * user가 undefined이면 에러를 낸다.
 * undefined인 user는 서버로 전송하지 않는다.
 * user의 name 프로퍼티가 빈 상태면 에러를 낸다.
 * name 프로퍼티가 빈 user는 서버로 전송핮디 않는다.
 * user의 name 프로퍼티가 비어 있으면 UI를 업데이트하지 않는다.
 */

/**
 * 에러가 나는지 확인하는 테스트가 있는데 서버로 전송되지 않는다, UI를 업데이트하지 않는다와 같은 테스트가 왜 필요한가?
 * 아래와 같은 변경사항이 발생하면 Error 객체 생성 확인 테스트는 통과하지만 해당 함수는 깨진 코드가 되어 버림
 *
 */

Users.registrationUpdated = function () {
  return {
    validateAndRegisterUser: function validateAndDisplayUser(user) {
      fetch('http://yourapplication.com/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      document.getElementById('user-message').textContent = `가입해주셔서 감사합니다, ${user.name}님`;

      if (!user || user.name === '' || user.password === '' || user.password.length < 6) {
        throw new Error('사용자 인증이 실패했습니다.');
      }
    },
  };
};

/**
 * 관심사 분리
 * user 검증, 등록, 화면표시 담당 개별 객체 인스턴스를 의존성 주입으로 제공
 */

Users.registrationUpgraded = function (userValidator, userRegister, userDisplay) {
  return {
    validateAndRegisterUser: function validateAndDisplayUser(user) {
      if (!userValidator.userIsValid(user)) {
        throw new Error('사용자 인증이 실패했습니다.');
      }
      userRegister.registerUser(user);
      userDisplay.showRegisterThankYou(user);
    },
  };
};

/**
 * user가 잘못 넘어오면 에러가 난다.
 * 잘못된 user는 등록하지 않는다.
 * 잘못된 user는 표시하지 않는다.
 * 올바른 user를 인자로 userRegister.registerUser 함수를 실행한다.
 * userRegister.registerUser에서 에러가 나면 userDisplay.showRegistrationThankYou함수는 실행하지 않는다.
 * user가 성공적으로 등록되면 user를 인자로 userDisplay.showRegistrationThankYou 함수를 실행한다.
 */
