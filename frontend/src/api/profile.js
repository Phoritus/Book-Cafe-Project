import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

function authHeader() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchProfile() {
  const res = await axios.get(`${API_BASE}/profile`, { headers: authHeader() });
  return res.data.profile;
}

export async function updateProfileApi(changes) {
  const res = await axios.put(`${API_BASE}/profile`, changes, { headers: authHeader() });
  return res.data.profile;
}
