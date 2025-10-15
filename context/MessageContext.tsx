import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Conversation, Message, User } from '../types';
import { mockConversations, mockMessages, mockUsers } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

interface MessageContextType {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  getOtherParticipant: (conversation: Conversation) => Omit<User, 'email' | 'verified'> | null;
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

const CONVERSATIONS_STORAGE_KEY = 'userConversations';
const MESSAGES_STORAGE_KEY = 'userMessages';

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});

  useEffect(() => {
    // In a real app, you would fetch this data from a server.
    // Here, we load from local storage or initialize with mock data.
    try {
      const storedConvos = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      const storedMsgs = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedConvos && storedMsgs) {
        setConversations(JSON.parse(storedConvos));
        setMessages(JSON.parse(storedMsgs));
      } else {
        setConversations(mockConversations);
        setMessages(mockMessages);
        localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(mockConversations));
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(mockMessages));
      }
    } catch (error) {
      console.error("Failed to load messages from local storage", error);
      setConversations(mockConversations);
      setMessages(mockMessages);
    }
  }, []);

  const getOtherParticipant = useCallback((conversation: Conversation): Omit<User, 'email' | 'verified'> | null => {
    if (!user) return null;
    const otherId = conversation.participantIds.find(id => id !== user.id && id !== 'currentUser');
    return otherId ? mockUsers[otherId] : null;
  }, [user]);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!user) return;

    const otherParticipant = getOtherParticipant(conversations.find(c => c.id === conversationId)!);
    if (!otherParticipant) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: user.id,
      text,
      createdAt: new Date().toISOString(),
      read: true,
    };
    
    // Update state and local storage
    setMessages(prev => {
        const updatedMessages = {
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), newMessage]
        };
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
        return updatedMessages;
    });

    setConversations(prev => {
        const updatedConvos = prev.map(convo => 
            convo.id === conversationId ? { ...convo, lastMessage: newMessage } : convo
        );
        // Move updated conversation to the top
        const targetConvo = updatedConvos.find(c => c.id === conversationId)!;
        const otherConvos = updatedConvos.filter(c => c.id !== conversationId);
        const finalConvos = [targetConvo, ...otherConvos];
        localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(finalConvos));
        return finalConvos;
    });
    
    // Simulate a reply after a short delay
    setTimeout(() => {
        const replyMessage: Message = {
            id: `msg_${Date.now() + 1}`,
            conversationId,
            senderId: otherParticipant.id,
            text: `Thanks for your message! I'll get back to you soon. You said: "${text}"`,
            createdAt: new Date().toISOString(),
            read: false,
        };

        setMessages(prev => {
            const updatedMessages = {
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), replyMessage]
            };
            localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        setConversations(prev => {
            const updatedConvos = prev.map(convo => 
                convo.id === conversationId 
                ? { ...convo, lastMessage: replyMessage, unreadCount: (convo.unreadCount || 0) + 1 } 
                : convo
            );
            localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(updatedConvos));
            return updatedConvos;
        });

    }, 1500);

  }, [user, conversations, getOtherParticipant]);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => {
        const updatedConvos = prev.map(convo => 
            convo.id === conversationId ? { ...convo, unreadCount: 0 } : convo
        );
        localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(updatedConvos));
        return updatedConvos;
    });
    // Also mark individual messages as read
    setMessages(prev => {
        const convoMessages = prev[conversationId] || [];
        const updatedMessages = convoMessages.map(msg => ({ ...msg, read: true }));
        const newMessagesState = { ...prev, [conversationId]: updatedMessages };
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(newMessagesState));
        return newMessagesState;
    });
  }, []);

  return (
    <MessageContext.Provider value={{ conversations, messages, getOtherParticipant, sendMessage, markAsRead }}>
      {children}
    </MessageContext.Provider>
  );
};
