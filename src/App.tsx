import React, { useState, useEffect, useRef } from 'react';
import type { AgentId, MessageItem, ChatThread } from './types';
import {
  Search,
  MoreVertical,
  Pin,
  MessageCircle,
  Settings,
  User,
  ArrowLeft,
  ArrowUp,
  Phone,
  CheckCheck,
} from 'lucide-react';
import { sendLiveChatMessage } from './api';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'obrolan' | 'pengaturan' | 'profil'>('obrolan');
  const [folderTab, setFolderTab] = useState<'agent' | 'all'>('agent');
  const [activeChat, setActiveChat] = useState<AgentId | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Threads State
  const [threads, setThreads] = useState<Record<AgentId, ChatThread>>({
    delta: {
      id: 'delta',
      name: 'Delta',
      avatar: '/delta_avatar.png',
      role: 'Logika & Analisis',
      device: 'Motorola moto g45 5G (Termux)',
      lastMessage: 'beres naxxx! menu/halaman Router udah aku hapus...',
      lastTime: '19:55',
      pinned: true,
      unreadCount: 0,
      online: true,
    },
    nazza: {
      id: 'nazza',
      name: 'Nazza',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      role: 'Eksekutor Laptop',
      device: 'ThinkPad (Windows 11)',
      lastMessage: 'udah aku bikinin sistem drop shadow + elevation bor...',
      lastTime: '19:56',
      pinned: false,
      unreadCount: 0,
      online: true,
    },
  });

  // Messages State
  const [chatMessages, setChatMessages] = useState<Record<AgentId, MessageItem[]>>({
    delta: [
      {
        id: 'd1',
        sender: 'agent',
        text: 'beres naxxx! menu/halaman Router udah aku hapus...',
        time: '19:55',
      },
    ],
    nazza: [
      {
        id: 'n1',
        sender: 'agent',
        text: 'udah aku bikinin sistem drop shadow + elevation bor. siap dieksekusi lagi di laptop.',
        time: '19:56',
      },
    ],
  });

  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeChat, isGenerating]);

  // Send Message Logic
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChat || isGenerating) return;

    const currentText = inputText.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: MessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentText,
      time: timeNow,
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg],
    }));

    setThreads((prev) => ({
      ...prev,
      [activeChat]: {
        ...prev[activeChat],
        lastMessage: currentText,
        lastTime: timeNow,
      },
    }));

    setInputText('');
    setIsGenerating(true);

    try {
      const history = (chatMessages[activeChat] || []).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const reply = await sendLiveChatMessage(currentText, activeChat, history);

      const replyMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), replyMsg],
      }));

      setThreads((prev) => ({
        ...prev,
        [activeChat]: {
          ...prev[activeChat],
          lastMessage: reply,
          lastTime: replyMsg.time,
        },
      }));
    } catch (_) {
      const errorMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: activeChat === 'delta' ? 'duh error naxxx, coba lagi bentar yaaa' : 'Koneksi error.',
        time: timeNow,
      };
      setChatMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), errorMsg],
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // -------------------------------------------------------------
  // VIEW: ROOM CHAT AKTIF
  // -------------------------------------------------------------
  if (activeChat) {
    const thread = threads[activeChat];
    const msgs = chatMessages[activeChat] || [];

    return (
      <div className="flex flex-col h-[100dvh] w-full bg-[#0B0F17] text-white">
        {/* Chat Header */}
        <header className="fixed top-0 inset-x-0 z-50 h-14 bg-[#0F141C] border-b border-white/[0.08] px-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveChat(null)}
              className="p-1.5 -ml-1 text-gray-300 hover:text-white active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="relative">
              <img
                src={thread.avatar}
                alt={thread.name}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0F141C]" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-white leading-tight">
                {thread.name}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                {activeChat === 'delta' ? 'Termux (Online)' : 'ThinkPad (Online)'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-300 hover:text-white">
              <Phone size={18} />
            </button>
            <button className="p-2 text-gray-300 hover:text-white">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        {/* Message Container */}
        <main className="flex-1 overflow-y-auto touch-scroll px-3 pt-16 pb-24 space-y-3">
          {msgs.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed select-text shadow-sm ${
                    isUser
                      ? 'bg-[#2B5278] text-white rounded-br-sm'
                      : 'bg-[#182533] text-gray-100 rounded-bl-sm border border-white/[0.06]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-white/50">
                    <span>{m.time}</span>
                    {isUser && <CheckCheck size={13} className="text-[#00E5FF]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#182533] rounded-xl border border-white/5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-300 font-mono">mengetik...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        {/* Chat Input Telegram Style */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0F141C] border-t border-white/[0.08] px-3 py-2 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              activeChat === 'delta'
                ? 'Tulis pesan ke Delta...'
                : 'Kirim tugas ke Nazza...'
            }
            className="flex-1 bg-[#182533] text-white text-xs px-3.5 py-2.5 rounded-full placeholder-gray-400 focus:outline-none border border-white/[0.04]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isGenerating}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              inputText.trim()
                ? 'bg-[#2B5278] text-white shadow active:scale-95'
                : 'bg-[#182533] text-gray-500'
            }`}
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: UTAMA NAXX WORKSTATION (DAFTAR CHAT / KONTAK / PENGATURAN)
  // -------------------------------------------------------------
  const threadList = Object.values(threads).filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#000000] text-white overflow-hidden select-none">
      {/* 1. Header: Naxx Workstation + Search + Action */}
      <header className="px-4 pt-3 pb-2 bg-[#000000] flex items-center justify-between">
        {isSearching ? (
          <div className="flex-1 flex items-center gap-2 bg-[#17212B] px-3 py-1.5 rounded-xl">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari agen atau pesan..."
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Batal
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-[22px] font-bold text-white tracking-tight">
              Naxx Workstation
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearching(true)}
                className="p-1.5 text-gray-300 hover:text-white rounded-full active:bg-white/10"
              >
                <Search size={21} strokeWidth={2} />
              </button>
              <button className="p-1.5 text-gray-300 hover:text-white rounded-full active:bg-white/10">
                <MoreVertical size={21} strokeWidth={2} />
              </button>
            </div>
          </>
        )}
      </header>

      {/* 2. Folder Tabs Segmented Control (Agent vs Semua Obrolan) */}
      <div className="px-4 py-2 bg-[#000000]">
        <div className="flex bg-[#121B26] p-1 rounded-2xl w-fit border border-white/5">
          <button
            onClick={() => setFolderTab('agent')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              folderTab === 'agent'
                ? 'bg-[#1D2E42] text-[#40A7E3] shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Agent
          </button>
          <button
            onClick={() => setFolderTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              folderTab === 'all'
                ? 'bg-[#1D2E42] text-[#40A7E3] shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Semua Obrolan
          </button>
        </div>
      </div>

      {/* 3. Main Content Per Tab Bawah */}
      <main className="flex-1 overflow-y-auto touch-scroll pb-24">
        {activeTab === 'obrolan' && (
          <div className="divide-y divide-white/[0.04]">
            {threadList.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveChat(thread.id)}
                className="flex items-center gap-3.5 px-4 py-3 cursor-pointer hover:bg-white/[0.02] active:bg-white/[0.05] transition-colors"
              >
                {/* Avatar with Story / Status Badge */}
                <div className="relative flex-shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-13 h-13 rounded-full object-cover border border-white/10"
                    style={{ width: '52px', height: '52px' }}
                  />
                  {/* Status Badge 1h mirip di screenshot */}
                  <div className="absolute -bottom-1 -right-1 bg-[#1A3B5C] border-2 border-black text-[#40A7E3] text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shadow">
                    <span>▲</span>
                    <span>1h</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-bold text-white truncate">
                        {thread.name}
                      </span>
                      <span className="text-[10px] text-gray-400 bg-[#16202C] px-1.5 py-0.5 rounded font-mono">
                        {thread.id === 'delta' ? 'HP' : 'Laptop'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      {thread.pinned && (
                        <Pin size={13} className="text-gray-400 rotate-45" />
                      )}
                      <span className="font-mono text-[11px]">{thread.lastTime}</span>
                    </div>
                  </div>

                  <p className="text-[13px] text-gray-400 truncate mt-0.5 leading-snug">
                    {thread.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Pengaturan */}
        {activeTab === 'pengaturan' && (
          <div className="p-4 space-y-3">
            <h2 className="text-sm font-semibold text-gray-300">Pengaturan Workstation</h2>
            <div className="bg-[#121B26] p-4 rounded-2xl space-y-3 border border-white/5 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-gray-300">Gateway Backend</span>
                <span className="font-mono text-emerald-400">9Router :20128</span>
              </div>
              <div className="flex justify-between py-1 border-t border-white/5">
                <span className="text-gray-300">Target Perangkat</span>
                <span className="font-mono text-gray-400">Local PRoot + Tunnel</span>
              </div>
              <div className="flex justify-between py-1 border-t border-white/5">
                <span className="text-gray-300">Versi UI</span>
                <span className="font-mono text-gray-400">Naxx Telegram Edition v3.0</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Profil */}
        {activeTab === 'profil' && (
          <div className="p-4 space-y-3">
            <div className="bg-[#121B26] p-4 rounded-2xl flex items-center gap-3 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-[#1D2E42] flex items-center justify-center text-[#40A7E3] font-bold text-lg">
                NX
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Naxx</h2>
                <p className="text-xs text-gray-400">Owner & Lead Developer</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. Floating Bottom Bar (Persis Screenshot Telegram) */}
      <div className="fixed bottom-3 inset-x-0 z-50 pointer-events-none px-4">
        <nav className="pointer-events-auto max-w-xs mx-auto flex items-center justify-around py-1.5 px-3 bg-[#121B26]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          {/* 1. Obrolan */}
          <button
            onClick={() => setActiveTab('obrolan')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all ${
              activeTab === 'obrolan'
                ? 'bg-[#1D2E42] text-[#40A7E3]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageCircle size={20} fill={activeTab === 'obrolan' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-medium mt-0.5">Obrolan</span>
          </button>

          {/* 2. Pengaturan */}
          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all ${
              activeTab === 'pengaturan'
                ? 'bg-[#1D2E42] text-[#40A7E3]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Settings size={20} />
            <span className="text-[10px] font-medium mt-0.5">Pengaturan</span>
          </button>

          {/* 3. Profil */}
          <button
            onClick={() => setActiveTab('profil')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all ${
              activeTab === 'profil'
                ? 'bg-[#1D2E42] text-[#40A7E3]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User size={20} />
            <span className="text-[10px] font-medium mt-0.5">Profil</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
