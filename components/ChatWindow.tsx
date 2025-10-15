import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import EmojiPicker from './EmojiPicker';

const ChatWindow: React.FC<{ conversationId: string }> = ({ conversationId }) => {
    const { conversations, messages, getOtherParticipant, sendMessage, markAsRead } = useMessages();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [text, setText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const conversation = conversations.find(c => c.id === conversationId);
    const otherParticipant = conversation ? getOtherParticipant(conversation) : null;
    const conversationMessages = messages[conversationId] || [];

    useEffect(() => {
        // Mark as read when component mounts or conversation changes
        markAsRead(conversationId);
    }, [conversationId, markAsRead]);

    useEffect(() => {
        // Scroll to the bottom of the message list
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages]);
    
     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setIsEmojiPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!conversation || !otherParticipant || !user) {
        return (
             <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <p>Conversation not found.</p>
            </div>
        );
    }
    
    const handleSend = () => {
        if (text.trim()) {
            sendMessage(conversationId, text.trim());
            setText('');
            setIsEmojiPickerOpen(false);
        }
    };
    
    const handleEmojiSelect = (emoji: string) => {
        setText(prev => prev + emoji);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                 <button onClick={() => navigate('/messages')} className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <img
                    className="h-10 w-10 rounded-full object-cover mr-3"
                    src={otherParticipant.picture || `https://ui-avatars.com/api/?name=${otherParticipant.name}&background=random`}
                    alt={otherParticipant.name}
                />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{otherParticipant.name}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                <div className="space-y-4">
                    {conversationMessages.map(msg => {
                        const isMe = msg.senderId === user.id || msg.senderId === 'currentUser';
                        return (
                             <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {!isMe && (
                                    <img src={otherParticipant.picture} alt={otherParticipant.name} className="h-6 w-6 rounded-full"/>
                                )}
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isMe ? 'bg-sky-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                             </div>
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
                <div className="relative flex items-center">
                    <div className="relative" ref={emojiPickerRef}>
                        <button 
                            onClick={() => setIsEmojiPickerOpen(prev => !prev)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <i className="far fa-smile text-xl"></i>
                        </button>
                        {isEmojiPickerOpen && <EmojiPicker onSelect={handleEmojiSelect} />}
                    </div>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button onClick={handleSend} className="ml-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-colors disabled:opacity-50" disabled={!text.trim()}>
                       <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
