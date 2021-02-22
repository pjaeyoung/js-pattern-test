const MyApp = {};

MyApp.Hand = function () {
  this.dataAboutHand = {};
};

MyApp.Hand.prototype.arrangeAndMove = function (sign) {
  this.dataAboutHand = '새로운 수화 동작';
};

MyApp.Human = function (handFactory) {
  this.hands = [handFactory(), handFactory()];
};

MyApp.Human.prototype.useSignLanguage = function (message) {
  const sign = {};
  this.hands.forEach((hand) => {
    hand.arrangeAndMove(hand);
  });

  return '손을 움직여 수화하고 있어. 무슨 말인지 알겠니?';
};

MyApp.Human.prototype.endowSigning = function (receivingObject) {
  if (typeof receivingObject.getHandCount === 'function' && receivingObject.getHandCount() >= 2) {
    receivingObject.useSignLanguage = this.useSignLanguage;
  } else {
    throw new Error('미안하지만 너에게 수화를 가르쳐줄 수는 없겠어');
  }
};

MyApp.Gorilla = function (handFactory) {
  this.hands = [handFactory(), handFactory()];
};

MyApp.Gorilla.prototype.getHandCount = function () {
  return this.hands.length;
};

MyApp.TeachSignLanguageKoKo = function () {
  const handFactory = function () {
    return new MyApp.Hand();
  };

  const trainer = new MyApp.Human(handFactory);
  const koko = new MyApp.Gorilla(handFactory);

  trainer.endowSigning(koko);
};
