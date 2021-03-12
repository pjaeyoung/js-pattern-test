const Conference = {};

Conference.clickCountDisplay = function (options) {
  let clickCount = 0;

  const display = {
    getClickCount() {
      return clickCount;
    },
    incrementCountAndUpdateDisplay() {
      clickCount++;
      display.updateCountDisplay();
    },
    updateCountDisplay() {
      options.updateElement.textContent = `${display.getClickCount()}`;
    },
  };

  options.triggerElement.onclick = () => display.incrementCountAndUpdateDisplay();
  return display;
};

export default Conference;
