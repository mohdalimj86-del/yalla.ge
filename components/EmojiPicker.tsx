import React from 'react';

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
  '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦',
  '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
  '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿',
  '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '💔', '💯', '🔥', '👍',
];

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
    return (
        <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl p-2 border border-gray-200 dark:border-gray-600 w-64 h-64 overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
                {emojis.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => onSelect(emoji)}
                        className="text-2xl rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmojiPicker;
