import { usePrintersQuery } from '../api/printers';
import { useSessionStore } from '../store/sessionStore';
import { useUIStore } from '../store/uiStore';
import { NeonButton } from '../components/ui/NeonButton';

const SettingsPage = () => {
  const { data: printers } = usePrintersQuery();
  const selectedPrinterId = useSessionStore((state) => state.selectedPrinterId);
  const setPrinter = useSessionStore((state) => state.setPrinter);
  const density = useUIStore((state) => state.density);
  const toggleDensity = useUIStore((state) => state.toggleDensity);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <section className="glass-panel rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Printers</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Connected Hardware</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {printers?.map((printer) => (
            <button
              key={printer.id}
              type="button"
              onClick={() => setPrinter(printer.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedPrinterId === printer.id
                  ? 'border-neon-cyan/60 bg-neon-cyan/10 shadow-glow'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <p className="text-lg font-semibold text-white">{printer.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">{printer.type}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Interface</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Cashier Experience</h2>
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 p-4 text-white/70">
          <div>
            <p className="font-semibold text-white">Density</p>
            <p className="text-sm text-white/50">Switch between compact or spacious layout</p>
          </div>
          <NeonButton variant="purple" onClick={toggleDensity}>
            {density === 'compact' ? 'Use Spacious' : 'Use Compact'}
          </NeonButton>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;

