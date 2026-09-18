import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api.js';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchWorkouts() {
      try {
        const response = await fetch(buildApiUrl('/api/workouts/'));
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = await response.json();
        if (!cancelled) {
          setWorkouts(normalizeCollection(payload));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load workouts.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchWorkouts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-light">Loading workouts...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row g-3">
      {workouts.map((workout) => (
        <div key={workout._id} className="col-md-6 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">{workout.name}</h5>
              <p className="card-text mb-1"><strong>Target:</strong> {workout.target}</p>
              <p className="card-text mb-1"><strong>Difficulty:</strong> {workout.difficulty}</p>
              <p className="card-text mb-1"><strong>Duration:</strong> {workout.durationMinutes} min</p>
              <p className="card-text mb-0">{workout.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
