export default function attendeeProfileProxy(attendees, profileService, prefetchLimit) {
  const prefetched = {};

  async function prefetch(attendeeId) {
    prefetched[attendeeId] = await profileService.getProfile(attendeeId);
  }

  function byViews(attendeeA, attendeeB) {
    return attendeeB.profileViews - attendeeA.profileViews;
  }

  prefetchLimit = prefetchLimit > attendees.length ? attendees.length : prefetchLimit;

  attendees
    .sort(byViews)
    .slice(0, prefetchLimit)
    .forEach((attendee) => prefetch(attendee.id));

  return {
    async getProfile(attendeeId) {
      return prefetched[attendeeId] || (await profileService.profileService(attendeeId));
    },
  };
}
