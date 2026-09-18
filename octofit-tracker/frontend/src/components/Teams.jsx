import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api.js';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchTeams() {
      try {
        const response = await fetch(buildApiUrl('/api/teams/'));
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = await response.json();
        if (!cancelled) {
          setTeams(normalizeCollection(payload));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load teams.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTeams();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-light">Loading teams...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row g-3">
      {teams.map((team) => (
        <div key={team._id} className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">{team.name}</h5>
              <p className="card-text">{team.description || 'No description available.'}</p>
              <p className="card-text mb-0"><strong>Members:</strong> {(team.members || []).length}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
