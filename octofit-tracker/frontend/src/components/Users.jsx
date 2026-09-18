import { useEffect, useState } from 'react';
import { buildApiUrl, normalizeCollection } from '../api.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      try {
        const response = await fetch(buildApiUrl('/api/users/'));
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = await response.json();
        if (!cancelled) {
          setUsers(normalizeCollection(payload));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load users.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-light">Loading users...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row g-3">
      {users.map((user) => (
        <div key={user._id || user.email || user.username} className="col-md-6 col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">{user.displayName || user.username}</h5>
              <p className="card-text mb-1"><strong>Username:</strong> {user.username}</p>
              <p className="card-text mb-1"><strong>Email:</strong> {user.email}</p>
              <p className="card-text mb-0"><strong>Avatar:</strong> {user.avatarUrl || 'N/A'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
