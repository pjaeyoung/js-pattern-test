import Aop from '../util/aop';

const Aspects = {};

Aspects.returnValueCache = function () {
  const cache = {};

  return {
    advice: function (targetInfo) {
      const cacheKey = JSON.stringify(targetInfo.arguments);
      if (cache.hasOwnProperty(cacheKey)) {
        return cache[cacheKey];
      }

      const returnValue = Aop.next(targetInfo);
      cache[cacheKey] = returnValue;
      return returnValue;
    },
  };
};

export { Aspects };
