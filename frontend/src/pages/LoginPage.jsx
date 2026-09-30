import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await login(email, password);
      setSuccess("Login successful! Redirecting…");
      setTimeout(() => navigate("/dashboard", { replace: true }), 400);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <h1>Log in</h1>
        <p className="lede muted">Welcome back. Sign in to start practicing.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="status">
              {success}
            </div>
          )}
          <label className="field">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          No account? <Link to="/signup">Sign up</Link>
        </p>
        <p className="auth-switch">
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
