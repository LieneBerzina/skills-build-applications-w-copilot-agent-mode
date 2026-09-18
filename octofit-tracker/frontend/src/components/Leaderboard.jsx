import { useEffect, useState } from 'react';
import { normalizeCollection } from '../api.js';

const leaderboardApiUrl = import.meta.env.VITE_CODESPACE_NAME?.trim()
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchLeaderboard() {
      try {
        const response = await fetch(leaderboardApiUrl);
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = await response.json();
        if (!cancelled) {
          setEntries(normalizeCollection(payload));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load leaderboard.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchLeaderboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-light">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="list-group">
      {entries.map((entry) => (
        <div key={entry._id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">#{entry.rank || 'N/A'} {entry.user?.displayName || entry.user?.username || 'Unknown user'}</h5>
            <small className="text-muted">{entry.team?.name || 'No team'}</small>
          </div>
          <span className="badge bg-primary rounded-pill">{entry.points} pts</span>
        </div>
      ))}
    </div>
  );
}
