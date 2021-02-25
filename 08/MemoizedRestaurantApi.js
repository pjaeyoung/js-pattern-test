const Conference = {};

Conference.memoizedRestaurantApi = function (thirdPartyApi) {
  const api = thirdPartyApi;
  const cache = {};

  return {
    getRestaurantsNearConference: function (cuisine) {
      if (cache.hasOwnProperty(cuisine)) {
        return cache[cuisine];
      }

      const returnPromise = api.getRestaurantsNearConference(cuisine);
      cache[cuisine] = returnPromise;
      return returnPromise;
    },
  };
};

export { Conference };
