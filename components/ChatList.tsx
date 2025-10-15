import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { Conversation } from '../types';

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `now`;
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h`;
    interval = seconds / 60;
    return `${Math.floor(interval)}m`;
};

const ChatListItem: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
    const { getOtherParticipant } = useMessages();
    const { user } = useAuth();
    const otherParticipant = getOtherParticipant(conversation);

    if (!otherParticipant || !conversation.lastMessage) return null;

    const isLastMessageFromMe = conversation.lastMessage.senderId === user?.id || conversation.lastMessage.senderId === 'currentUser';
    const lastMessageText = `${isLastMessageFromMe ? 'You: ' : ''}${conversation.lastMessage.text}`;

    return (
        <NavLink
            to={`/messages/${conversation.id}`}
            className={({ isActive }) =>
                `flex items-center p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-sky-100 dark:bg-sky-900/50' : ''
                }`
            }
        >
            <div className="relative flex-shrink-0 mr-3">
                <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={otherParticipant.picture || `https://ui-avatars.com/api/?name=${otherParticipant.name}&background=random`}
                    alt={otherParticipant.name}
                />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{otherParticipant.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                        {timeSince(new Date(conversation.lastMessage.createdAt))}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                     <p className="text-sm text-gray-500 dark:text-gray-400 truncate pr-2">
                        {lastMessageText}
                    </p>
                    {conversation.unreadCount && conversation.unreadCount > 0 ? (
                        <span className="flex-shrink-0 h-5 w-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                        </span>
                    ) : null}
                </div>
            </div>
        </NavLink>
    );
};


const ChatList: React.FC = () => {
    const { conversations } = useMessages();
    const { conversationId } = useParams();

    return (
        <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav>
                    {conversations.map(convo => (
                        <ChatListItem key={convo.id} conversation={convo} />
                    ))}
                </nav>
            </div>
        </>
    );
};

export default ChatList;
