import { Conference } from './Presentation';

describe('presentationFactory', () => {
  const factory = Conference.presentationFactory();
  const baseParameter = {
    title: '자바스크립트를 멋지게 사용해보세요',
    presenter: '박길벗',
  };

  describe('create(objectLiteral)', () => {
    it('파라미터에 이상한 프로퍼티가 있으면 예외를 던진다', () => {
      const badProp = 'badProperty';
      function createWithUnexpectedProperties() {
        const badParam = {};
        badParam[badProp] = 'unexpected';
        factory.create(badParam);
      }
      expect(createWithUnexpectedProperties).toThrowError(
        Conference.presentationFactory.messages.unexpectedProperty + badProp,
      );
    });

    describe('기본 프로퍼티만 있을 경우', () => {
      const fakePresentation = { title: '프리젠테이션을 베끼는 방법' };
      let spyOnConstructor, returnedPresentation;

      beforeEach(() => {
        spyOnConstructor = jest.spyOn(Conference, 'Presentation').mockReturnValue(fakePresentation);
        returnedPresentation = factory.create(baseParameter);
      });

      afterEach(() => {
        spyOnConstructor.mockRestore();
      });

      it('모든 값을 Presentation 생성자에 넘긴다.', () => {
        expect(spyOnConstructor).toHaveBeenCalledWith(baseParameter.title, baseParameter.presenter);
      });

      it('Presentation 생성자를 딱 한 번만 호출한다', () => {
        expect(spyOnConstructor).toHaveBeenCalledTimes(1);
      });

      it('생성한 Presentation을 반환한다.', () => {
        expect(returnedPresentation).toBe(fakePresentation);
      });
    });
  });

  describe('VendorPresentation 프로퍼티가 적어도 하나 이상 있을 경우', () => {
    const vendorParameter = {
      title: '자바스크립트를 멋지게 사용해보세요',
      presenter: '박길벗',
      vendor: '길벗출판사',
      product: '자바스크립트 패턴과 테스트',
    };

    const fakeVendorPresentation = { title: vendorParameter.title };
    let spyOnConstructor;

    beforeEach(() => {
      spyOnConstructor = jest.spyOn(Conference, 'VendorPresentaion').mockReturnValue(fakeVendorPresentation);
    });

    afterEach(() => {
      spyOnConstructor.mockRestore();
    });

    it('VendorPresentation을 생성해본다.', () => {
      let expectedCallCount = 0;
      function createParam(propName) {
        const param = {};

        for (const p in baseParameter) {
          param[p] = baseParameter[p];
        }

        param[propName] = vendorParameter[propName];
        return param;
      }

      ['vendor', 'product'].forEach((propName) => {
        const param = createParam(propName);
        factory.create(param);
        expect(spyOnConstructor).toHaveBeenCalledTimes(++expectedCallCount);
      });
    });

    it('모든 값을 VendorPresentation 생성자에 넘긴다.', () => {
      factory.create(vendorParameter);
      expect(spyOnConstructor).toHaveBeenCalledWith(...Object.values(vendorParameter));
    });

    it('VendorPresentation 생성자를 딱 한 번만 호출한다.', () => {
      factory.create(vendorParameter);
      expect(spyOnConstructor).toHaveBeenCalledTimes(1);
    });

    it('생성한 VendorPresentation을 반환한다', () => {
      expect(factory.create(vendorParameter)).toBe(fakeVendorPresentation);
    });
  });
});
