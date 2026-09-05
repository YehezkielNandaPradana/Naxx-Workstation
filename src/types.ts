export type AgentId = 'delta' | 'nazza';

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

export interface MessageItem {
  id: string;
  sender: 'user' | 'agent';
  agentId?: AgentId;
  text: string;
  time: string;
  timestamp?: string;
}

export type Message = MessageItem;
