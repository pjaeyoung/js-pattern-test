import Conference from './clickCountDisplay';

describe('Conference.clickCountDisplay', () => {
  let display, displayElement, clickElement;

  beforeEach(() => {
    displayElement = document.createElement('span');
    document.body.append(displayElement);

    clickElement = document.createElement('button');
    document.body.append(clickElement);

    const options = {
      updateElement: displayElement,
      triggerElement: clickElement,
    };

    display = Conference.clickCountDisplay(options);
  });

  afterEach(() => {
    displayElement.remove();
    clickElement.remove();
  });

  it('클릭 횟수를 0으로 초기화한다.', () => {
    expect(display.getClickCount()).toBe(0);
  });

  describe('incrementCountAndUpdateDisplay()', () => {
    it('클릭 횟수를 늘린다.', () => {
      const initialCount = display.getClickCount();
      display.incrementCountAndUpdateDisplay();
      expect(display.getClickCount()).toBe(initialCount + 1);
    });

    it('updateCountDisplay 함수를 실행한다', () => {
      jest.spyOn(display, 'updateCountDisplay');
      display.incrementCountAndUpdateDisplay();
      expect(display.updateCountDisplay).toHaveBeenCalled();
    });
    it('updateElement의 텍스트를 셋팅한다.', () => {
      display.incrementCountAndUpdateDisplay();
      expect(displayElement.textContent).toBe(`${display.getClickCount()}`);
      display.incrementCountAndUpdateDisplay();
      expect(displayElement.textContent).toBe(`${display.getClickCount()}`);
    });

    describe('updateCountDisplay()', () => {
      it('횟수를 한 번도 늘린 적 없으면 0이 표시된다.', () => {
        display.updateCountDisplay();
        expect(displayElement.textContent).toBe('0');
      });
    });
  });

  it('클릭 이벤트가 발생하면 incrementCountAndUpdateDisplay를 실행한다', () => {
    jest.spyOn(display, 'incrementCountAndUpdateDisplay');
    clickElement.click();
    expect(display.incrementCountAndUpdateDisplay).toHaveBeenCalled();
  });
});
