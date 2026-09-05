export type AgentId = 'delta' | 'nazza';

export interface ToolAction {
  type: 'reading' | 'editing' | 'writing' | 'terminal';
  title: string;
  detail: string;
  badge?: string;
  command?: string;
  status?: 'running' | 'completed';
  diff?: string;
  output?: string;
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'agent';
  agentId?: AgentId;
  text: string;
  time: string;
  timestamp?: string;
  msgId?: string; // misal "ID 2957"
  actions?: ToolAction[];
}

export interface ChatThread {
  id: AgentId;
  name: string;
  avatar: string;
  role: string;
  device: string;
  lastMessage: string;
  lastTime: string;
  pinned?: boolean;
  unreadCount?: number;
  online: boolean;
  avatarSize?: number; // Header size in px (e.g., 36, 40, 44)
}

export type Message = MessageItem;
