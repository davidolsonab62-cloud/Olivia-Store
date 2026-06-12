import requests
from pprint import pprint

base_frontend = 'http://127.0.0.1:3001'
base_api = 'http://127.0.0.1:3002/api'
results = {}

try:
    r = requests.get(base_frontend, timeout=10)
    results['frontend_root'] = {'status': r.status_code, 'text_start': r.text[:200]}
except Exception as e:
    results['frontend_root'] = {'error': str(e)}

paths = ['products', 'products/test-slug', 'auth/me']
for path in paths:
    try:
        r = requests.get(f'{base_api}/{path}', timeout=10)
        results[path] = {'status': r.status_code, 'text_start': r.text[:400]}
    except Exception as e:
        results[path] = {'error': str(e)}

try:
    reg = requests.post(
        f'{base_api}/auth/register',
        json={'email': 'test+bot@example.com', 'password': 'Test1234', 'full_name': 'Bot Tester'},
        timeout=10,
    )
    results['register'] = {'status': reg.status_code, 'text_start': reg.text[:400]}
except Exception as e:
    results['register'] = {'error': str(e)}

try:
    login = requests.post(
        f'{base_api}/auth/login',
        json={'email': 'admin@oliviadante.com', 'password': 'Admin@123'},
        timeout=10,
    )
    results['login'] = {'status': login.status_code, 'text_start': login.text[:400]}
except Exception as e:
    results['login'] = {'error': str(e)}

pprint(results)
