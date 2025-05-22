import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { supabase } from '../lib/supabase';
import './ShareIdea.css';

export default function ShareIdea() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        googleDriveLink: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get current user on component mount
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/');
            } else {
                setUser(user);
            }
        };
        getUser();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Save idea to ideaTable in database
            const { data, error: dbError } = await supabase
                .from('ideaTable')
                .insert([
                    {
                        Title: formData.title,
                        Description: formData.description,
                        //category: formData.category,
                        email: user.email,
                        google_drive_link: formData.googleDriveLink
                    }
                ])
                .select(); // This will return the inserted row

            if (dbError) {
                console.error('Database error:', dbError);
                throw new Error('Failed to save idea: ' + dbError.message);
            }

            setSubmitted(true);
            setFormData({
                title: '',
                description: '',
                category: 'general',
                googleDriveLink: ''
            });

            setTimeout(() => {
                navigate('/home');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to submit idea. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    if (submitted) {
        return (
            <div className="share-idea-container">
                <Navbar user={user} />
                <div className="success-message">
                    <h2>Thank you for sharing your idea!</h2>
                    <p>Redirecting to home page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="share-idea-container">
            <Navbar user={user} />
            <main className="share-idea-content">
                <h1>Share Your Idea</h1>
                <form onSubmit={handleSubmit} className="idea-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter a title for your idea"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="general">General</option>
                            <option value="technology">Technology</option>
                            <option value="business">Business</option>
                            <option value="social">Social</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Describe your idea in detail"
                            rows="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="googleDriveLink">Google Drive Link (Optional)</label>
                        <input
                            type="url"
                            id="googleDriveLink"
                            name="googleDriveLink"
                            value={formData.googleDriveLink || ''}
                            onChange={e => setFormData(prev => ({ ...prev, googleDriveLink: e.target.value }))}
                            placeholder="Paste your Google Drive link here"
                            pattern="https?://drive\.google\.com/.*"
                        />
                        <small>Paste a valid Google Drive share link (optional)</small>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Share Idea'}
                    </button>
                </form>
            </main>
        </div>
    );
} 