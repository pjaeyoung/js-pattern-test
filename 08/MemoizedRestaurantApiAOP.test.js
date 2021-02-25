import Aop from '../util/aop';
import { Aspects } from './MemoizedRestaurantApiAOP';

describe('returnValueCache', () => {
  let testObject, testValue, args, spyReference, testFunctionExecutionCount;

  beforeEach(() => {
    // 테스트할 때마다 실행 횟수 초기화
    testFunctionExecutionCount = 0;
    testValue = {};
    testObject = {
      testFunction: function () {
        return testValue;
      },
    };
    // 애스팩트가 적용된 이후에는 스파이를 직접 참조할 수 없으므로 현재 참조값 보관
    spyReference = jest.spyOn(testObject, 'testFunction');

    // testObject.testFunction을 returnCache 애스팩트로 장식
    Aop.around('testFunction', Aspects.returnValueCache().advice, [testObject]);
    args = [{ key: 'value' }, 'someValue'];
  });

  describe('advice(targetInfo)', () => {
    it('첫 번째 실행 시 장식된 함수의 반환값을 반환한다.', () => {
      const value = testObject.testFunction.apply(testObject, args);
      expect(value).toBe(testValue);
    });

    it('여러 번 실행 시 장식된 함수의 반환값을 반환한다.', () => {
      let iterations = 3;
      while (iterations--) {
        const value = testObject.testFunction.apply(testObject, args);
        expect(value).toBe(testValue);
      }
    });

    it('같은 키값으로 여러 번 실행해도 장식된 함수만 실행한다.', () => {
      let iterations = 3;
      while (iterations--) {
        const value = testObject.testFunction.apply(testObject, args);
        expect(value).toBe(testValue);
      }
      expect(spyReference).toHaveBeenCalledTimes(1);
    });

    it('고유한 각 키값마다 꼭 한 번씩 장식된 함수를 실행한다', () => {
      const keyValues = ['value1', 'value2', 'value3'];

      keyValues.forEach((arg) => {
        testObject.testFunction(arg);
      });

      keyValues.forEach((arg) => {
        testObject.testFunction(arg);
      });

      expect(spyReference).toHaveBeenCalledTimes(keyValues.length);
    });
  });
});
