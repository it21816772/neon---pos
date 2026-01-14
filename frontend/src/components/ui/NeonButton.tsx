import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const neonButton = cva(
  'inline-flex items-center gap-2 rounded-2xl border font-semibold uppercase tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight',
  {
    variants: {
      variant: {
        cyan: 'border-neon-cyan/40 bg-neon-cyan/10 text-white hover:bg-neon-cyan/20 shadow-glow',
        purple: 'border-neon-purple/40 bg-neon-purple/10 text-white hover:bg-neon-purple/20 shadow-glow-purple',
        ghost: 'border-white/20 bg-transparent text-white hover:border-white/40',
      },
      density: {
        compact: 'px-4 py-2 text-sm',
        spacious: 'px-5 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'cyan',
      density: 'compact',
    },
  },
);

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof neonButton> {
  // Allow a wider range of icon component shapes (some icon libraries export
  // forwardRef components with different prop types). Use a permissive any
  // type here to avoid brittle type mismatches.
  icon?: React.ComponentType<any>;
  asChild?: boolean;
}

export const NeonButton = ({ icon: Icon, className, variant, density, children, ...props }: NeonButtonProps) => (
  <button className={clsx(neonButton({ variant, density }), className)} {...props}>
    {Icon && <Icon size={16} className="text-neon-cyan" />}
    {children}
  </button>
);

