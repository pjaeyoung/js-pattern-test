import { rj3 } from './rj3.js';

// 데이터가 배열인 경우
const arrayData = [
  [10, 130],
  [100, 60],
  [190, 160],
  [280, 10],
];

const lineGenerator = rj3.svg.line();
const path = lineGenerator(arrayData);

document.getElementById('pathFromArrays').setAttribute('d', path);

// 데이터가 객체인 경우
// 1. 데이터를 곧바로 변환
(function () {
  const objectData = [
    { x: 10, y: 130 },
    { x: 100, y: 60 },
    { x: 190, y: 160 },
    { x: 280, y: 10 },
  ];
  // 같은 데이터를 하나 더 복사하는 건 낭비
  const arrayData = objectData.map((point) => [point.x, point.y]);
  const lineGenerator = rj3.svg.line();
  const path = lineGenerator(arrayData);
  document.getElementById('pathFromArrays').setAttribute('d', path);
})();

// 2. line 함수 객체의 메서드 x, y 활용하기
(function () {
  const objectData = [
    { x: 10, y: 130 },
    { x: 100, y: 60 },
    { x: 190, y: 160 },
    { x: 280, y: 10 },
  ];

  const lineGenerator = rj3.svg.line();
  lineGenerator.x((point) => point.x).y((point) => point.y);
  const path = lineGenerator(objectData);
  document.getElementById('pathFromArrays').setAttribute('d', path);
})();

(function () {
  const yearlyPriceGrapher = {
    lineGenerator: rj3.svg.samples.functionBasedLine(),
    getValue: function getValue(year) {
      return 10 * Math.pow(1.8, year - 2010);
    },
  };

  const years = [2010, 2011, 2012, 2013, 2014, 2015];
  const path = yearlyPriceGrapher.lineGenerator(years);
  document.getElementById('pathFromArrays').setAttribute('d', path);
})();
