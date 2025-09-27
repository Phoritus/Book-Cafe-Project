export function getApiBase() {
  return import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || '';
}
