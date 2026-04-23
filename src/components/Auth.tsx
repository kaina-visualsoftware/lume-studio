import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@lume.com': {
    password: 'admin123',
    user: { id: '1', name: 'Marcos Vinícius', email: 'admin@lume.com', role: 'admin', avatar: 'MV' }
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const validUser = mockUsers[email.toLowerCase()];
    if (validUser && validUser.password === password) {
      setUser(validUser.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(validUser.user));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const styles = {
  loginPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090B' },
  loginCard: { width: '100%', maxWidth: 380, padding: 40, background: '#18181B', borderRadius: 16, border: '1px solid #27272A' },
  logo: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#FAFAFA', textAlign: 'center', marginBottom: 8 } as React.CSSProperties,
  logoSub: { fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#A78BFA', textAlign: 'center', letterSpacing: '2px', marginBottom: 32 } as React.CSSProperties,
  title: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: '#FAFAFA', marginBottom: 24 } as React.CSSProperties,
  field: { marginBottom: 16 } as React.CSSProperties,
  label: { fontSize: 13, fontWeight: 500, color: '#A1A1AA', marginBottom: 8, display: 'block' } as React.CSSProperties,
  input: { width: '100%', padding: '14px 16px', background: '#27272A', border: '1px solid #3F3F46', borderRadius: 8, fontSize: 14, color: '#FAFAFA', outline: 'none' } as React.CSSProperties,
  inputError: { borderColor: '#EF4444' } as React.CSSProperties,
  button: { width: '100%', padding: '14px', background: '#8B5CF6', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', marginTop: 8 } as React.CSSProperties,
  buttonDisabled: { background: '#3F3F46', color: '#71717A', cursor: 'not-allowed' } as React.CSSProperties,
  error: { fontSize: 12, color: '#EF4444', marginTop: 8 } as React.CSSProperties,
  hint: { fontSize: 12, color: '#71717A', marginTop: 24, textAlign: 'center' } as React.CSSProperties,
};

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@lume.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Email ou senha incorretos');
    }
    setLoading(false);
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginCard}>
        <div style={styles.logo}>LUME</div>
        <div style={styles.logoSub}>STUDIO</div>
        
        <h1 style={styles.title}>Entrar</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
              required
            />
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div style={styles.hint}>
          Use: admin@lume.com / admin123
        </div>
      </div>
    </div>
  );
};