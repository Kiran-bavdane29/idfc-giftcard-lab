const baseUrl = 'http://127.0.0.1:5000/api/v1';

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} returned ${response.status}`);
  }

  return body;
}

async function main() {
  const health = await request('/health');
  if (health.status !== 'ok') {
    throw new Error('Health endpoint did not return status "ok"');
  }
  console.log('PASS  API health');

  const login = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'alice', password: 'alice123' }),
  });
  if (typeof login.token !== 'string' || login.token.length === 0) {
    throw new Error('Demo login did not return an access token');
  }
  console.log('PASS  demo login');

  const headers = { Authorization: `Bearer ${login.token}` };
  const profile = await request('/users/me', { headers });
  if (profile.username !== 'alice') {
    throw new Error('Authenticated profile did not match the demo account');
  }
  console.log('PASS  authenticated profile');

  const catalog = await request('/store/cards', { headers });
  if (!Array.isArray(catalog.cards)) {
    throw new Error('Store endpoint did not return a card catalog');
  }
  console.log('PASS  store catalog');
}

main().catch((error) => {
  console.error('Smoke test failed:', error.message);
  process.exitCode = 1;
});
