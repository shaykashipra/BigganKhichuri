import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbox.css';

const ChatboxIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const MicrophoneIcon = ({ isListening }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isListening ? "#ef4444" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

const Chatbox = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceCommandEnabled, setIsVoiceCommandEnabled] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                if (isVoiceCommandEnabled) {
                    // Handle voice commands
                    if (transcript.includes('open chat') || transcript.includes('start chat')) {
                        setIsOpen(true);
                    } else if (transcript.includes('close chat') || transcript.includes('stop chat')) {
                        setIsOpen(false);
                    }
                } else {
                    // Handle voice input for message
                    setMessage(transcript);
                }
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isVoiceCommandEnabled]);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat, isOpen]);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const toggleVoiceCommand = () => {
        setIsVoiceCommandEnabled(!isVoiceCommandEnabled);
        if (isListening) {
            recognitionRef.current.stop();
        }
    };

    const sendMessage = async (e) => {
        e && e.preventDefault();
        if (!message.trim()) return;

        const userMsg = { sender: 'You', text: message };
        setChat((prev) => [...prev, userMsg]);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/predict', { message });
            setChat((prev) => [
                ...prev,
                { sender: 'Bot', text: response.data.answer }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
            setChat((prev) => [
                ...prev,
                { sender: 'Bot', text: 'Sorry, there was an error connecting to the server.' }
            ]);
        }
    };

    return (
        <div className="chatbox">
            <div className={`chatbox__support${isOpen ? ' chatbox--active' : ''}`} style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
                <div className="chatbox__header">
                    <div className="chatbox__header-left">
                        <div className="chatbox__image--header">
                            <ChatboxIcon />
                        </div>
                        <div className="chatbox__content--header">
                            <h4 className="chatbox__heading--header">AI Chat Assistant</h4>
                            <p className="chatbox__description--header">
                                Hi! I'm your AI assistant.
                                {isVoiceCommandEnabled ?
                                    " Voice commands enabled. Say 'open chat' or 'close chat'." :
                                    " Click the microphone icon to enable voice commands."}
                            </p>
                        </div>
                    </div>
                    <button
                        className={`voice-command-toggle ${isVoiceCommandEnabled ? 'active' : ''}`}
                        onClick={toggleVoiceCommand}
                        title={isVoiceCommandEnabled ? "Disable voice commands" : "Enable voice commands"}
                    >
                        <MicrophoneIcon isListening={isVoiceCommandEnabled} />
                    </button>
                </div>
                <div className="chatbox__messages">
                    <div className="messages__container">
                        {chat.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`messages__item ${msg.sender === 'You' ? 'messages__item--operator' : 'messages__item--visitor'}`}
                                style={{ textAlign: msg.sender === 'You' ? 'right' : 'left' }}
                            >
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <form className="chatbox__footer" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        onKeyDown={e => { if (e.key === 'Enter') sendMessage(e); }}
                    />
                    <button
                        type="button"
                        className={`voice-input-button ${isListening ? 'listening' : ''}`}
                        onClick={toggleVoiceInput}
                        title={isListening ? "Stop listening" : "Start voice input"}
                    >
                        <MicrophoneIcon isListening={isListening} />
                    </button>
                    <button type="submit" className="chatbox__send--footer send__button">Send</button>
                </form>
            </div>
            <div className="chatbox__button">
                <button
                    onClick={() => setIsOpen(open => !open)}
                    className={isVoiceCommandEnabled ? 'voice-command-enabled' : ''}
                    aria-label="Open chat"
                >
                    <ChatboxIcon />
                </button>
            </div>
        </div>
    );
};

export default Chatbox; 