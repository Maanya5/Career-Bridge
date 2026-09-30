import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      await signup({ name, email, password });
      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("/dashboard", { replace: true }), 400);
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card card">
        <h1>Create an account</h1>
        <p className="lede muted">Password must be at least 8 characters.</p>

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
            Name
            <input
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </label>
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
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 8 characters"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <p className="auth-switch">
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
