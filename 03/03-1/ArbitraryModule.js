// 해당 애플리케이션만 사용할 수 있는 모든 객체(모듈)를 담아 넣은
// 전역 객체를 선언하여 이름공간처럼 활용
const MyApp = {};

// 애플리케이션 이름공간에 속한 모듈
// 이 함수는 animalMaker라는 다른 함수에 의존하며 animalMaker는 주입 가능하다.
MyApp.wildlifePreserveSimulator = function (animalMaker) {
  // 프라이빗 변수
  const animals = [];

  // API 반환
  return {
    addAnimal: function (species, sex) {
      animals.push(animalMaker.make(species, sex));
    },
    getAnimalCount: function () {
      return animals.length;
    },
  };
};

const preserve = MyApp.wildlifePreserveSimulator(realAnimalMaker);
preserve.addAnimal('gorilla', 'female');
