import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" aria-label="CareerBridge home">
          <span className="logo-mark" aria-hidden>
            CB
          </span>
          <span className="logo-text">CareerBridge</span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {loading ? (
            <span className="nav-muted">Loading…</span>
          ) : user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <button type="button" className="nav-btn" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-btn">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

