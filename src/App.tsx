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
  ChevronDown,
  Menu,
  Smile,
  Paperclip,
  Mic,
  Send,
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
      role: 'Logika & Solusi',
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

  // Messages State persis screenshot
  const [chatMessages, setChatMessages] = useState<Record<AgentId, MessageItem[]>>({
    delta: [
      {
        id: 'd1',
        sender: 'agent',
        text: 'beres naxxx! menu/halaman Router udah aku hapus dari bilah bawah maupun halamannya. sekarang sisa Chat, Notes, History, sama Settings.',
        time: '19:55',
        msgId: 'ID 2954',
      },
    ],
    nazza: [
      {
        id: 'n1',
        sender: 'agent',
        text: `udah aku bikinin sistem drop shadow + elevation bor. sekarang setiap popup form (ModernAlert, DynamicFormEditor, dll) punya visual depth yang konsisten:

1. Double anti-aliased outline border (Slate-300)
2. Soft ambient floating shadow via UITheme.EnableFormDropShadow()
3. Bersih tanpa error pas dikompilasi`,
        time: '19:56',
        msgId: 'ID 2957',
      },
      {
        id: 'n2',
        sender: 'user',
        text: 'mana liat',
        time: '19:58',
        msgId: 'ID 2958',
      },
      {
        id: 'n3',
        sender: 'agent',
        text: '',
        time: '19:58',
        msgId: 'ID 2959',
        actions: [
          {
            type: 'reading',
            title: 'Reading',
            detail: 'ModernAlert.cs L100-149',
          },
          {
            type: 'editing',
            title: 'Editing',
            detail: 'C:\\Users\\ThinkPad\\repos\\Dashboard... (×5)',
            badge: '(×5)',
          },
          {
            type: 'terminal',
            title: 'Terminal',
            detail: 'Powershell',
            command: 'dotnet build C:/Users/ThinkPad/repos/Dashboard/src/Dashboard.sln',
          },
        ],
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
    const randomId = `ID ${Math.floor(2960 + Math.random() * 50)}`;

    const newMsg: MessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentText,
      time: timeNow,
      msgId: randomId,
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
      const history = (chatMessages[activeChat] || [])
        .filter((m) => m.text && m.text.trim())
        .map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

      const reply = await sendLiveChatMessage(currentText, activeChat, history);

      const replyMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        msgId: `ID ${Math.floor(2970 + Math.random() * 50)}`,
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
        text: activeChat === 'delta' ? 'duh error naxxx, coba lagi bentar yaaa' : 'Gagal menghubungi server.',
        time: timeNow,
        msgId: `ID ${Math.floor(2980 + Math.random() * 50)}`,
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
  // VIEW: RUANG OBROLAN (PERSIS SCREENSHOT NAZZA)
  // -------------------------------------------------------------
  if (activeChat) {
    const thread = threads[activeChat];
    const msgs = chatMessages[activeChat] || [];

    return (
      <div className="flex flex-col h-[100dvh] w-full bg-[#12151A] text-white">
        {/* Header Ruang Chat Khas Telegram Nazza */}
        <header className="fixed top-0 inset-x-0 z-50 h-14 bg-[#1E232B]/95 backdrop-blur-md border-b border-white/[0.06] px-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveChat(null)}
              className="p-1 -ml-1 text-gray-300 hover:text-white active:scale-95"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="relative">
              <img
                src={thread.avatar}
                alt={thread.name}
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-[#1A3B5C] border border-[#12151A] text-[#40A7E3] text-[8px] font-bold px-1 rounded-full flex items-center">
                <span>1h</span>
              </div>
            </div>
            <div>
              <div className="text-[16px] font-bold text-white leading-tight">
                {thread.name}
              </div>
              <div className="text-[12px] text-gray-400">
                1 pengguna bulanan
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-2 text-gray-300 hover:text-white">
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        {/* Area Pesan Berlatar Gelap */}
        <main className="flex-1 overflow-y-auto touch-scroll px-3 pt-16 pb-24 space-y-3.5">
          {msgs.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble Chat */}
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-[14px] leading-relaxed select-text shadow-md ${
                    isUser
                      ? 'bg-[#7055C4] text-white rounded-br-sm'
                      : 'bg-[#222730] text-[#E5E9F0] rounded-bl-sm border border-white/[0.04]'
                  }`}
                >
                  {/* Teks Pesan Normal */}
                  {m.text && (
                    <div className="whitespace-pre-wrap font-normal">
                      {m.text}
                    </div>
                  )}

                  {/* Blok Log Eksekusi Tool (Persis Screenshot) */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="space-y-2">
                      {m.actions.map((act, idx) => {
                        if (act.type === 'reading') {
                          return (
                            <div key={idx} className="flex items-center gap-2 text-[13px] text-gray-200">
                              <span>📖</span>
                              <span className="font-semibold text-white">Reading</span>
                              <span className="text-gray-300">{act.detail}</span>
                            </div>
                          );
                        }
                        if (act.type === 'editing') {
                          return (
                            <div key={idx} className="flex items-center gap-2 text-[13px] text-gray-200">
                              <span>🔧</span>
                              <span className="font-semibold text-white">Editing</span>
                              <span className="text-gray-300 truncate max-w-[200px]">{act.detail}</span>
                            </div>
                          );
                        }
                        if (act.type === 'terminal') {
                          return (
                            <div key={idx} className="space-y-1.5 pt-1">
                              <div className="flex items-center gap-2 text-[13px]">
                                <span>💻</span>
                                <span className="font-semibold text-white">Terminal</span>
                              </div>
                              {/* Sub-kotak Powershell Gelap */}
                              <div className="bg-[#181C22] rounded-xl border border-white/[0.08] overflow-hidden">
                                <div className="bg-[#20252D] px-3 py-1 text-[11px] font-semibold text-gray-300 border-b border-white/[0.05]">
                                  Powershell
                                </div>
                                <div className="p-3 font-mono text-[12px] text-white overflow-x-auto leading-normal">
                                  {act.command}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}

                  {/* ID dan Waktu di Sudut Bawah */}
                  <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[11px] text-white/50 select-none">
                    {m.msgId && <span className="font-mono">{m.msgId}</span>}
                    <span>{m.time}</span>
                    {isUser && <CheckCheck size={14} className="text-white/80" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#222730] rounded-2xl border border-white/[0.04] w-fit shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7055C4] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7055C4] animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7055C4] animate-bounce [animation-delay:0.3s]" />
              <span className="text-xs text-gray-300 font-mono ml-1">mengeksekusi...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        {/* Floating Scroll to bottom FAB */}
        <div className="fixed bottom-16 right-4 z-40 pointer-events-none">
          <button
            onClick={() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="pointer-events-auto w-10 h-10 rounded-full bg-[#222730] border border-white/10 flex items-center justify-center text-gray-300 shadow-xl active:scale-90"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Input Bar Khas Telegram Nazza */}
        <div className="fixed bottom-0 inset-x-0 z-50 bg-[#1A1F26] border-t border-white/[0.06] px-2 py-2 flex items-center gap-1.5">
          {/* Tombol Menu Biru Kapsul */}
          <button className="flex items-center gap-1 bg-[#2C68A6] hover:bg-[#2C68A6]/90 text-white text-xs font-semibold px-3 py-2 rounded-xl active:scale-95 shadow-sm">
            <Menu size={16} />
            <span>Menu</span>
          </button>

          {/* Kolom Ketik Telegram */}
          <div className="flex-1 flex items-center bg-[#242A34] rounded-2xl px-2.5 py-1.5 border border-white/[0.04]">
            <button className="p-1 text-gray-400 hover:text-white">
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pesan"
              className="flex-1 bg-transparent px-2 text-[13px] text-white placeholder-gray-400 focus:outline-none"
            />
            <button className="p-1 text-gray-400 hover:text-white">
              <Paperclip size={19} />
            </button>
          </div>

          {/* Tombol Kirim / Mic */}
          {inputText.trim() ? (
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 rounded-full bg-[#7055C4] flex items-center justify-center text-white active:scale-95 shadow-md"
            >
              <Send size={18} />
            </button>
          ) : (
            <button className="w-10 h-10 rounded-full bg-[#242A34] flex items-center justify-center text-gray-400 active:scale-95">
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: UTAMA NAXX WORKSTATION (BERANDA LIST CHAT)
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

      {/* 3. Main Content List */}
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
                <span className="font-mono text-gray-400">Naxx Telegram Edition v3.2</span>
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

      {/* 4. Floating Bottom Bar (3 Menu: Obrolan, Pengaturan, Profil) */}
      <div className="fixed bottom-3 inset-x-0 z-50 pointer-events-none px-4">
        <nav className="pointer-events-auto max-w-xs mx-auto flex items-center justify-around py-1.5 px-3 bg-[#121B26]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
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
