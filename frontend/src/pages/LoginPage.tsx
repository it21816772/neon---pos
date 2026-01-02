import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLoginMutation, useRegisterMutation } from '../api/auth';
import { useSessionStore } from '../store/sessionStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);
  const { mutateAsync: login, isPending: loginPending } = useLoginMutation();
  const { mutateAsync: register, isPending: registerPending } = useRegisterMutation();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const data = await login({ email, password });
      setSession({ token: data.access_token, user: data.user });
      toast.success('Welcome back!');
      navigate('/pos');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const data = await register({ email: regEmail, password: regPassword, name });
      setSession({ token: data.access_token, user: data.user });
      toast.success('Account created — welcome!');
      navigate('/pos');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Access</p>
          <div className="space-x-2">
            <button
              onClick={() => setMode('login')}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${mode === 'login' ? 'bg-white/10 text-white' : 'text-white/50'}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('register')}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${mode === 'register' ? 'bg-white/10 text-white' : 'text-white/50'}`}
            >
              Sign up
            </button>
          </div>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="mt-4">
            <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to Neon POS</h1>
            <div className="mt-6 space-y-4">
              <label className="block text-sm text-white/60">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-neon-cyan focus:outline-none"
                  placeholder="cashier@neonpos.com"
                />
              </label>
              <label className="block text-sm text-white/60">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                  placeholder="••••••••"
                />
              </label>

              <div className="mt-2 text-sm text-white/50 flex items-center justify-between">
                <span>Demo: <strong className="text-white">admin@example.com</strong> / <strong className="text-white">password123</strong></span>
                <button type="button" onClick={() => { setEmail('admin@example.com'); setPassword('password123'); }} className="underline text-white/70">Fill demo</button>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-2xl border border-neon-cyan/60 bg-neon-cyan/20 py-3 font-semibold text-white shadow-glow transition hover:bg-neon-cyan/30 disabled:opacity-50"
              disabled={loginPending}
            >
              {loginPending ? 'Authenticating…' : 'Enter Terminal'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="mt-4">
            <h1 className="mt-2 text-3xl font-semibold text-white">Create an account</h1>
            <div className="mt-6 space-y-4">
              <label className="block text-sm text-white/60">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-neon-cyan focus:outline-none"
                  placeholder="Full name"
                />
              </label>
              <label className="block text-sm text-white/60">
                Email
                <input
                  type="email"
                  value={regEmail}
                  onChange={(event) => setRegEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-neon-cyan focus:outline-none"
                  placeholder="you@company.com"
                />
              </label>
              <label className="block text-sm text-white/60">
                Password
                <input
                  type="password"
                  value={regPassword}
                  onChange={(event) => setRegPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                  placeholder="Create a password (min 6 chars)"
                />
              </label>

              <div className="mt-2 text-sm text-white/50 flex items-center justify-between">
                <span>Quick sample</span>
                <button type="button" onClick={() => { const ts = Date.now().toString().slice(-4); setName('Test User'); setRegEmail(`test+${ts}@example.com`); setRegPassword('password123'); }} className="underline text-white/70">Fill sample</button>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-2xl border border-neon-cyan/60 bg-neon-cyan/20 py-3 font-semibold text-white shadow-glow transition hover:bg-neon-cyan/30 disabled:opacity-50"
              disabled={registerPending}
            >
              {registerPending ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

