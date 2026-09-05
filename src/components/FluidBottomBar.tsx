import React from 'react';
import { Terminal, FileText, Clock, Settings } from 'lucide-react';

interface FluidBottomBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

const TABS = [
  { id: 'chat', label: 'Chat', icon: Terminal },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const FluidBottomBar: React.FC<FluidBottomBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const pillWidthPercent = 100 / TABS.length;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-4">
      <div className="pointer-events-auto mx-auto max-w-md px-4">
        {/* Floating Dock container persis Delta Mobile */}
        <nav className="relative flex items-center h-14 bg-[#101726] border border-[#1E2533] rounded-2xl shadow-2xl overflow-hidden px-1">
          {/* Active Pill Indicator Animasi */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-xl bg-[#1C2538] transition-all duration-200 ease-out pointer-events-none"
            style={{
              width: `calc(${pillWidthPercent}% - 6px)`,
              left: `calc(${activeIndex * pillWidthPercent}% + 3px)`,
            }}
          />

          {/* Tab buttons */}
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isFocused = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex-1 flex flex-col items-center justify-center h-full transition-colors ${
                  isFocused ? 'text-white' : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                <Icon size={18} strokeWidth={isFocused ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium tracking-tight mt-1">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
