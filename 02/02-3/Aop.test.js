import { Aop } from './Aop.js';
describe('Aop', () => {
  let argPassingAdvice, // 타깃에 인자를 전잘할 어드바이스
    argsToTarget, // targetObj.targetFn에 전달할 인자들
    targetObj,
    executionPoints, // 실행 이벤트가 담긴 배열
    targetFnReturn = 'targetFnReturn';

  const Target = function () {
    const self = this;
    this.targetFn = function () {
      expect(this).toBe(self);
    };
  };

  beforeEach(() => {
    targetObj = {
      targetFn: function () {
        executionPoints.push('targetFn');
        argsToTarget = Array.prototype.slice.call(arguments, 0);
        return targetFnReturn;
      },
    };
    executionPoints = [];
    argPassingAdvice = function (targetInfo) {
      return targetInfo.fn.apply(this, targetInfo.args);
    };
    argsToTarget = [];
  });
  describe('Aop.around(fnName,advice,targetObj)', () => {
    it('타깃 함수를 호출 시 어드바이스를 실행하도록 한다.', () => {
      targetObj = {
        targetFn: function () {},
      };

      let executedAdvice = false;

      const advice = function () {
        executedAdvice = true;
      };

      Aop.around('targetFn', advice, targetObj);
      targetObj.targetFn();
      expect(executedAdvice).toBe(true);
    });

    it('어드바이스가 타깃 호출을 래핑한다', () => {
      const wrappingAdivce = function (targetInfo) {
        executionPoints.push('wrappingAdivce - 처음');
        targetInfo.fn();
        executionPoints.push('wrappingAdvice - 끝');
      };

      Aop.around('targetFn', wrappingAdivce, targetObj);
      targetObj.targetFn();
      expect(executionPoints).toEqual(['wrappingAdivce - 처음', 'targetFn', 'wrappingAdvice - 끝']);
    });
    it('마지막 어드바이스가 기존 어드바이스에 대해 실행되는 방식으로 체이닝할 수 있다.', () => {
      const adviceFactory = function (adviceId) {
        return function (targetInfo) {
          executionPoints.push(`wrappingAdivce - 처음 ${adviceId}`);
          targetInfo.fn();
          executionPoints.push(`wrappingAdivce - 끝 ${adviceId}`);
        };
      };
      Aop.around('targetFn', adviceFactory('안쪽'), targetObj);
      Aop.around('targetFn', adviceFactory('바깥쪽'), targetObj);
      targetObj.targetFn();
      expect(executionPoints).toEqual([
        'wrappingAdivce - 처음 바깥쪽',
        'wrappingAdivce - 처음 안쪽',
        'targetFn',
        'wrappingAdivce - 끝 안쪽',
        'wrappingAdivce - 끝 바깥쪽',
      ]);
    });

    it('어드바이스에서 타깃으로 일반 인자를 넘길 수 있다', () => {
      Aop.around('targetFn', argPassingAdvice, targetObj);
      targetObj.targetFn('a', 'b');
      expect(argsToTarget).toEqual(['a', 'b']);
    });

    it('타깃의 반환값도 어드바이스에서 참조할 수 있다', () => {
      Aop.around('targetFn', argPassingAdvice, targetObj);
      const returnedValue = targetObj.targetFn();
      expect(returnedValue).toBe(targetFnReturn);
    });

    it('타깃 함수를 해당 객체의 콘텍스트에서 실행한다', () => {
      const targetInstance = new Target();
      const sypOnInstance = jest.spyOn(targetInstance, 'targetFn');
      Aop.around('targetFn', argPassingAdvice, targetInstance);
      targetInstance.targetFn();
      expect(sypOnInstance).toHaveBeenCalled();
    });
  });

  describe('Aop.next(context,targetInfo)', () => {
    const advice = function (targetInfo) {
      return Aop.next.call(this, targetInfo);
    };
    let originalFn;
    beforeEach(() => {
      originalFn = targetObj.targetFn;
      Aop.around('targetFn', advice, targetObj);
    });

    it('targetInfo.fn에 있는 함수를 호출한다.', () => {
      targetObj.targetFn();
      expect(executionPoints).toEqual(['targetFn']);
    });

    it('targetInfo.args에 인자를 전달한다.', () => {
      targetObj.targetFn('a', 'b');
      expect(argsToTarget).toEqual(['a', 'b']);
    });

    it('targetInfo 함수에서 받은 값을 반환한다', () => {
      const ret = targetObj.targetFn();
      expect(ret).toEqual(targetFnReturn);
    });

    it('주어진 콘텍스트에서 타깃 함수를 실행한다.', () => {
      const targetInstance = new Target();
      const sypOnInstance = jest.spyOn(targetInstance, 'targetFn');
      Aop.around('targetFn', advice, targetInstance);
      targetInstance.targetFn();
      expect(sypOnInstance).toHaveBeenCalled();
    });
  });
});
