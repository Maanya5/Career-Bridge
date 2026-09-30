import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [apiStatus, setApiStatus] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/test")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setApiStatus({ loading: false, data, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setApiStatus({
            loading: false,
            data: null,
            error: err.message || "Could not reach API. Start the backend on port 5000.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Interview practice and internship matching</p>
          <h1>Ace Your Interviews</h1>
          <p className="lede">
            Practice technical and HR interview questions, build better answers, and get ready for internships
            matched to your skills.
          </p>

          <div className="hero-actions">
            {authLoading ? (
              <>
                <span className="btn btn-primary disabledlike" aria-hidden>
                  Get Started
                </span>
                <span className="btn btn-outline disabledlike" aria-hidden>
                  Login
                </span>
              </>
            ) : user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="card home-card">
        <h2>API check</h2>
        {apiStatus.loading && <p className="muted">Calling /api/test…</p>}
        {!apiStatus.loading && apiStatus.error && (
          <p className="alert alert-error" role="alert">
            <strong>Offline:</strong> {apiStatus.error}
          </p>
        )}
        {!apiStatus.loading && apiStatus.data && (
          <pre className="json">{JSON.stringify(apiStatus.data, null, 2)}</pre>
        )}
      </section>
    </div>
  );
}
