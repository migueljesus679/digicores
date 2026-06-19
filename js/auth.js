// =============================================
// Grafica Comercial - Authentication
// =============================================

const DigiAuth = (() => {
  const SESSION_KEY = 'digicores_session';
  const TOKEN_KEY   = 'digicores_admin_token';

  async function login(username, password) {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Credenciais inválidas.' };

      const session = { username, name: data.name, role: 'admin', loginAt: new Date().toISOString() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(TOKEN_KEY, data.token);
      return { success: true, user: session };
    } catch {
      return { success: false, error: 'Erro de ligação ao servidor.' };
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '../admin/login.html';
  }

  function getSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  function isAdmin() {
    const session = getSession();
    return !!(session && session.role === 'admin' && localStorage.getItem(TOKEN_KEY));
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
