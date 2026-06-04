const ACCESS_KEY = 'journeyUnlocked';

export function useJourneyAccess() {
  const isUnlocked = () => sessionStorage.getItem(ACCESS_KEY) === 'true';

  const unlock = () => {
    sessionStorage.setItem(ACCESS_KEY, 'true');
  };

  const lock = () => {
    sessionStorage.removeItem(ACCESS_KEY);
  };

  return { isUnlocked, unlock, lock };
}
