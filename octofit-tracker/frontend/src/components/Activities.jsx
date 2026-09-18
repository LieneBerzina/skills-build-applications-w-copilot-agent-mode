import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api.js';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchActivities() {
      try {
        const response = await fetch(buildApiUrl('/api/activities/'));
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = await response.json();
        if (!cancelled) {
          setActivities(normalizeCollection(payload));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load activities.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchActivities();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-light">Loading activities...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row g-3">
      {activities.map((activity) => (
        <div key={activity._id} className="col-md-6 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">{activity.type}</h5>
              <p className="card-text mb-1"><strong>User:</strong> {activity.user?.displayName || activity.user?.username || 'Unknown'}</p>
              <p className="card-text mb-1"><strong>Duration:</strong> {activity.durationMinutes} min</p>
              <p className="card-text mb-1"><strong>Calories:</strong> {activity.calories}</p>
              <p className="card-text mb-0"><strong>Date:</strong> {new Date(activity.completedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
