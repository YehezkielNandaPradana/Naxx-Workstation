import React, { useState, useEffect, useRef } from 'react';
import type { AgentId, MessageItem, ChatThread, ToolAction } from './types';
import {
  Search,
  MoreVertical,
  Pin,
  MessageCircle,
  Settings,
  User,
  ArrowLeft,
  ChevronDown,
  Smile,
  Mic,
  CheckCheck,
  Share2,
  Bell,
  BellOff,
  Cpu,
  Smartphone,
  Copy,
  ShieldCheck,
  FileCode,
  BookOpen,
  Trash2,
  Check,
  X,
  Image,
  FileText,
  Code2,
  Camera,
  Edit3,
  CornerUpLeft,
  Plus,
  ArrowUp,
} from 'lucide-react';
import { sendLiveChatMessage } from './api';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'obrolan' | 'pengaturan' | 'profil'>('obrolan');
  const [folderTab, setFolderTab] = useState<'all' | 'agent'>('agent');
  const [activeChat, setActiveChat] = useState<AgentId | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Messages State (Dimuat dari localStorage agar sesi terakhir tetap ada saat refresh)
  const [chatMessages, setChatMessages] = useState<Record<AgentId, MessageItem[]>>(() => {
    try {
      const saved = localStorage.getItem('naxx_chat_messages');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_) {}
    return {
      delta: [],
      nazza: [],
    };
  });

  // Threads State (Default Clean Sesi Awal dengan localStorage Lazy Initializer)
  const [threads, setThreads] = useState<Record<AgentId, ChatThread>>(() => {
    let initialMessages: Record<AgentId, MessageItem[]> = { delta: [], nazza: [] };
    try {
      const savedMsgs = localStorage.getItem('naxx_chat_messages');
      if (savedMsgs) {
        initialMessages = JSON.parse(savedMsgs);
      }
    } catch (_) {}

    const deltaLast = initialMessages.delta?.[initialMessages.delta.length - 1];
    const nazzaLast = initialMessages.nazza?.[initialMessages.nazza.length - 1];

    const defaultThreads: Record<AgentId, ChatThread> = {
      delta: {
        id: 'delta',
        name: 'Delta',
        avatar: '/delta_avatar.png',
        role: 'Logika & Solusi (Termux)',
        device: 'Motorola moto g45 5G',
        lastMessage: deltaLast?.text || 'Belum ada pesan',
        lastTime: deltaLast?.time || '',
        pinned: true,
        unreadCount: 0,
        online: true,
      },
      nazza: {
        id: 'nazza',
        name: 'Nazza',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'Eksekutor Laptop (Windows 11)',
        device: 'ThinkPad (Windows 11)',
        lastMessage: nazzaLast?.text || 'Belum ada pesan',
        lastTime: nazzaLast?.time || '',
        pinned: false,
        unreadCount: 0,
        online: true,
      },
    };

    try {
      const savedProfiles = localStorage.getItem('naxx_agent_profiles');
      if (savedProfiles) {
        const parsed = JSON.parse(savedProfiles);
        return {
          delta: {
            ...defaultThreads.delta,
            name: parsed.delta?.name || defaultThreads.delta.name,
            role: parsed.delta?.role || defaultThreads.delta.role,
            avatar: parsed.delta?.avatar || defaultThreads.delta.avatar,
            avatarSize: parsed.delta?.avatarSize || defaultThreads.delta.avatarSize,
            lastMessage: defaultThreads.delta.lastMessage,
            lastTime: defaultThreads.delta.lastTime,
          },
          nazza: {
            ...defaultThreads.nazza,
            name: parsed.nazza?.name || defaultThreads.nazza.name,
            role: parsed.nazza?.role || defaultThreads.nazza.role,
            avatar: parsed.nazza?.avatar || defaultThreads.nazza.avatar,
            avatarSize: parsed.nazza?.avatarSize || defaultThreads.nazza.avatarSize,
            lastMessage: defaultThreads.nazza.lastMessage,
            lastTime: defaultThreads.nazza.lastTime,
          },
        };
      }
    } catch (_) {}

    return defaultThreads;
  });

  // Simpan otomatis chatMessages ke localStorage setiap kali ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem('naxx_chat_messages', JSON.stringify(chatMessages));
    } catch (_) {}
  }, [chatMessages]);

  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingAgent, setGeneratingAgent] = useState<AgentId | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // Extra Interactive States for Functionality
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentSheetOpen, setAttachmentSheetOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Bot Profile Edit Modal State
  const [editBotModalOpen, setEditBotModalOpen] = useState(false);
  const [editBotName, setEditBotName] = useState('');
  const [editBotRole, setEditBotRole] = useState('');
  const [editBotAvatar, setEditBotAvatar] = useState('');
  const [editBotAvatarSize, setEditBotAvatarSize] = useState(36);
  const avatarUploadRef = useRef<HTMLInputElement>(null);

  // iOS Long-Press Bubble Context Menu State
  const [contextMessage, setContextMessage] = useState<MessageItem | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<MessageItem | null>(null);
  const longPressTimerRef = useRef<any>(null);

  const startLongPress = (msg: MessageItem) => {
    longPressTimerRef.current = setTimeout(() => {
      setContextMessage(msg);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 450);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleContextAction = (action: 'copy' | 'reply' | 'pin' | 'delete', reaction?: string) => {
    if (!contextMessage || !activeChat) return;

    if (reaction) {
      handleSendMessage(`${reaction} (Reaksi ke: "${contextMessage.text?.slice(0, 30)}...")`);
      showToast(`Reaksi ${reaction} dikirim`);
    } else if (action === 'copy') {
      navigator.clipboard.writeText(contextMessage.text || '');
      showToast('Pesan disalin ke clipboard');
    } else if (action === 'reply') {
      setReplyingToMessage(contextMessage);
      setInputText(`Replying to "${contextMessage.text?.slice(0, 25)}...": `);
    } else if (action === 'pin') {
      showToast('Pesan disematkan');
    } else if (action === 'delete') {
      setChatMessages((prev) => ({
        ...prev,
        [activeChat]: (prev[activeChat] || []).filter((m) => m.id !== contextMessage.id),
      }));
      showToast('Pesan dihapus');
    }

    setContextMessage(null);
  };

  const openEditBotModal = () => {
    if (!activeChat) return;
    const current = threads[activeChat];
    setEditBotName(current.name);
    setEditBotRole(current.role || '');
    setEditBotAvatar(current.avatar);
    setEditBotAvatarSize(current.avatarSize || 36);
    setChatMenuOpen(false);
    setEditBotModalOpen(true);
  };

  const handleSaveBotProfile = () => {
    if (!activeChat || !editBotName.trim()) return;
    const updatedThread: ChatThread = {
      ...threads[activeChat],
      name: editBotName.trim(),
      role: editBotRole.trim(),
      avatar: editBotAvatar.trim() || threads[activeChat].avatar,
      avatarSize: editBotAvatarSize,
    };

    const newThreads = {
      ...threads,
      [activeChat]: updatedThread,
    };

    setThreads(newThreads);
    try {
      // Simpan HANYA metadata profil (nama, peran, avatar, avatarSize), bukan teks chat sementara
      const profileDataOnly = {
        delta: {
          name: newThreads.delta.name,
          role: newThreads.delta.role,
          avatar: newThreads.delta.avatar,
          avatarSize: newThreads.delta.avatarSize,
        },
        nazza: {
          name: newThreads.nazza.name,
          role: newThreads.nazza.role,
          avatar: newThreads.nazza.avatar,
          avatarSize: newThreads.nazza.avatarSize,
        },
      };
      localStorage.setItem('naxx_agent_profiles', JSON.stringify(profileDataOnly));
    } catch (_) {}

    setEditBotModalOpen(false);
    showToast(`Profil ${editBotName} diperbarui!`);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditBotAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (!isRecordingAudio) return;
    const interval = setInterval(() => {
      setRecordSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2400);
  };

  useEffect(() => {
    if (activeChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeChat, isGenerating]);

  // BotFather / Telegram Commands Definition
  const BOT_COMMANDS = [
    { command: '/start', desc: 'Mulai atau restart percakapan dengan agen' },
    { command: '/new', desc: 'Mulai topik atau percakapan obrolan baru' },
    { command: '/help', desc: 'Daftar panduan dan perintah yang tersedia' },
    { command: '/model', desc: 'Lihat info model AI aktif (Antigravity/Delta)' },
    { command: '/stop', desc: 'Hentikan proses generasi pesan' },
    { command: '/status', desc: 'Periksa status koneksi node dan gateway' },
    { command: '/clear', desc: 'Bersihkan seluruh riwayat pesan aktif' },
    { command: '/settings', desc: 'Buka pengaturan koneksi dan port 9Router' },
    { command: '/token', desc: 'Info token dan konteks sesi lokal' },
  ];

  // Helper parser: deteksi tag tools dari jawaban AI nyata/live
  const parseToolActionsFromText = (text: string): { cleanText: string; actions: ToolAction[] } => {
    const actions: ToolAction[] = [];
    let cleanText = text;

    // 1. Detect Read tool: [Read: path/to/file]
    const readMatches = [...cleanText.matchAll(/\[(?:Read|Reading):\s*([^\]]+)\]/gi)];
    for (const match of readMatches) {
      actions.push({
        type: 'reading',
        title: 'Read',
        detail: match[1].trim(),
      });
      cleanText = cleanText.replace(match[0], '');
    }

    // 2. Detect Edit tool: [Edit: path/to/file]
    const editMatches = [...cleanText.matchAll(/\[(?:Edit|Editing):\s*([^\]]+)\]/gi)];
    for (const match of editMatches) {
      actions.push({
        type: 'editing',
        title: 'Edit',
        detail: match[1].trim(),
      });
      cleanText = cleanText.replace(match[0], '');
    }

    // 3. Detect Write tool: [Write|Create: path/to/file]
    const writeMatches = [...cleanText.matchAll(/\[(?:Write|Writing|Create):\s*([^\]]+)\]/gi)];
    for (const match of writeMatches) {
      actions.push({
        type: 'writing',
        title: 'Write',
        detail: match[1].trim(),
      });
      cleanText = cleanText.replace(match[0], '');
    }

    // 4. Detect Terminal/Bash: ```bash ... ``` atau [Bash: command]
    const terminalMatches = [...cleanText.matchAll(/```(?:bash|sh|powershell|cmd)\n([\s\S]*?)```/gi)];
    for (const match of terminalMatches) {
      const cmd = match[1].trim();
      actions.push({
        type: 'terminal',
        title: 'Bash',
        detail: 'Terminal Execution',
        command: cmd,
        status: 'completed',
      });
      cleanText = cleanText.replace(match[0], '');
    }

    return { cleanText: cleanText.trim(), actions };
  };

  // Send Message Logic (Exact Connection Untouched)
  const handleSendMessage = async (textToSend?: string) => {
    const targetChat = activeChat;
    const rawText = textToSend !== undefined ? textToSend : inputText;
    if (!rawText.trim() || !targetChat || isGenerating) return;

    const currentText = rawText.trim();
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
      [targetChat]: [...(prev[targetChat] || []), newMsg],
    }));

    setThreads((prev) => ({
      ...prev,
      [targetChat]: {
        ...prev[targetChat],
        lastMessage: currentText,
        lastTime: timeNow,
      },
    }));

    setInputText('');
    setShowEmojiPicker(false);
    setIsGenerating(true);
    setGeneratingAgent(targetChat);

    try {
      const currentHistory = (chatMessages[targetChat] || [])
        .filter((m) => m.text && m.text.trim())
        .map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

      const reply = await sendLiveChatMessage(currentText, targetChat, currentHistory);
      const parsed = parseToolActionsFromText(reply);

      const replyMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: parsed.cleanText || reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        msgId: `ID ${Math.floor(2970 + Math.random() * 50)}`,
        actions: parsed.actions.length > 0 ? parsed.actions : undefined,
      };

      setChatMessages((prev) => ({
        ...prev,
        [targetChat]: [...(prev[targetChat] || []), replyMsg],
      }));

      setThreads((prev) => ({
        ...prev,
        [targetChat]: {
          ...prev[targetChat],
          lastMessage: reply,
          lastTime: replyMsg.time,
        },
      }));
    } catch (_) {
      const errorMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: targetChat === 'delta' ? 'duh error naxxx, coba lagi bentar yaaa' : 'Gagal menghubungi server.',
        time: timeNow,
        msgId: `ID ${Math.floor(2980 + Math.random() * 50)}`,
      };
      setChatMessages((prev) => ({
        ...prev,
        [targetChat]: [...(prev[targetChat] || []), errorMsg],
      }));
    } finally {
      setIsGenerating(false);
      setGeneratingAgent(null);
    }
  };

  // Helper actions
  const handleClearChat = () => {
    if (!activeChat) return;
    setChatMessages((prev) => ({
      ...prev,
      [activeChat]: [],
    }));
    setThreads((prev) => ({
      ...prev,
      [activeChat]: {
        ...prev[activeChat],
        lastMessage: 'Obrolan dibersihkan',
      },
    }));
    setChatMenuOpen(false);
    showToast('Obrolan dibersihkan');
  };

  const handleCopyHistory = () => {
    if (!activeChat) return;
    const msgs = chatMessages[activeChat] || [];
    const textHistory = msgs
      .map((m) => `[${m.time}] ${m.sender === 'user' ? 'You' : threads[activeChat].name}: ${m.text}`)
      .join('\n');
    navigator.clipboard.writeText(textHistory);
    setChatMenuOpen(false);
    showToast('Riwayat disalin ke clipboard');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: string = 'File') => {
    const file = e.target.files?.[0];
    if (file && activeChat) {
      handleSendMessage(`📎 [${fileType}: ${file.name} (${Math.round(file.size / 1024)} KB)]`);
      showToast(`${fileType} "${file.name}" terkirim`);
      setAttachmentSheetOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (mediaInputRef.current) mediaInputRef.current.value = '';
    }
  };

  const handleSendCodeSnippet = () => {
    if (!codeSnippet.trim() || !activeChat) return;
    handleSendMessage(`\`\`\`\n${codeSnippet.trim()}\n\`\`\``);
    setCodeSnippet('');
    setCodeModalOpen(false);
    showToast('Cuplikan kode terkirim');
  };

  const handleSendVoiceNote = () => {
    if (!activeChat) return;
    setIsRecordingAudio(false);
    const duration = recordSeconds > 0 ? recordSeconds : 3;
    handleSendMessage(`🎙️ [Pesan Suara / Audio Voice Note: ${duration}s]`);
    showToast('Pesan suara terkirim');
  };

  // =========================================================================
  // VIEW: RUANG OBROLAN NATURAL & CLEAN (IOS STYLE)
  // =========================================================================
  if (activeChat) {
    const thread = threads[activeChat];
    const rawMsgs = chatMessages[activeChat] || [];
    const msgs = chatSearchQuery.trim()
      ? rawMsgs.filter((m) => m.text.toLowerCase().includes(chatSearchQuery.toLowerCase()))
      : rawMsgs;

    return (
      <div className="flex flex-col h-[100dvh] w-full ios-clean-canvas text-white overflow-hidden select-text relative">
        {/* Toast Floating Alert */}
        {toastMessage && (
          <div className="fixed top-16 inset-x-0 z-[60] flex justify-center pointer-events-none px-4">
            <div className="bg-[#1C2433]/90 text-white text-xs px-4 py-2 rounded-full border border-white/15 backdrop-blur-xl shadow-xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
              <Check size={14} className="text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Hidden File Inputs for Paperclip Attachments */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e, 'Dokumen')}
          className="hidden"
        />
        <input
          type="file"
          ref={mediaInputRef}
          accept="image/*,video/*"
          onChange={(e) => handleFileUpload(e, 'Foto/Video')}
          className="hidden"
        />

        {/* iOS Clean Nav Header */}
        <header className="fixed top-0 inset-x-0 z-50 h-14 ios-glass-bar px-3 flex items-center justify-between select-none">
          {chatSearchOpen ? (
            <div className="flex-1 flex items-center gap-2 bg-[#141A26] px-3 py-1.5 rounded-full border border-white/10 mr-1">
              <Search size={15} className="text-[#8E8E93]" />
              <input
                type="text"
                autoFocus
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                placeholder="Cari dalam pesan..."
                className="flex-1 bg-transparent text-xs text-white placeholder-[#8E8E93] focus:outline-none"
              />
              <button
                onClick={() => {
                  setChatSearchOpen(false);
                  setChatSearchQuery('');
                }}
                className="text-[#8E8E93] hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div
              onClick={openEditBotModal}
              className="flex items-center gap-2 min-w-0 cursor-pointer group"
              title="Klik untuk ubah profil bot"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveChat(null);
                }}
                className="p-1.5 -ml-1 text-[#007AFF] hover:opacity-80 active:scale-95 transition-all flex items-center"
                aria-label="Kembali"
              >
                <ArrowLeft size={21} strokeWidth={2.4} />
              </button>
              <div className="relative flex-shrink-0">
                <img
                  src={thread.avatar}
                  alt={thread.name}
                  className="rounded-full object-cover border border-white/10 group-hover:scale-105 transition-transform"
                  style={{
                    width: `${thread.avatarSize || 36}px`,
                    height: `${thread.avatarSize || 36}px`,
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#34C759] border-2 border-[#0C1017] rounded-full" />
              </div>
              <div className="min-w-0 ml-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold text-white tracking-tight leading-tight truncate group-hover:text-blue-400 transition-colors">
                    {thread.name}
                  </span>
                  <Edit3 size={12} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[11px] text-[#8E8E93] leading-none mt-0.5">
                  Online
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 select-none relative">
            <button
              onClick={() => setChatSearchOpen((prev) => !prev)}
              className={`w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-all ${
                chatSearchOpen ? 'text-[#007AFF] bg-white/[0.08]' : 'text-[#8E8E93] hover:text-white'
              }`}
              title="Cari Pesan"
            >
              <Search size={18} />
            </button>

            <button
              onClick={() => setChatMenuOpen((prev) => !prev)}
              className="w-8 h-8 flex items-center justify-center text-[#8E8E93] hover:text-white rounded-full active:scale-95 transition-all"
              title="Menu Tindakan"
            >
              <MoreVertical size={18} />
            </button>

            {/* Chat Popover Actions Menu */}
            {chatMenuOpen && (
              <div className="absolute top-10 right-0 w-48 bg-[#18202D]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5">
                <button
                  onClick={openEditBotModal}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/[0.08] active:scale-95 transition-all"
                >
                  <Edit3 size={15} className="text-blue-400" />
                  <span>Ubah Profil Bot</span>
                </button>
                <button
                  onClick={handleCopyHistory}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/[0.08] active:scale-95 transition-all"
                >
                  <Copy size={15} className="text-sky-400" />
                  <span>Salin Obrolan</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-500/10 active:scale-95 transition-all"
                >
                  <Trash2 size={15} className="text-rose-400" />
                  <span>Bersihkan Pesan</span>
                </button>
                <button
                  onClick={() => {
                    setActiveChat(null);
                    setChatMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-white/[0.08] active:scale-95 transition-all"
                >
                  <ArrowLeft size={15} />
                  <span>Tutup Sesi</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Chat Messages Scroll Area */}
        <main
          ref={chatScrollContainerRef}
          onScroll={(e) => {
            const target = e.currentTarget;
            const distFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
            setShowScrollBottom(distFromBottom > 160);
          }}
          onClick={() => {
            if (chatMenuOpen) setChatMenuOpen(false);
            if (showEmojiPicker) setShowEmojiPicker(false);
          }}
          className="flex-1 overflow-y-auto touch-scroll px-3 pt-18 pb-22 space-y-2.5"
        >
          {/* iOS Clean Date Badge */}
          {msgs.length > 0 ? (
            <div className="flex justify-center my-1 select-none">
              <div className="px-3 py-0.5 rounded-full text-[11px] font-medium text-[#8E8E93] bg-white/[0.05]">
                {chatSearchQuery ? `Hasil Pencarian (${msgs.length})` : 'Hari Ini'}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center px-4 select-none animate-in fade-in zoom-in-95 duration-250">
              <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 mb-3 shadow-lg">
                <img
                  src={thread.avatar}
                  alt={thread.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <div className="text-[16px] font-semibold text-white tracking-tight">
                {thread.name}
              </div>
              <div className="text-[12px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                Belum ada pesan di sini. Ketik pesan atau gunakan <span className="font-mono text-blue-400">/</span> untuk memilih perintah.
              </div>
            </div>
          )}

          {msgs.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
              >
                {/* Clean iOS Bubble with Long Press Support */}
                <div
                  onMouseDown={() => startLongPress(m)}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                  onTouchStart={() => startLongPress(m)}
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  className={`relative max-w-[85%] sm:max-w-[72%] px-3.5 py-2.5 text-[14px] leading-relaxed select-text cursor-pointer active:opacity-90 ${
                    isUser
                      ? 'ios-bubble-user'
                      : 'ios-bubble-agent'
                  }`}
                >
                  {/* Message Body */}
                  {m.text && (
                    <div className="whitespace-pre-wrap font-normal break-words">
                      {m.text}
                    </div>
                  )}

                  {/* Claude Code Style Tool Execution Cards */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="space-y-2 mt-2 font-mono">
                      {m.actions.map((act, idx) => {
                        if (act.type === 'reading') {
                          return (
                            <div key={idx} className="bg-[#0D1117] rounded-xl border border-white/[0.12] overflow-hidden shadow-md">
                              <div className="bg-[#161B22] px-3 py-1.5 text-[11px] text-slate-300 flex items-center justify-between border-b border-white/[0.08]">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#FF5F56]/70" />
                                    <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/70" />
                                    <span className="w-2 h-2 rounded-full bg-[#27C93F]/70" />
                                  </div>
                                  <span className="text-sky-400 font-semibold text-[11px] ml-1">Read</span>
                                </div>
                                <span className="text-[10px] text-sky-400/90 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-400/20">
                                  inspecting
                                </span>
                              </div>
                              <div className="p-2.5 bg-[#090D14] flex items-center gap-2 text-xs">
                                <BookOpen size={14} className="text-sky-400 flex-shrink-0" />
                                <span className="text-slate-200 truncate">{act.detail}</span>
                              </div>
                            </div>
                          );
                        }
                        if (act.type === 'editing') {
                          return (
                            <div key={idx} className="bg-[#0D1117] rounded-xl border border-white/[0.12] overflow-hidden shadow-md">
                              <div className="bg-[#161B22] px-3 py-1.5 text-[11px] text-slate-300 flex items-center justify-between border-b border-white/[0.08]">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#FF5F56]/70" />
                                    <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/70" />
                                    <span className="w-2 h-2 rounded-full bg-[#27C93F]/70" />
                                  </div>
                                  <span className="text-amber-400 font-semibold text-[11px] ml-1">Edit</span>
                                </div>
                                <span className="text-[10px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">
                                  modified
                                </span>
                              </div>
                              <div className="p-2.5 bg-[#090D14] flex items-center gap-2 text-xs">
                                <FileCode size={14} className="text-amber-400 flex-shrink-0" />
                                <span className="text-slate-200 truncate">{act.detail}</span>
                              </div>
                            </div>
                          );
                        }
                        if (act.type === 'writing') {
                          return (
                            <div key={idx} className="bg-[#0D1117] rounded-xl border border-white/[0.12] overflow-hidden shadow-md">
                              <div className="bg-[#161B22] px-3 py-1.5 text-[11px] text-slate-300 flex items-center justify-between border-b border-white/[0.08]">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#FF5F56]/70" />
                                    <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/70" />
                                    <span className="w-2 h-2 rounded-full bg-[#27C93F]/70" />
                                  </div>
                                  <span className="text-purple-400 font-semibold text-[11px] ml-1">Write</span>
                                </div>
                                <span className="text-[10px] text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-400/20">
                                  created
                                </span>
                              </div>
                              <div className="p-2.5 bg-[#090D14] flex items-center gap-2 text-xs">
                                <FileText size={14} className="text-purple-400 flex-shrink-0" />
                                <span className="text-slate-200 truncate">{act.detail}</span>
                              </div>
                            </div>
                          );
                        }
                        if (act.type === 'terminal') {
                          return (
                            <div key={idx} className="bg-[#0D1117] rounded-xl border border-white/[0.12] overflow-hidden shadow-lg mt-2 font-mono">
                              {/* Claude Code Style Terminal Header */}
                              <div className="bg-[#161B22] px-3 py-1.5 text-[11px] font-medium text-slate-300 flex items-center justify-between border-b border-white/[0.08]">
                                <div className="flex items-center gap-2">
                                  {/* macOS Window Control Dots */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                                  </div>
                                  <span className="text-slate-400 text-[10.5px] ml-1">Bash / Terminal</span>
                                </div>
                                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
                                  ● completed
                                </span>
                              </div>

                              {/* Terminal Command Body with $ prompt */}
                              <div className="p-3 bg-[#0A0D12] text-xs leading-relaxed overflow-x-auto space-y-1.5">
                                <div className="flex items-start gap-2 text-slate-100">
                                  <span className="text-emerald-400 font-bold select-none">$</span>
                                  <span className="text-emerald-300 font-semibold">{act.command}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 border-l-2 border-slate-700 pl-2 mt-1 space-y-0.5">
                                  <div className="text-slate-500">// Output:</div>
                                  <div className="text-slate-300 font-sans text-[11.5px] leading-snug">
                                    Process finished with exit code 0.
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}

                  {/* Inline Metadata */}
                  <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] select-none font-mono ${isUser ? 'text-white/70' : 'text-[#8E8E93]'}`}>
                    {m.msgId && <span>{m.msgId}</span>}
                    <span>{m.time}</span>
                    {isUser && <CheckCheck size={13} className="text-white/90" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing / Thinking Indicator iOS Wave */}
          {isGenerating && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl ios-bubble-agent w-fit shadow-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1E6BEB] animate-ios-dot-1" />
                <span className="w-2 h-2 rounded-full bg-[#1E6BEB] animate-ios-dot-2" />
                <span className="w-2 h-2 rounded-full bg-[#1E6BEB] animate-ios-dot-3" />
              </div>
              <span className="text-[12px] text-slate-300 font-medium tracking-tight">Memproses...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        {/* Conditional Scroll-to-bottom Floating Glass Button */}
        {showScrollBottom && (
          <div className="fixed bottom-20 right-4 z-40 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                setShowScrollBottom(false);
              }}
              className="w-9 h-9 rounded-full bg-[#1A222E]/95 border border-white/15 flex items-center justify-center text-white shadow-xl active:scale-90 transition-all hover:bg-white/15"
              aria-label="Scroll ke paling bawah"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        )}

        {/* BotFather / Slash Command Suggestions Floating Menu */}
        {inputText.startsWith('/') && (
          <div className="fixed bottom-16 inset-x-3 z-50 max-w-xl mx-auto liquid-glass-sheet rounded-3xl p-2 shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-150">
            <div className="px-3 py-1.5 text-[10.5px] font-semibold text-[#8E8E93] uppercase tracking-wider flex items-center justify-between border-b border-white/[0.06]">
              <span>Perintah BotFather</span>
              <span className="font-mono text-[10px] text-blue-400">Tekan untuk kirim</span>
            </div>
            <div className="max-h-56 overflow-y-auto touch-scroll py-1 space-y-0.5">
              {BOT_COMMANDS.filter((c) => c.command.toLowerCase().startsWith(inputText.toLowerCase())).map((cmd) => (
                <button
                  key={cmd.command}
                  onClick={() => {
                    if (cmd.command === '/clear') {
                      handleClearChat();
                      setInputText('');
                    } else if (cmd.command === '/stop') {
                      setIsGenerating(false);
                      setGeneratingAgent(null);
                      setInputText('');
                      showToast('Generasi pesan dihentikan');
                    } else if (cmd.command === '/settings') {
                      setActiveTab('pengaturan');
                      setActiveChat(null);
                      setInputText('');
                    } else {
                      handleSendMessage(cmd.command);
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.08] active:scale-[0.99] transition-all text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] font-semibold text-blue-400 group-hover:text-blue-300">
                      {cmd.command}
                    </span>
                    <span className="text-[12px] text-slate-300 font-normal">
                      - {cmd.desc}
                    </span>
                  </div>
                </button>
              ))}
              {BOT_COMMANDS.filter((c) => c.command.toLowerCase().startsWith(inputText.toLowerCase())).length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-400 font-mono">
                  Tidak ada perintah yang cocok
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emoji Quick Picker Floating Bar */}
        {showEmojiPicker && (
          <div className="fixed bottom-16 inset-x-4 z-50 max-w-sm mx-auto bg-[#18202D]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between">
            {['👍', '❤️', '🔥', '🚀', '💻', '✨', '👏', '🎉'].map((emo) => (
              <button
                key={emo}
                onClick={() => {
                  setInputText((prev) => prev + emo);
                  setShowEmojiPicker(false);
                }}
                className="text-lg p-1.5 hover:bg-white/10 rounded-xl active:scale-90 transition-all"
              >
                {emo}
              </button>
            ))}
          </div>
        )}

        {/* Reply Indicator Preview Banner */}
        {replyingToMessage && (
          <div className="fixed bottom-14 inset-x-3 z-40 max-w-xl mx-auto bg-[#18202D]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2 min-w-0">
              <CornerUpLeft size={16} className="text-blue-400 flex-shrink-0" />
              <div className="text-xs truncate">
                <span className="text-blue-400 font-semibold">Balas: </span>
                <span className="text-slate-300">{replyingToMessage.text}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setReplyingToMessage(null);
                setInputText('');
              }}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* iOS Natural Input Dock */}
        <div className="fixed bottom-0 inset-x-0 z-50 ios-glass-input p-2.5 select-none">
          <div className="max-w-xl mx-auto flex items-center gap-2">
            {isRecordingAudio ? (
              <div className="flex-1 flex items-center justify-between bg-red-500/15 border border-red-500/30 rounded-full px-4 py-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs text-red-300 font-mono font-semibold">
                    Merekam: 00:0{recordSeconds}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecordingAudio(false)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSendVoiceNote}
                    className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md active:scale-90"
                    title="Kirim Rekaman"
                  >
                    <Check size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* iOS Plus (+) Action Button */}
                <button
                  onClick={() => setAttachmentSheetOpen(true)}
                  className="w-9 h-9 rounded-full bg-white/[0.12] hover:bg-white/[0.18] flex items-center justify-center text-white active:scale-90 transition-all flex-shrink-0"
                  title="Lampirkan File"
                >
                  <Plus size={20} strokeWidth={2.5} />
                </button>

                {/* Input Capsule - iOS iMessage Pill */}
                <div className="flex-1 flex items-center ios-input-capsule rounded-full px-3.5 py-2 min-w-0">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pesan..."
                    className="flex-1 bg-transparent text-[14.5px] text-white placeholder-[#8E8E93] focus:outline-none min-w-0"
                  />
                  <button
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="text-[#8E8E93] hover:text-white transition-transform active:scale-90 ml-1.5 p-0.5 flex-shrink-0"
                    title="Pilih Emoji"
                  >
                    <Smile size={19} />
                  </button>
                </div>

                {/* Send (ArrowUp) / Mic Action */}
                {inputText.trim() ? (
                  <button
                    onClick={() => handleSendMessage()}
                    className="w-9 h-9 rounded-full ios-send-btn flex items-center justify-center flex-shrink-0 animate-in zoom-in-75 duration-150"
                    aria-label="Kirim Pesan"
                  >
                    <ArrowUp size={19} strokeWidth={2.8} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRecordingAudio(true)}
                    className="w-9 h-9 rounded-full text-[#8E8E93] hover:text-white flex items-center justify-center active:scale-90 transition-all hover:bg-white/[0.06] flex-shrink-0"
                    aria-label="Kirim Pesan Suara"
                    title="Rekam Pesan Suara"
                  >
                    <Mic size={20} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        {/* iOS Action Sheet: Liquid Glass Transparent Attachment Modal */}
        {attachmentSheetOpen && (
          <div
            onClick={() => setAttachmentSheetOpen(false)}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 backdrop-blur-[6px] animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-4 space-y-2.5 animate-in slide-in-from-bottom duration-250"
            >
              {/* Main Liquid Glass Translucent Sheet */}
              <div className="liquid-glass-sheet rounded-[28px] overflow-hidden divide-y divide-white/[0.08] relative">
                {/* Specular Fluid Highlight Edge */}
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                {/* Drag Handle */}
                <div className="flex justify-center pt-2.5 pb-1">
                  <div className="w-11 h-1 rounded-full bg-white/25" />
                </div>

                <div className="px-4 py-1.5 text-center text-[11px] text-slate-300/80 font-medium tracking-wide uppercase">
                  Pilih Berkas Lampiran
                </div>

                <button
                  onClick={() => {
                    setAttachmentSheetOpen(false);
                    mediaInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.08] active:bg-white/[0.14] transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-105 transition-transform">
                    <Image size={19} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-white tracking-tight">Foto & Video</div>
                    <div className="text-[11.5px] text-slate-300/70">Kirim media visual dari galeri atau kamera</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAttachmentSheetOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.08] active:bg-white/[0.14] transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-105 transition-transform">
                    <FileText size={19} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-white tracking-tight">Dokumen & Berkas</div>
                    <div className="text-[11.5px] text-slate-300/70">PDF, ZIP, arsip log, atau file dokumen</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAttachmentSheetOpen(false);
                    setCodeModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.08] active:bg-white/[0.14] transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-105 transition-transform">
                    <Code2 size={19} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-white tracking-tight">Cuplikan Kode</div>
                    <div className="text-[11.5px] text-slate-300/70">Kirim script program atau baris perintah terminal</div>
                  </div>
                </button>
              </div>

              {/* iOS Liquid Glass Cancel Button */}
              <button
                onClick={() => setAttachmentSheetOpen(false)}
                className="w-full py-3.5 liquid-glass-btn active:scale-[0.98] rounded-2xl text-[15px] font-semibold text-[#007AFF] transition-all text-center hover:text-blue-400"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Code Snippet Input Modal with Liquid Glass */}
        {codeModalOpen && (
          <div
            onClick={() => setCodeModalOpen(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[6px] animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md liquid-glass-sheet rounded-3xl p-4.5 shadow-2xl space-y-3 animate-in zoom-in-95 duration-200 relative"
            >
              <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                    <Code2 size={16} />
                  </div>
                  <span className="text-[15px] font-semibold text-white tracking-tight">Cuplikan Kode</span>
                </div>
                <button
                  onClick={() => setCodeModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.14] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <textarea
                rows={6}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Tempel script atau perintah terminal di sini..."
                className="w-full bg-black/40 text-xs font-mono text-emerald-300 placeholder-slate-400 p-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-blue-500/60 resize-none leading-relaxed shadow-inner"
              />

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setCodeModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] rounded-xl text-xs font-medium text-slate-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendCodeSnippet}
                  disabled={!codeSnippet.trim()}
                  className="flex-1 py-2.5 bg-[#007AFF] hover:bg-blue-600 disabled:opacity-40 rounded-xl text-xs font-semibold text-white transition-all shadow-md active:scale-95"
                >
                  Kirim Kode
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bot Profile Editor Modal (Liquid Glass Style) */}
        {editBotModalOpen && (
          <div
            onClick={() => setEditBotModalOpen(false)}
            className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/55 backdrop-blur-[6px] animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm liquid-glass-sheet rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative"
            >
              <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

              {/* Header Modal */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                    <Edit3 size={15} />
                  </div>
                  <span className="text-[15px] font-semibold text-white tracking-tight">Ubah Profil Bot</span>
                </div>
                <button
                  onClick={() => setEditBotModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.14] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Avatar Uploader Preview */}
              <div className="flex flex-col items-center justify-center gap-2 pt-1">
                <div className="relative group cursor-pointer" onClick={() => avatarUploadRef.current?.click()}>
                  <img
                    src={editBotAvatar || thread.avatar}
                    alt="Bot Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-xl group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Camera size={20} />
                  </div>
                </div>
                <input
                  type="file"
                  ref={avatarUploadRef}
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />
                <button
                  onClick={() => avatarUploadRef.current?.click()}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Ganti Foto Avatar
                </button>
              </div>

              {/* Form Input: Name & Role */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Nama Bot
                  </label>
                  <input
                    type="text"
                    value={editBotName}
                    onChange={(e) => setEditBotName(e.target.value)}
                    placeholder="Nama bot..."
                    className="w-full bg-black/40 text-[13px] text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Peran / Deskripsi
                  </label>
                  <input
                    type="text"
                    value={editBotRole}
                    onChange={(e) => setEditBotRole(e.target.value)}
                    placeholder="Peran bot (misal: Logika & Solusi)..."
                    className="w-full bg-black/40 text-[13px] text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/60 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Ukuran Avatar
                    </label>
                    <span className="font-mono text-xs text-blue-400 font-semibold">
                      {editBotAvatarSize}px
                    </span>
                  </div>

                  {/* Preset Pills */}
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {[
                      { label: 'Kecil', size: 32 },
                      { label: 'Sedang', size: 36 },
                      { label: 'Besar', size: 44 },
                    ].map((p) => (
                      <button
                        key={p.size}
                        type="button"
                        onClick={() => setEditBotAvatarSize(p.size)}
                        className={`py-1 rounded-lg text-xs font-medium transition-all ${
                          editBotAvatarSize === p.size
                            ? 'bg-blue-600 text-white shadow-sm border border-white/20'
                            : 'bg-white/[0.05] text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {p.label} ({p.size}px)
                      </button>
                    ))}
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min="30"
                    max="52"
                    value={editBotAvatarSize}
                    onChange={(e) => setEditBotAvatarSize(Number(e.target.value))}
                    className="w-full accent-[#007AFF] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    URL Avatar (Opsional)
                  </label>
                  <input
                    type="text"
                    value={editBotAvatar.startsWith('data:') ? '' : editBotAvatar}
                    onChange={(e) => setEditBotAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-black/40 text-[12px] font-mono text-white placeholder-slate-500 px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/60 transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={() => setEditBotModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] rounded-xl text-xs font-medium text-slate-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveBotProfile}
                  disabled={!editBotName.trim()}
                  className="flex-1 py-2.5 bg-[#007AFF] hover:bg-blue-600 disabled:opacity-40 rounded-xl text-xs font-semibold text-white transition-all shadow-md active:scale-95"
                >
                  Simpan Profil
                </button>
              </div>
            </div>
          </div>
        )}
        {/* iOS Long-Press Context Menu Overlay */}
        {contextMessage && (
          <div
            onClick={() => setContextMessage(null)}
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200"
            >
              {/* iOS Tapback Reaction Bar */}
              <div className="flex items-center gap-1.5 p-1.5 liquid-glass-sheet rounded-full shadow-2xl">
                {['❤️', '👍', '👎', '🔥', '😂', '❗️'].map((reaction) => (
                  <button
                    key={reaction}
                    onClick={() => handleContextAction('copy', reaction)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-white/10 active:scale-125 transition-transform"
                  >
                    {reaction}
                  </button>
                ))}
              </div>

              {/* Highlighted Message Preview */}
              <div
                className={`max-w-[90%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-2xl border border-white/20 select-text ${
                  contextMessage.sender === 'user'
                    ? 'ios-bubble-user'
                    : 'ios-bubble-agent'
                }`}
              >
                {contextMessage.text || 'Lampiran / Media'}
              </div>

              {/* iOS Context Action Menu List */}
              <div className="w-56 liquid-glass-sheet rounded-2xl overflow-hidden divide-y divide-white/[0.08] shadow-2xl">
                <button
                  onClick={() => handleContextAction('reply')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.08] active:bg-white/10 transition-colors text-xs font-medium text-slate-200"
                >
                  <span>Balas Pesan</span>
                  <CornerUpLeft size={16} className="text-blue-400" />
                </button>

                <button
                  onClick={() => handleContextAction('copy')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.08] active:bg-white/10 transition-colors text-xs font-medium text-slate-200"
                >
                  <span>Salin Teks</span>
                  <Copy size={16} className="text-sky-400" />
                </button>

                <button
                  onClick={() => handleContextAction('pin')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.08] active:bg-white/10 transition-colors text-xs font-medium text-slate-200"
                >
                  <span>Sematkan</span>
                  <Pin size={16} className="text-amber-400" />
                </button>

                <button
                  onClick={() => handleContextAction('delete')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-rose-500/10 active:bg-rose-500/15 transition-colors text-xs font-medium text-rose-400"
                >
                  <span>Hapus Pesan</span>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW: UTAMA NAXX WORKSTATION (BERANDA & TAB VIEW)
  // =========================================================================
  const threadList = Object.values(threads).filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[100dvh] w-full ios-glass-bg text-white overflow-hidden select-none relative">
      {/* iOS Ambient background orbs */}
      <div className="absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* 1. Header iOS Liquid Glass */}
      <header className="px-4 pt-3 pb-3 bg-[#0E1524]/75 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.3)] z-20">
        {isSearching ? (
          <div className="flex-1 flex items-center gap-2 bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari agen atau pesan..."
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Batal
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[19px] font-semibold text-white tracking-tight">
                Naxx Workstation
              </h1>
            </div>
            <div className="flex items-center gap-1.5 relative">
              <button
                onClick={() => setIsSearching(true)}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 transition-all border border-white/[0.06]"
                aria-label="Cari"
              >
                <Search size={16} />
              </button>
              <button
                onClick={() => setHomeMenuOpen((prev) => !prev)}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 transition-all border border-white/[0.06]"
                aria-label="Pengaturan Lanjutan"
              >
                <MoreVertical size={16} />
              </button>

              {/* Home Popover Menu */}
              {homeMenuOpen && (
                <div className="absolute top-10 right-0 w-48 bg-[#18202D]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('pengaturan');
                      setHomeMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Settings size={15} className="text-blue-400" />
                    <span>Buka Gateway Info</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('Semua agen dalam kondisi aktif');
                      setHomeMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <ShieldCheck size={15} className="text-emerald-400" />
                    <span>Periksa Status Node</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </header>

      {/* 2. iOS Segmented Filter Pill */}
      {activeTab === 'obrolan' && (
        <div className="px-4 pt-2 pb-1 z-10">
          <div className="flex p-1 rounded-2xl ios-segmented-track max-w-sm">
            <button
              onClick={() => setFolderTab('agent')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200 ${
                folderTab === 'agent'
                  ? 'bg-white/[0.12] text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Agents</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                folderTab === 'agent'
                  ? 'bg-blue-500/25 text-blue-300'
                  : 'bg-white/[0.06] text-slate-400'
              }`}>
                {threadList.length}
              </span>
            </button>
            <button
              onClick={() => setFolderTab('all')}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200 ${
                folderTab === 'all'
                  ? 'bg-white/[0.12] text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua Obrolan
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Body Scrollable */}
      <main className="flex-1 overflow-y-auto touch-scroll pb-28 px-3 pt-2 z-10">
        {/* TAB 1: LIST OBROLAN DENGAN KARTU LIQUID GLASS */}
        {activeTab === 'obrolan' && (
          <div className="space-y-2">
            {threadList.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveChat(thread.id)}
                className="group relative flex items-center gap-3.5 p-3 rounded-2xl liquid-glass hover:bg-white/[0.08] active:scale-[0.99] cursor-pointer transition-all duration-200"
              >
                {/* Specular edge top */}
                <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {/* Avatar with iOS Glow Ring */}
                <div className="relative flex-shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-white/20 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-400 w-3 h-3 rounded-full border-2 border-[#0B0F17] shadow-sm" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-white tracking-tight truncate">
                      {thread.name}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {thread.pinned && (
                        <Pin size={12} className="text-blue-400 rotate-45" />
                      )}
                      <span className="font-mono text-[11px] text-slate-400">{thread.lastTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    {generatingAgent === thread.id ? (
                      <div className="flex items-center gap-1.5 text-blue-400 font-medium text-[12px] flex-1 mr-2 animate-pulse">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ios-dot-1" />
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ios-dot-2" />
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ios-dot-3" />
                        </div>
                        <span>Sedang merespon...</span>
                      </div>
                    ) : (
                      <p className="text-[12.5px] text-slate-300/80 truncate leading-snug flex-1 mr-2 font-normal">
                        {(chatMessages[thread.id] && chatMessages[thread.id].length > 0)
                          ? thread.lastMessage
                          : 'Belum ada pesan'}
                      </p>
                    )}
                    <CheckCheck size={14} className="text-blue-400 flex-shrink-0 opacity-80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PENGATURAN LIQUID GLASS STYLE */}
        {activeTab === 'pengaturan' && (
          <div className="space-y-3.5">
            {/* User Profile Mini Header */}
            <div className="liquid-glass p-4 rounded-3xl flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/20">
                NX
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-semibold text-white tracking-tight">Yehezkiel Nanda Pradana</h2>
                <p className="text-xs text-blue-400 font-medium">@naxx_dev • Online</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">ThinkPad Windows 11 Workstation</p>
              </div>
            </div>

            {/* Group 1: Gateway & Connection */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                Koneksi AI Gateway
              </div>
              <div className="liquid-glass rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu size={17} className="text-blue-400" />
                    <span className="text-xs font-medium text-slate-200">9Router Gateway Port</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-lg">
                    :20128 (Active Proxy)
                  </span>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={17} className="text-blue-400" />
                    <span className="text-xs font-medium text-slate-200">Status Keamanan Gateway</span>
                  </div>
                  <span className="text-xs text-blue-400 font-medium">Terverifikasi Aktif</span>
                </div>
              </div>
            </div>

            {/* Group 2: Connected Nodes */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                Node Terhubung
              </div>
              <div className="liquid-glass rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone size={17} className="text-blue-400" />
                    <div>
                      <div className="text-xs font-medium text-slate-200">Delta Node</div>
                      <div className="text-[11px] text-slate-400">Motorola moto g45 5G (Termux PRoot)</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">Connected</span>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu size={17} className="text-blue-400" />
                    <div>
                      <div className="text-xs font-medium text-slate-200">Nazza Node</div>
                      <div className="text-[11px] text-slate-400">ThinkPad (Windows 11 Localhost)</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROFIL IOS LIQUID GLASS STYLE */}
        {activeTab === 'profil' && (
          <div className="space-y-3.5">
            <div className="liquid-glass p-6 rounded-3xl flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white font-bold text-2xl shadow-xl border border-white/25">
                  NX
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-400 w-4 h-4 rounded-full border-2 border-[#0B0F17]" />
              </div>

              <h2 className="text-[17px] font-semibold text-white mt-3.5 tracking-tight">Yehezkiel Nanda Pradana</h2>
              <p className="text-xs text-blue-400 font-mono mt-0.5">@naxx_dev</p>
              <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed font-normal">
                Owner & Lead Developer of Naxx Workstation. Autonomous multi-agent development coordinator.
              </p>

              {/* Action Buttons iOS Style */}
              <div className="grid grid-cols-3 gap-2.5 w-full mt-5">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Naxx Workstation Profile',
                        text: 'Yehezkiel Nanda Pradana (@naxx_dev) - Naxx Workstation',
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText('https://t.me/naxx_dev');
                      showToast('Tautan profil disalin');
                    }
                  }}
                  className="flex flex-col items-center justify-center py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-2xl text-xs font-medium text-white active:scale-95 transition-all"
                >
                  <Share2 size={16} className="text-blue-400 mb-1" />
                  Bagikan
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText('@naxx_dev');
                    showToast('ID @naxx_dev berhasil disalin!');
                  }}
                  className="flex flex-col items-center justify-center py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-2xl text-xs font-medium text-white active:scale-95 transition-all"
                >
                  <Copy size={16} className="text-blue-400 mb-1" />
                  Salin ID
                </button>

                <button
                  onClick={() => {
                    setNotificationsEnabled((prev) => {
                      const next = !prev;
                      showToast(next ? 'Notifikasi diaktifkan' : 'Notifikasi disenyapkan');
                      return next;
                    });
                  }}
                  className="flex flex-col items-center justify-center py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-2xl text-xs font-medium text-white active:scale-95 transition-all"
                >
                  {notificationsEnabled ? (
                    <Bell size={16} className="text-blue-400 mb-1" />
                  ) : (
                    <BellOff size={16} className="text-rose-400 mb-1" />
                  )}
                  {notificationsEnabled ? 'Notifikasi' : 'Senyap'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. iOS Floating Glass Dock */}
      <div className="fixed bottom-3 inset-x-0 z-50 pointer-events-none px-4">
        <nav className="pointer-events-auto max-w-[260px] mx-auto flex items-center justify-between p-1.5 ios-dock rounded-[24px]">
          <button
            onClick={() => setActiveTab('obrolan')}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-200 active:scale-95 ${
              activeTab === 'obrolan'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'obrolan' && (
              <span className="absolute inset-0 rounded-2xl bg-white/[0.1] border border-white/10 shadow-sm pointer-events-none" />
            )}
            <MessageCircle
              size={19}
              strokeWidth={activeTab === 'obrolan' ? 2.4 : 1.8}
              fill={activeTab === 'obrolan' ? 'currentColor' : 'none'}
            />
            <span className="text-[10.5px] font-medium tracking-tight mt-0.5">Obrolan</span>
          </button>

          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-200 active:scale-95 ${
              activeTab === 'pengaturan'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'pengaturan' && (
              <span className="absolute inset-0 rounded-2xl bg-white/[0.1] border border-white/10 shadow-sm pointer-events-none" />
            )}
            <Settings size={19} strokeWidth={activeTab === 'pengaturan' ? 2.4 : 1.8} />
            <span className="text-[10.5px] font-medium tracking-tight mt-0.5">Setelan</span>
          </button>

          <button
            onClick={() => setActiveTab('profil')}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-200 active:scale-95 ${
              activeTab === 'profil'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'profil' && (
              <span className="absolute inset-0 rounded-2xl bg-white/[0.1] border border-white/10 shadow-sm pointer-events-none" />
            )}
            <User size={19} strokeWidth={activeTab === 'profil' ? 2.4 : 1.8} />
            <span className="text-[10.5px] font-medium tracking-tight mt-0.5">Profil</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
