import React from 'react';
import type { AgentId } from '../types';
import { Moon, Laptop } from 'lucide-react';

interface HeaderProps {
  activeAgent: AgentId;
  onSelectAgent: (id: AgentId) => void;
  agentOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeAgent,
  onSelectAgent,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0B0F17] border-b border-[#1E2533] px-4">
      <div className="flex items-center justify-between max-w-md mx-auto h-14">
        {/* Title / Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-semibold text-white tracking-tight">
              {activeAgent === 'delta' ? 'Delta' : 'Nazza'}
            </span>
            <span className="text-xs text-[#94A3B8] font-mono">
              {activeAgent === 'delta' ? 'Termux' : 'ThinkPad'}
            </span>
          </div>

          {/* Minimal Agent Toggle Switch */}
          <div className="flex bg-[#141C2D] p-0.5 rounded-lg border border-white/5 ml-2">
            <button
              onClick={() => onSelectAgent('delta')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all ${
                activeAgent === 'delta'
                  ? 'bg-[#232F48] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Delta
            </button>
            <button
              onClick={() => onSelectAgent('nazza')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all ${
                activeAgent === 'nazza'
                  ? 'bg-[#232F48] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Nazza
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#141C2D] border border-white/5 flex items-center justify-center text-gray-300">
            <Laptop size={15} />
          </div>

          <div className="w-8 h-8 rounded-lg bg-[#141C2D] border border-white/5 flex items-center justify-center text-gray-300">
            <Moon size={15} />
          </div>
        </div>
      </div>
    </header>
  );
};
