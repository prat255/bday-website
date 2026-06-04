const TOKEN_KEY = 'adminToken';
const USER_KEY = 'adminUser';

export function useAdminAuth() {
  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const isAuthenticated = () => Boolean(getToken());

  const login = (token, username) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, username);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const getUsername = () => localStorage.getItem(USER_KEY);

  return { getToken, isAuthenticated, login, logout, getUsername };
}
