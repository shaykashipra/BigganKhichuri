import React from 'react';
import './SubjectPage.css';

const SubjectPage = ({ title, description, topics }) => {
    return (
        <div className="subject-page">
            <div className="subject-header">
                <h1>{title}</h1>
                <p className="subject-description">{description}</p>
            </div>

            <div className="subject-content">
                <div className="topics-grid">
                    {topics.map((topic, index) => (
                        <div key={index} className="topic-card">
                            <h3>{topic.title}</h3>
                            <p>{topic.description}</p>
                            <button className="topic-button">Start Learning</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubjectPage; 