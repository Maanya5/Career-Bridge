import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user } = useAuth();

  function comingSoon() {
    alert("This feature is coming soon.");
  }

  return (
    <div className="page">
      <div className="dash-head">
        <h1 className="dash-title">Welcome{user?.name ? `, ${user.name}` : ""}!</h1>
        <p className="lede muted">Pick a next step to keep improving your interview readiness.</p>
      </div>

      <section className="dash-grid" aria-label="Dashboard actions">
        <div className="dash-card">
          <h2>Start Interview</h2>
          <p className="muted">Practice technical and HR questions with instant scoring.</p>
          <button type="button" className="btn btn-primary" onClick={comingSoon}>
            Start Interview
          </button>
        </div>

        <div className="dash-card">
          <h2>View Performance</h2>
          <p className="muted">Track your progress and see improvement over time.</p>
          <button type="button" className="btn btn-outline" onClick={comingSoon}>
            View Performance
          </button>
        </div>

        <div className="dash-card">
          <h2>Internship Recommendations</h2>
          <p className="muted">Get internship matches ranked by your saved skills.</p>
          <button type="button" className="btn btn-outline" onClick={comingSoon}>
            See Recommendations
          </button>
        </div>
      </section>
    </div>
  );
}

