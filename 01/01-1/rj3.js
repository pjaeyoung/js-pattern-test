const rj3 = {};

rj3.svg = {};

// 배열 데이터를 svg 경로로 변환하는 함수 (일급 객체인 함수를 반환)
rj3.svg.line = function () {
  // 클로저를 통해 함수 반환 이후에도 private 함수(getX, getY, interpolate) 접근해서 사용 가능
  let getX = function (point) {
    return point[0];
  };

  let getY = function (point) {
    return point[1];
  };

  const interpolate = function (points) {
    return points.join('L');
  };

  function line(data) {
    const segments = [];
    const points = [];
    let i = -1;
    const n = data.length;
    let d;

    function segment() {
      segments.push('M', interpolate(points));
    }

    while (++i < n) {
      d = data[i];
      // 두 번째 인자는 인덱스, 함수 오버로딩 개념 적용
      // 자바스크립트에서 this는 설계관점에서 절호의 기회
      points.push([+getX.call(this, d, i), +getY.call(this, d, i)]);
    }

    if (points.length) {
      segment();
    }

    return segments.length ? segments.join('') : null;
  }

  // 자바스크립트의 함수는 메서드와 프로퍼티를 가질 수 있다.
  line.x = function (funcToGetX) {
    if (!arguments.length) return getX;
    getX = funcToGetX;
    return line;
  };

  line.y = function (funcToGetY) {
    // 함수 오버로딩 개념 적용
    if (!arguments.length) return getY;
    getY = funcToGetY;
    return line;
  };

  return line;
};

rj3.svg.samples = {};

// 외부 객체에서 값을 얻게끔 라인 생성기 확장
rj3.svg.samples.functionBasedLine = function () {
  const firstXCoord = 10;
  const xDistanceBetweenPoints = 50;
  let lineGenerator;
  const svgHeight = 200;

  lineGenerator = rj3.svg
    .line()
    .x((d, i) => firstXCoord + i * xDistanceBetweenPoints)
    .y(function (d) {
      return svgHeight - this.getValue(d);
    });

  return lineGenerator;
};

export { rj3 };
