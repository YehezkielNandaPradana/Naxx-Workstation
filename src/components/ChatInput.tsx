import React, { useState } from 'react';
import { Send, Square, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop?: () => void;
  isGenerating?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  isGenerating = false,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isGenerating) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <div className="fixed bottom-[72px] inset-x-0 z-40 px-4">
      <div className="max-w-md mx-auto">
        <div className="relative flex items-center bg-[#101726] border border-[#1E2533] rounded-2xl shadow-xl px-3 py-2">
          {/* AI Model Badge Pill persis Delta Mobile */}
          <button className="flex items-center gap-1 bg-[#162032] border border-white/5 px-2 py-1 rounded-lg text-[11px] text-[#94A3B8] font-mono mr-2">
            <Sparkles size={12} className="text-[#00F59B]" />
            <span>Antigravity</span>
          </button>

          {/* Input field */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your prompt..."
            className="flex-1 bg-transparent text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
          />

          {/* Send / Stop Action Button */}
          {isGenerating ? (
            <button
              onClick={onStop}
              className="w-7 h-7 rounded-xl bg-[#E11D48] flex items-center justify-center text-white"
            >
              <Square size={13} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                text.trim()
                  ? 'bg-white text-black shadow-md active:scale-95'
                  : 'bg-[#162032] text-[#64748B]'
              }`}
            >
              <Send size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
