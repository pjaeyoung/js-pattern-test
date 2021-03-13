const Conference = {};

Conference.transportScheduler = function (auditService, transportConpanyFactory) {
  if (!auditService) {
    throw new Error(Conference.transportScheduler.messages.noAuditService);
  }

  if (!transportConpanyFactory) {
    throw new Error(Conference.transportScheduler.messages.transportConpanyFactory);
  }

  return {
    scheduleTransportation(transportDetails) {
      if (!transportDetails) {
        throw new Error(Conference.transportScheduler.messages.noDetail);
      }

      const company = transportConpanyFactory.create(transportDetails);
      return company.schedulePickup(transportDetails).then(function onSuccess(confirmation) {
        auditService.logReservation(transportDetails, confirmation);
        return confirmation;
      });
    },
  };
};

Conference.transportScheduler.messages = {
  noAuditService: '집계 서비스 인스턴스는 필수입니다.',
  noCompanyFactory: '운수회사 팩토리 인스턴스는 필수입니다.',
  noDetail: 'transportDetails 인스턴스는 필수입니다.',
};
