import React, { useEffect, useRef } from 'react';

function ChatBox({ messages }) {
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-box">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                    <span>{message.sender === 'bot' ? 'Bot: ' : 'You: '}</span>
                    {message.image && (
                        <div className="image-preview">
                            <img src={message.image} alt="Preview" />
                        </div>
                    )}
                    {message.text && <p>{message.text}</p>}
                </div>
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
}

export default ChatBox;
