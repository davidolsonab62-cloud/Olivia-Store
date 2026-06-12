import time
import requests

url_root='http://127.0.0.1:3001/'
url_curr='http://127.0.0.1:3001/api/crypto/currencies'
for i in range(30):
    try:
        r = requests.get(url_root, timeout=2)
        r2 = requests.get(url_curr, timeout=2)
        print('root', r.status_code, r.text)
        print('/api/crypto/currencies', r2.status_code, r2.text[:1000])
        break
    except Exception as e:
        print('waiting...', i, e)
        time.sleep(1)
else:
    print('timed out')
