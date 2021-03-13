export default function attendeeProfileService() {
  const messages = {
    httpFailure: 'HTTP 요청 실패',
  };

  return {
    getProfile(attendeeId) {
      return fetch('http://conference.com/profile').then(function onSuccess(res) {
        if (res.ok) {
          return Promise.resolve(res);
        } else {
          return Promise.reject(new Error(messages.httpFailure));
        }
      });
    },
  };
}
