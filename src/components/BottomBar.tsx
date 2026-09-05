import React from 'react';
import type { AgentId } from '../types';
import { MessageSquare, Activity, CheckSquare, Settings } from 'lucide-react';

interface BottomBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  activeAgent: AgentId;
}

export const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onSelectTab, activeAgent }) => {
  const accentColor = activeAgent === 'delta' ? 'text-[#00F59B]' : 'text-[#00E5FF]';

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'activity', label: 'Aktivitas', icon: Activity },
    { id: 'tasks', label: 'Tugas', icon: CheckSquare },
    { id: 'settings', label: 'Setelan', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom,16px)]">
      <div className="pointer-events-auto mx-auto max-w-sm px-4 pb-2">
        {/* iOS Clean Glass Dock */}
        <nav className="flex items-center justify-around py-2 px-1 bg-[#101726]/85 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 ${
                  isActive ? accentColor : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className="transition-transform duration-150"
                />
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
