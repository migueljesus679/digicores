// =============================================
// DigiCores - Authentication
// =============================================

const DigiAuth = (() => {
  const SESSION_KEY = 'digicores_session';

  const ADMIN_CREDENTIALS = [
    { username: 'admin', password: 'digicores2024', name: 'Administrador' },
    { username: 'gestor', password: 'gestor123', name: 'Gestor de Loja' }
  ];

  function login(username, password) {
    const user = ADMIN_CREDENTIALS.find(
      u => u.username === username && u.password === password
    );
    if (!user) return { success: false, error: 'Credenciais inválidas.' };

    const session = {
      username: user.username,
      name: user.name,
      role: 'admin',
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, user: session };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '../admin/login.html';
  }

  function getSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  function isAdmin() {
    const session = getSession();
    return session && session.role === 'admin';
  }

  function requireAdmin() {
    if (!isAdmin()) {
      window.location.href = '../admin/login.html';
      return false;
    }
    return true;
  }

  function requireAdminFromAdmin() {
    if (!isAdmin()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  return { login, logout, getSession, isAdmin, requireAdmin, requireAdminFromAdmin };
})();
