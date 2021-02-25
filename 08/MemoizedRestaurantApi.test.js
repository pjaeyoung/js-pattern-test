import { ThirdParty } from '../07/ThirdPartyRestaurantApi';
import { Conference } from './MemoizedRestaurantApi';

describe('memoizedRestaurantApi', () => {
  let api, service, returnedFromService;

  beforeEach(() => {
    api = ThirdParty.restaurantApi();
    service = Conference.memoizedRestaurantApi(api);
    returnedFromService = {};
  });

  describe('getRestaurantsNearConference(cuisine)', () => {
    it('기대 인자를 넘겨 api의 getRestaurantsNearConference를 실행', () => {
      const cuisine = '분식';
      jest.spyOn(api, 'getRestaurantsNearConference');
      service.getRestaurantsNearConference(cuisine);
      expect(api.getRestaurantsNearConference).toHaveBeenCalledWith(cuisine);
    });

    it('서드파티 API의 반환값을 반환한다.', () => {
      jest.spyOn(api, 'getRestaurantsNearConference').mockReturnValue(returnedFromService);
      const value = service.getRestaurantsNearConference('Asian Fusion');
      expect(value).toBe(returnedFromService);
    });

    it('같은 요리를 여러 번 요청해도 api는 한 번만 요청한다', () => {
      const cuisine = '분식';

      jest.spyOn(api, 'getRestaurantsNearConference');

      let iterations = 5;

      while (iterations--) {
        service.getRestaurantsNearConference(cuisine);
      }

      expect(api.getRestaurantsNearConference).toHaveBeenCalledTimes(1);
    });

    it('같은 요리를 여러 번 요청해도 같은 값으로 귀결한다.', () => {
      const cuisine = '한정식';

      jest.spyOn(api, 'getRestaurantsNearConference').mockReturnValue(returnedFromService);

      let iterations = 5;

      while (iterations--) {
        const value = service.getRestaurantsNearConference(cuisine);
        expect(value).toBe(returnedFromService);
      }
    });
  });
});
