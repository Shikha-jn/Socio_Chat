// src/hooks/useChatStore.ts

import { useState, useCallback, createContext, useContext } from 'react';
import { Message, Conversation } from '../types';
import { conversations as initConvs, initialMessages, currentUser } from '../data/mockData';

interface ChatStore {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
  getMessages: (conversationId: string) => Message[];
  totalUnread: number;
}

let _conversations = [...initConvs];
let _messages: Record<string, Message[]> = { ...initialMessages };
const listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

export function sendMessageGlobal(conversationId: string, text: string) {
  const newMsg: Message = {
    id: `msg_${Date.now()}`,
    conversationId,
    senderId: currentUser.id,
    text,
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'text',
  };

  _messages = {
    ..._messages,
    [conversationId]: [...(_messages[conversationId] || []), newMsg],
  };

  _conversations = _conversations.map(conv => {
    if (conv.id === conversationId) {
      return { ...conv, lastMessage: newMsg };
    }
    return conv;
  });

  // Simulate a reply after 1-3 seconds
  const conv = _conversations.find(c => c.id === conversationId);
  const otherUser = conv?.participants.find(p => p.id !== currentUser.id);
  if (otherUser) {
    const replies = [
      "That's so interesting! Tell me more 😊",
      "Haha I love that! 😂",
      "Really?! I had no idea",
      "We should definitely do that sometime",
      "Agreed! You read my mind ✨",
      "Ok now I'm smiling 😄",
      "Same! I feel like we vibe so well",
      "Wait, seriously?? That's amazing",
    ];
    const delay = 1200 + Math.random() * 2000;
    setTimeout(() => {
      const replyMsg: Message = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId: otherUser.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'text',
      };
      _messages = {
        ..._messages,
        [conversationId]: [...(_messages[conversationId] || []), replyMsg],
      };
      _conversations = _conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, lastMessage: replyMsg, unreadCount: conv.unreadCount };
        }
        return conv;
      });
      notify();
    }, delay);
  }

  notify();
}

export function markAsReadGlobal(conversationId: string) {
  _conversations = _conversations.map(conv => {
    if (conv.id === conversationId) {
      return { ...conv, unreadCount: 0 };
    }
    return conv;
  });
  notify();
}

export function useChatStore(): ChatStore {
  const [, forceUpdate] = useState(0);

  const subscribe = useCallback(() => {
    const fn = () => forceUpdate(n => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);

  // Subscribe on first render
  useState(() => subscribe());

  const totalUnread = _conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return {
    conversations: _conversations,
    messages: _messages,
    sendMessage: sendMessageGlobal,
    markAsRead: markAsReadGlobal,
    getMessages: (id) => _messages[id] || [],
    totalUnread,
  };
}
