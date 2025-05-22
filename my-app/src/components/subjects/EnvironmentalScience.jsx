import React, { useState, useEffect } from 'react';
import SubSegment from './SubSegment';
import ContentForm from './ContentForm';
import { supabase } from '../../lib/supabase';
import './EnvironmentalScience.css';

const SUBJECT = 'environmental_science';

const EnvironmentalScience = ({ user }) => {
    const [showForm, setShowForm] = useState(false);
    const [subsegments, setSubsegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAdmin = user?.email === 'hamimkhandakar222@gmail.com';

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('content')
                .select('*')
                .eq('subject', SUBJECT)
                .order('id', { ascending: true });
            if (error) {
                setError('Failed to fetch content.');
                setSubsegments([]);
            } else {
                setSubsegments(data);
            }
            setLoading(false);
        };
        fetchContent();
    }, []);

    const handleAddContent = async (newContent) => {
        setError(null);
        const contentToInsert = {
            title: newContent.title,
            description: newContent.description,
            content: newContent.content,
            html: newContent.simulation || newContent.html || '',
            subject: SUBJECT
        };
        const { error: dbError } = await supabase
            .from('content')
            .insert([contentToInsert]);

        if (dbError) {
            setError('Failed to add content.');
        } else {
            // Refetch content after adding
            const { data: updatedData } = await supabase
                .from('content')
                .select('*')
                .eq('subject', SUBJECT)
                .order('id', { ascending: true });
            setSubsegments(updatedData || []);
            setShowForm(false);
        }
    };

    return (
        <div className="environmental-science-container">
            <div className="environmental-science-header">
                <h1>Environmental Science</h1>
                {isAdmin && (
                    <button
                        className="add-content-button"
                        onClick={() => setShowForm(true)}
                    >
                        Add New Content
                    </button>
                )}
            </div>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="subsegments-container">
                    {subsegments.map(subsegment => (
                        <SubSegment
                            key={subsegment.id}
                            id={subsegment.id}
                            title={subsegment.title}
                            description={subsegment.description}
                            content={subsegment.content}
                            simulation={subsegment.html}
                            isLiked={subsegment.is_liked}
                        />
                    ))}
                </div>
            )}
            {showForm && (
                <ContentForm
                    onSubmit={handleAddContent}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default EnvironmentalScience; 