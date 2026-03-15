// src/types/index.ts

export interface User {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio?: string;
  isOnline?: boolean;
  lastSeen?: string;
  tags?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'gif';
  imageUri?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isMatch: boolean;
  matchedAt?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ChatDetail: { conversationId: string; user: User };
  Profile: { userId: string };
  EditProfile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Likes: undefined;
  Chats: undefined;
  Feed: undefined;
  ProfileTab: undefined;
};
