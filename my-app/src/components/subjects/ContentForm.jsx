import React, { useState } from 'react';
import './ContentForm.css';

const ContentForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        simulation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            title: '',
            description: '',
            content: '',
            simulation: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="content-form-overlay">
            <div className="content-form">
                <h2>Add New Content</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter description"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Enter content (supports markdown)"
                            rows="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="simulation">Simulation HTML</label>
                        <textarea
                            id="simulation"
                            name="simulation"
                            value={formData.simulation}
                            onChange={handleChange}
                            placeholder="Enter HTML code for simulation"
                            rows="6"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Add Content
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContentForm; 