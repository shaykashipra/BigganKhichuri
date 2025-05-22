import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="subtitle">
            {isSignUp
              ? 'Sign up to get started with your account'
              : 'Sign in to access your account'}
          </p>
        </div>
        <form onSubmit={handleAuth} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>
        {message && (
          <div className={`message ${message.includes('confirmation') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <button
          className="toggle-auth"
          onClick={() => setIsSignUp(!isSignUp)}
          disabled={loading}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>

      <style jsx>{`
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 1rem;
                }
                .auth-box {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 2.5rem;
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 420px;
                    backdrop-filter: blur(10px);
                    transition: transform 0.3s ease;
                }
                .auth-box:hover {
                    transform: translateY(-5px);
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .auth-header h2 {
                    color: #1a1a1a;
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }
                .subtitle {
                    color: #666;
                    font-size: 0.95rem;
                }
                .auth-form {
                    margin-bottom: 1.5rem;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: #374151;
                    font-size: 0.9rem;
                }
                .input-wrapper {
                    position: relative;
                }
                input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: #f9fafb;
                    color: #1a1a1a;
                }
                input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    background: #fff;
                }
                input::placeholder {
                    color: #9ca3af;
                }
                input[type="password"] {
                    color: #1a1a1a;
                    -webkit-text-fill-color: #1a1a1a;
                }
                .submit-button {
                    width: 100%;
                    padding: 0.875rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .submit-button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
                }
                .submit-button:disabled {
                    background: #e5e7eb;
                    cursor: not-allowed;
                }
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .toggle-auth {
                    background: none;
                    color: #667eea;
                    border: none;
                    font-size: 0.9rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    transition: color 0.3s ease;
                    text-decoration: none;
                }
                .toggle-auth:hover:not(:disabled) {
                    color: #764ba2;
                    text-decoration: underline;
                }
                .message {
                    margin: 1rem 0;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                .message.success {
                    background-color: #ecfdf5;
                    color: #059669;
                    border: 1px solid #a7f3d0;
                }
                .message.error {
                    background-color: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                }
                @media (max-width: 480px) {
                    .auth-box {
                        padding: 1.5rem;
                    }
                    .auth-header h2 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
    </div>
  )
} 