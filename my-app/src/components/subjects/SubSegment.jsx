import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './SubSegment.css';

const SubSegment = ({ id, title, description, content, simulation, isLiked: initialIsLiked }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLiked, setIsLiked] = useState(initialIsLiked || false);
    const speechRef = useRef(null);

    useEffect(() => {
        // Initialize speech synthesis
        speechRef.current = window.speechSynthesis;

        // Cleanup function to stop speech when component unmounts
        return () => {
            if (speechRef.current) {
                speechRef.current.cancel();
            }
        };
    }, []);

    const handleSpeak = () => {
        if (!speechRef.current) return;

        if (isSpeaking) {
            speechRef.current.cancel();
            setIsSpeaking(false);
            return;
        }

        // Combine title, description, and content for reading
        const textToRead = `${title}. ${description}. ${content || ''}`;

        const utterance = new SpeechSynthesisUtterance(textToRead);

        // Configure speech settings
        utterance.rate = 1.0; // Speed of speech
        utterance.pitch = 1.0; // Pitch of voice
        utterance.volume = 1.0; // Volume

        // Get available voices and set a preferred voice if available
        const voices = speechRef.current.getVoices();
        const preferredVoice = voices.find(voice =>
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.name.includes('Samantha')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Event handlers
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        speechRef.current.speak(utterance);
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        try {
            const newLikeStatus = !isLiked;
            const { error } = await supabase
                .from('content')
                .update({ is_liked: newLikeStatus })
                .eq('id', id);

            if (error) {
                console.error('Error updating like status:', error);
                return;
            }

            setIsLiked(newLikeStatus);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <div className="subsegment">
            <div
                className="subsegment__header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="subsegment__header-left">
                    <button
                        className="expand-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? '−' : '+'}
                    </button>
                    {isExpanded && (
                        <button
                            className="read-aloud-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak();
                            }}
                            title={isSpeaking ? "Stop reading" : "Read aloud"}
                        >
                            {isSpeaking ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="6" y="4" width="12" height="16" rx="2" ry="2" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                            )}
                        </button>
                    )}
                    <button
                        className="like-button"
                        onClick={handleLike}
                        title={isLiked ? "Unlike" : "Like"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={isLiked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                    <h3>{title}</h3>
                </div>
            </div>

            {isExpanded && (
                <div className="subsegment__content">
                    <div className="subsegment__description">
                        {description}
                    </div>

                    {content && (
                        <div className="subsegment__text-content">
                            {content}
                        </div>
                    )}

                    {simulation && (
                        <div className="subsegment__simulation">
                            <div
                                className="simulation-container"
                                dangerouslySetInnerHTML={{ __html: simulation }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubSegment; 