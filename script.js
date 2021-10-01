import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://localhost:3000/qa/questions?product_id=5');
  sleep(1);
}

// export default function () {
//   http.post('http://localhost:3000/qa/questions?product_id=1');
//   sleep(1);
// }

// k6 run script.js
// k6 run --vus 1 --duration 30s script.js
// k6 run --vus 10 --duration 30s script.js
// k6 run --vus 100 --duration 30s script.js
// k6 run --vus 500 --duration 30s script.js
// k6 run --vus 10000 --duration 30s script.js
