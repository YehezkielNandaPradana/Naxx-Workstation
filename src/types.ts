export type AgentId = 'delta' | 'nazza';

export interface ToolAction {
  type: 'reading' | 'editing' | 'terminal';
  title: string;
  detail: string;
  badge?: string;
  command?: string;
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
}

export type Message = MessageItem;
