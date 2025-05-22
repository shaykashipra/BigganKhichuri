import React, { useState, useEffect, useCallback } from 'react';

const TextToSpeech = ({ text, className }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speech, setSpeech] = useState(null);
    const [error, setError] = useState(null);
    const [voices, setVoices] = useState([]);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
        loadVoices();

        return () => {
            if (window.speechSynthesis.onvoiceschanged) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    // Cleanup function
    useEffect(() => {
        return () => {
            if (speech) {
                window.speechSynthesis.cancel();
            }
        };
    }, [speech]);

    const selectVoice = useCallback(() => {
        if (!voices.length) return null;

        // Try to find a preferred voice
        const preferredVoice = voices.find(voice =>
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Daniel') ||
            voice.name.includes('Karen')
        );

        // If no preferred voice, use the first available voice
        return preferredVoice || voices[0];
    }, [voices]);

    const handleSpeak = useCallback(() => {
        try {
            // Check if speech synthesis is supported
            if (!window.speechSynthesis) {
                throw new Error('Speech synthesis is not supported in your browser');
            }

            if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);

            // Configure speech settings
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Set voice
            const selectedVoice = selectVoice();
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            // Event handlers
            utterance.onstart = () => {
                setIsPlaying(true);
                setError(null);
            };
            utterance.onend = () => {
                setIsPlaying(false);
                setSpeech(null);
            };
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                setError('Error playing speech');
                setIsPlaying(false);
                setSpeech(null);
            };

            setSpeech(utterance);
            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.error('Speech synthesis error:', err);
            setError(err.message);
            setIsPlaying(false);
        }
    }, [text, isPlaying, selectVoice]);

    // Handle page visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isPlaying]);

    if (error) {
        return (
            <button
                className={`tts-button error ${className || ''}`}
                onClick={() => setError(null)}
                title={error}
            >
                ⚠️ Speech Unavailable
            </button>
        );
    }

    return (
        <button
            onClick={handleSpeak}
            className={`tts-button ${className || ''}`}
            aria-label={isPlaying ? 'Stop reading' : 'Start reading'}
            title={isPlaying ? 'Stop reading' : 'Read this text aloud'}
        >
            {isPlaying ? '🔊 Stop Reading' : '🔈 Read Aloud'}
        </button>
    );
};

export default TextToSpeech; 