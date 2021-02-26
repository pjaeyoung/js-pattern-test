const Conference = {};

Conference.Presentation = function (title, presenter) {
  if (!(this instanceof Conference.Presentation)) {
    throw new Error(Conference.Presentation.messages.mustUseNew);
  }

  if (!title) {
    throw new Error(Conference.Presentation.messages.titleRequired);
  }

  this.title = title;
  this.presenter = presenter;
};

Conference.Presentation.messages = {
  mustUseNew: 'Presentation은 반드시 "new"로 생성해야 합니다',
  titleRequired: 'title은 필수 입력 항목입니다.',
};

Conference.VendorPresentaion = function (title, presenter, vendor, product) {
  if (!(this instanceof Conference.VendorPresentaion)) {
    throw new Error(Conference.VendorPresentaion.messages.mustUseNew);
  }
  if (!vendor) {
    throw new Error(Conference.VendorPresentaion.messages.vendorRequired);
  }
  Conference.Presentation.call(this, title, presenter);
  this.vendor = vendor;
  this.product = product;
};

Conference.VendorPresentaion.prototype = Object.create(Conference.Presentation.prototype);

Conference.VendorPresentaion.messages = {
  mustUseNew: 'VenderPresentaion은 반드시 "new"로 생성해야 합니다',
  vendorRequired: 'vendor은 필수 입력 항목입니다.',
};

Conference.presentationFactory = function () {
  return {
    create: function (obj) {
      const baseProperties = ['title', 'presenter'];
      const vendorProperties = ['vendor', 'product'];
      const allProperties = [...baseProperties, ...vendorProperties];

      for (const p in obj) {
        if (!allProperties.includes(p)) {
          throw new Error(Conference.presentationFactory.messages.unexpectedProperty + p);
        }
      }

      for (const p in obj) {
        if (vendorProperties.includes(p)) {
          return new Conference.VendorPresentaion(...Object.values(obj));
        }
      }

      return new Conference.Presentation(...Object.values(obj));
    },
  };
};

Conference.presentationFactory.messages = {
  unexpectedProperty: '이상한 프로퍼티를 지닌 생성 파라미터가 있습니다.',
  mustUseNew: '',
};

export { Conference };

new Conference.VendorPresentaion('The title', undefined, 'The Vendor', 'The Product');
