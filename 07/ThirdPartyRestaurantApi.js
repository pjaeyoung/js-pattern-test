import Aop from '../util/aop.js';

const ThirdParty = {};

ThirdParty.restaurantApi = function () {
  return {
    // 주어진 주소(address) 기준 반경 radiusMiles 마일 이내에 위치한
    // 원하는 요리(cuisine)를 먹을 수 있는 음식점 배열을 반환하는 프라미스를 반환
    getRestaurantsWithinRadius: function (address, radiusMiles, cuisine) {
      // 프라미스는 다음과 같은 객체의 배열로 귀결된다.
      /**
       * {
       *    name:'대성각'
       *    address: '울산 남구 신정로 20번길 988'
       * }
       */
    },
  };
};

// address 인자는 콘퍼런스 행사장, '근처 음식점'은 3km 이내로 radiusMiles 값도 일정
Aop.around(
  'restaurantApi',
  function addGetRestaurantsNearConference(targetInfo) {
    //ThirdParty.restaurantApi()가 반환한 원본 api
    const api = Aop.next.call(this, targetInfo);
    //api에 추가할 함수
    function getRestaurantsNearConference(cuisine) {
      return api.getRestaurantsWithinRadius('울산 남구 신정로 20번길 988', 2.0, cuisine);
    }

    //없으면 이 함수를 추가한다
    api.getRestaurantsNearConference = api.getRestaurantsNearConference || getRestaurantsNearConference;

    return api;
  },
  [ThirdParty],
);

export { ThirdParty };
