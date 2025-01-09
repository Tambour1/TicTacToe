import { jwtDecode } from 'jwt-decode';

function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

function removeToken() {
  localStorage.removeItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function getUserIdentity() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
}

export { isAuthenticated, removeToken, setToken, getUserIdentity };