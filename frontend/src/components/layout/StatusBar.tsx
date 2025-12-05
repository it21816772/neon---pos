import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideSettings, LucidePrinter, LucideLogOut } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { usePrintersQuery } from '../../api/printers';
import { NeonButton } from '../ui/NeonButton';

export const StatusBar = () => {
  const location = useLocation();
  const { data: printers } = usePrintersQuery();
  const user = useSessionStore((state) => state.user);
  const selectedPrinterId = useSessionStore((state) => state.selectedPrinterId);
  const setPrinter = useSessionStore((state) => state.setPrinter);
  const clearSession = useSessionStore((state) => state.clearSession);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1_000);
    return () => clearInterval(interval);
  }, []);

  const selectedPrinter = printers?.find((printer) => printer.id === selectedPrinterId) ?? printers?.[0];

  useEffect(() => {
    if (!selectedPrinterId && printers && printers.length > 0) {
      setPrinter(printers[0].id);
    }
  }, [printers, selectedPrinterId, setPrinter]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-midnight/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Neon POS</p>
          <p className="text-lg font-semibold text-neon-cyan">
            {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center gap-3 text-sm text-white/70">
          <span>{location.pathname === '/settings' ? 'Settings' : 'POS Terminal'}</span>
          <span className="h-1 w-1 rounded-full bg-neon-cyan shadow-glow" />
          <span>{user ? `${user.name ?? 'Cashier'} · ${user.role}` : 'Guest'}</span>
          {selectedPrinter && (
            <>
              <span className="h-1 w-1 rounded-full bg-neon-purple shadow-glow-purple" />
              <span className="flex items-center gap-1">
                <LucidePrinter size={16} />
                {selectedPrinter.name}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="glass-panel rounded-xl border border-white/10 px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
            value={selectedPrinter?.id}
            onChange={(event) => setPrinter(event.target.value)}
          >
            {printers?.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.name}
              </option>
            ))}
          </select>
          <Link to="/settings">
            <NeonButton icon={LucideSettings} variant={location.pathname === '/settings' ? 'purple' : 'cyan'}>
              Settings
            </NeonButton>
          </Link>
          {user ? (
            <NeonButton icon={LucideLogOut} variant="ghost" onClick={clearSession}>
              Logout
            </NeonButton>
          ) : (
            <Link to="/login">
              <NeonButton variant="ghost">Login</NeonButton>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

