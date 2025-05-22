import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Navbar.css'

const Navbar = ({ user }) => {
    const navigate = useNavigate()
    const isAdmin = user?.email === 'hamimkhandakar222@gmail.com'

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            navigate('/')
        } catch (error) {
            console.error('Error signing out:', error.message)
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar__container">
                <div className="navbar__left">
                    <Link to="/home" className="navbar__logo">
                        BigganKhichuri
                    </Link>
                </div>
                <div className="navbar__right">
                    <div className="navbar__subjects">
                        <Link to="/math" className="navbar__link">Math</Link>
                        <Link to="/physics" className="navbar__link">Physics</Link>
                        <Link to="/chemistry" className="navbar__link">Chemistry</Link>
                        <Link to="/biology" className="navbar__link">Biology</Link>
                        <Link to="/environmental-science" className="navbar__link">Environmental Science</Link>
                        {isAdmin ? (
                            <Link to="/ideas" className="navbar__link">Ideas</Link>
                        ) : (
                            <Link to="/share-idea" className="navbar__link">Share Idea</Link>
                        )}
                        <Link to="/game" className="navbar__link">Game</Link>
                    </div>
                    {user && (
                        <button
                            onClick={handleSignOut}
                            className="sign-out-button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar 