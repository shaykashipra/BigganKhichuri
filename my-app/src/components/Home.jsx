import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from './Navbar'
import './Home.css'

export default function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check if user is authenticated and get user data
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                navigate('/')
            } else {
                setUser(session.user)
            }
        }
        checkUser()
    }, [navigate])

    const handleSubjectClick = (subject) => {
        navigate(`/${subject.toLowerCase()}`);
    };

    if (!user) return null

    return (
        <div className="home-container">
            <Navbar user={user} />
            <main className="main-content">
                <section className="hero-section">
                    <h1 className="animate-fade-in">Welcome to BigganKhichuri</h1>
                    <p className="animate-fade-in-delay">Your AI-powered learning companion</p>
                </section>

                <section className="features-section">
                    <div className="feature-card animate-slide-up">
                        <h2>AI Chatbot Support</h2>
                        <p>Get instant help and answers to your questions with our intelligent chatbot assistant</p>
                    </div>
                    <div className="feature-card animate-slide-up-delay">
                        <h2>Read Aloud Feature</h2>
                        <p>Listen to your study materials with our text-to-speech functionality for better understanding</p>
                    </div>
                    <div className="feature-card animate-slide-up-delay-2">
                        <h2>Voice Commands</h2>
                        <p>Navigate and control the platform hands-free using natural voice commands</p>
                    </div>
                    <div className="feature-card animate-slide-up-delay-3">
                        <h2>Offline Access</h2>
                        <p>Download and access your study materials without internet connection</p>
                    </div>
                    <div className="feature-card animate-slide-up-delay-4">
                        <h2>Interactive Simulations</h2>
                        <p>Experience complex concepts through engaging and interactive 3D simulations</p>
                    </div>
                </section>

                <section className="cta-section animate-fade-in">
                    <h2>Ready to Start Learning?</h2>
                    <p>Choose a subject to begin your journey</p>
                    <div className="subject-buttons">
                        <button
                            className="subject-btn animate-bounce"
                            onClick={() => handleSubjectClick('math')}
                        >
                            Mathematics
                        </button>
                        <button
                            className="subject-btn animate-bounce-delay"
                            onClick={() => handleSubjectClick('physics')}
                        >
                            Physics
                        </button>
                        <button
                            className="subject-btn animate-bounce-delay-2"
                            onClick={() => handleSubjectClick('chemistry')}
                        >
                            Chemistry
                        </button>
                        <button
                            className="subject-btn animate-bounce-delay-3"
                            onClick={() => handleSubjectClick('biology')}
                        >
                            Biology
                        </button>
                        <button
                            className="subject-btn animate-bounce-delay-4"
                            onClick={() => handleSubjectClick('environmental-science')}
                        >
                            Environmental Science
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
} 