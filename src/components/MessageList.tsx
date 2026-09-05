import React from 'react';
import type { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isGenerating?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isGenerating }) => {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
          >
            {/* Header sender persis delta-mobile */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[#64748B]">
              {isUser ? (
                <>
                  <span>You</span>
                  <User size={12} />
                </>
              ) : (
                <>
                  <Bot size={12} className="text-[#00F59B]" />
                  <span>{msg.agentId === 'delta' ? 'Delta' : 'Nazza'}</span>
                </>
              )}
            </div>

            {/* Bubble persis Delta Mobile styling */}
            <div
              className={`max-w-[88%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed select-text ${
                isUser
                  ? 'bg-[#333842] text-white rounded-tr-sm shadow-md'
                  : 'bg-[#14171C] text-[#F8FAFC] border border-[#23272F] rounded-tl-sm shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>

            <span className="text-[10px] text-[#64748B] font-mono mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        );
      })}

      {isGenerating && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#14171C] border border-[#23272F] rounded-xl w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
          <span className="text-xs text-[#94A3B8] font-mono">Thinking...</span>
        </div>
      )}
    </div>
  );
};
