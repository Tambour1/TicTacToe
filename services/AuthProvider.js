const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
}

const removeToken = () => {
  localStorage.removeItem('token');
}

const setToken = (token) => {
    localStorage.setItem('token', token);
}

const getUserIdentity = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
    }    
}

export { isAuthenticated, removeToken, setToken, getUserIdentity };