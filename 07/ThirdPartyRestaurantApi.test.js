import { ThirdParty } from './ThirdPartyRestaurantApi';

describe('ThirdParty', () => {
  describe('ThirdParty.restaurantApi() 애스팩트', () => {
    const api = ThirdParty.restaurantApi();

    describe('getRestaurantsNearConference(cuisine)', () => {
      const returnFromUnderlyingFunction = '아무거나';
      const cuisine = '중화요리';

      beforeEach(() => {
        jest.spyOn(api, 'getRestaurantsWithinRadius').mockReturnValue(returnFromUnderlyingFunction);
      });

      it('올바른 인자로 getRestaurantsWithRadius를 호출한다.', () => {
        api.getRestaurantsNearConference(cuisine);
        expect(api.getRestaurantsWithinRadius).toHaveBeenCalledWith('울산 남구 신정로 20번길 988', 2.0, cuisine);
      });

      it('getRestaurantsWithinRadius로부터 받은 값을 반환한다.', () => {
        const ret = api.getRestaurantsNearConference(cuisine);
        expect(ret).toBe(returnFromUnderlyingFunction);
      });
    });
  });
});
