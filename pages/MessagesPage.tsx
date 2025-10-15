import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

const MessagesPage: React.FC = () => {
    const { conversationId } = useParams<{ conversationId: string }>();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-[calc(100vh-14rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 ${conversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
                <ChatList />
            </div>
            <div className={`flex-1 flex-col ${conversationId ? 'flex' : 'hidden md:flex'}`}>
                {conversationId ? (
                    <ChatWindow conversationId={conversationId} />
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                        <div>
                            <i className="fas fa-comments fa-4x mb-4"></i>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
