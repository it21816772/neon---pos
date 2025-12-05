import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../api/auth';
import { useSessionStore } from '../store/sessionStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);
  const { mutateAsync: login, isPending } = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
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

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Access</p>
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
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-2xl border border-neon-cyan/60 bg-neon-cyan/20 py-3 font-semibold text-white shadow-glow transition hover:bg-neon-cyan/30 disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? 'Authenticating…' : 'Enter Terminal'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

