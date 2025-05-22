import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './IdeasList.css';

const IdeasList = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('ideaTable')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setIdeas(data || []);
        } catch (err) {
            setError('Failed to fetch ideas: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === ideas.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? ideas.length - 1 : prevIndex - 1
        );
    };

    if (loading) return <div className="ideas-loading">Loading ideas...</div>;
    if (error) return <div className="ideas-error">{error}</div>;
    if (ideas.length === 0) return <div className="no-ideas">No ideas shared yet!</div>;

    const currentIdea = ideas[currentIndex];

    return (
        <div className="ideas-container">
            <div className="ideas-slider">
                <button
                    className="slider-button prev-button"
                    onClick={handlePrevious}
                    aria-label="Previous idea"
                >
                    ↑
                </button>

                <div className="idea-card">
                    <h2>{currentIdea.Title}</h2>
                    <p className="idea-description">{currentIdea.Description}</p>
                    <div className="idea-meta">
                        <span className="idea-author">Shared by: {currentIdea.email}</span>
                        {currentIdea.google_drive_link && (
                            <a
                                href={currentIdea.google_drive_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="drive-link"
                            >
                                View on Google Drive
                            </a>
                        )}
                    </div>
                </div>

                <button
                    className="slider-button next-button"
                    onClick={handleNext}
                    aria-label="Next idea"
                >
                    ↓
                </button>
            </div>

            <div className="slider-indicator">
                {ideas.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default IdeasList; 