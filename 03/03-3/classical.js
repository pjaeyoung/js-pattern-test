function callByNewKeyword({ instance, obj }) {
  if (!(instance instanceof obj)) {
    throw new Error('이 객체는 new 키워드를 사용하여 생성해야 합니다.');
  }
}

function Marsupial(name, nocturnal) {
  callByNewKeyword({ instance: this, obj: this.__proto__.constructor });
  this._name = name;
  this.isNoctural = nocturnal;
}

Marsupial.prototype.isAwake = function (isNight) {
  return this.isNoctural === isNight;
};

function Kangaroo(name) {
  Marsupial.call(this, name, false);
}

Kangaroo.prototype = Object.create(Marsupial);
Kangaroo.prototype.constructor = Kangaroo;
Kangaroo.prototype.hop = function () {
  return `${this.name} 가 껑충 뛰었어요!`;
};

const jester = new Kangaroo('제스터');
console.log(jester);
