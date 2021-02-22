function Marsupial(name, nocturnal) {
  if (!(this instanceof Marsupial)) {
    throw new Error('이 객체는 new를 사용하여 생성해야 합니다.');
  }
  this.name = name;
  this.isNocturnal = nocturnal;
}

Marsupial.prototype.isAwake = function (isNight) {
  return isNight === this.isNocturnal;
};
const maverick = new Marsupial('매버릭', true);
const slider = new Marsupial('슬라이더', false);

const isNight = true;

console.log(maverick.isAwake(isNight));
console.log(slider.isAwake(isNight));

// 객체들은 isAwake의 단일 인스턴스를 공유
console.log(maverick.isAwake === slider.isAwake);
