const Conference = {};

Conference.attendeeWebApiDecorator = function (baseWebApi) {
  const self = this;
  let pendingPosts = [];
  const messages = {
    postPending: '이 참가자에 대한 처리가 진행 중인 것 같습니다.',
  };

  return {
    getAll() {
      return baseWebApi.getAll().then((attendees) => {
        return [
          ...attendees,
          ...pendingPosts.filter((post) => !attendees.find((attendee) => attendee.getId() === post.getId())),
        ];
      });
    },
    post(attendee) {
      if (pendingPosts.includes(attendee)) {
        return Promise.reject(new Error(messages.postPending));
      }
      pendingPosts.push(attendee);
      return baseWebApi.post(attendee).then(
        function onPostSucceeded(attendeeWithId) {
          pendingPosts = pendingPosts.filter((post) => post.getId() !== attendeeWithId);
          return attendee;
        },
        function onPostFailed(reason) {
          pendingPosts = pendingPosts.filter((post) => post !== attendee);
          return Promise.reject(reason);
        },
      );
    },
    getMessages() {
      return messages;
    },
  };
};

export default Conference;
