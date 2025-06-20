<h1 align="center">X-Client-Transaction-ID</h1>

<p align="center">
Twitter X-Client-Transaction-Id generator written in python.

<p align="center">
<a href="https://choosealicense.com/licenses/mit/"> <img src="https://img.shields.io/badge/License-MIT-green.svg"></a>
<a href="https://www.python.org/"><img src="https://img.shields.io/pypi/pyversions/XClientTransaction"></a>
<a href="https://pypi.org/project/XClientTransaction"> <img src="https://img.shields.io/pypi/v/XClientTransaction"></a>
<a href="https://github.com/iSarabjitDhiman/XClientTransaction/commits"> <img src="https://img.shields.io/github/last-commit/iSarabjitDhiman/XClientTransaction"></a>
<a href="https://pypi.org/project/XClientTransaction/"> <img src="https://img.shields.io/pypi/dd/XClientTransaction"></a>
<a href="https://discord.gg/pHY6CU5Ke4"> <img alt="Discord" src="https://img.shields.io/discord/1149281691479851018?style=flat&logo=discord&logoColor=white"></a>
<a href="https://twitter.com/isarabjitdhiman"> <img src="https://img.shields.io/twitter/follow/iSarabjitDhiman?style=social"></a>

Reference :

- [Twitter Header: Part 1, Deobfuscation](https://antibot.blog/posts/1741552025433)
- [Twitter Header: Part 2, Reverse Engineering](https://antibot.blog/posts/1741552092462)
- [Twitter Header: Part 3, Generating the header](https://antibot.blog/posts/1741552163416)

## Installation

### Python Package

```bash
pip install XClientTransaction -U --no-cache-dir
```

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/XClientTransactionJS.git
   cd XClientTransactionJS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the browser bundle:
   ```bash
   npm run build
   ```

The browser-compatible library will be available at `dist/xclienttransaction.js`

## Python Usage

```python
python quickstart.py
```

## How It Works

The library generates a transaction ID by:

1. Extracting animation data from the home page HTML
2. Parsing key byte indices from the on-demand JavaScript file
3. Combining these with the request method and path
4. Generating a cryptographic signature
5. Encoding everything into a Base64 string

### Response Formats

#### Home Page Response
Should be the raw HTML from https://x.com, containing SVG animation data:

```html
<div id="loading-x-anim-0"><svg><path d="M0 0C10 20 30 40 50 60C70 80 90 100 110 120"></path></svg></div>
<div id="loading-x-anim-1"><svg><path d="M0 0C1 2 3 4 5 6C7 8 9 10 11 12"></path></svg></div>
<div id="loading-x-anim-2"><svg><path d="M0 0C2 4 6 8 10 12C14 16 18 20 22 24"></path></svg></div>
<div id="loading-x-anim-3"><svg><path d="M0 0C3 6 9 12 15 18C21 24 27 30 33 36"></path></svg></div>
```

#### On-Demand File Response
Should be the JavaScript file containing the key byte indices, typically matching this pattern:

```javascript
function test(a){return (a[5], 16) + (a[9], 16) + (a[15], 16);}
```

## Troubleshooting

### Common Issues

1. **Invalid Response Format**
   - Ensure you're using the exact response formats shown above
   - The home page response must contain the animation divs
   - The on-demand file must contain the key byte indices

2. **CORS Issues**
   - When fetching responses directly from x.com, you may encounter CORS errors
   - Consider using a proxy server for production use

3. **Transaction ID Generation**
   - Each generated ID includes a timestamp, so it will be different every time
   - The same input parameters will generate different but equally valid IDs

## Browser Test Page

A test page is included to easily test the `ClientTransaction` functionality in a browser environment.

### Quick Start

1. Start a local server:
   ```bash
   npx serve
   ```

2. Open `http://localhost:3000` in your browser

3. The test page includes sample responses that work with the library:
   - Home page response (HTML with animation data)
   - On-demand file response (JavaScript with key byte indices)

4. Click "Initialize ClientTransaction" to verify the responses are valid

5. Generate transaction IDs by:
   - Selecting an HTTP method (GET, POST, PUT, DELETE)
   - Entering an API path
   - Clicking "Generate Transaction ID"

### Sample Output

```
[2025-06-20T06:42:13.141Z] ClientTransaction initialized successfully!
[2025-06-20T06:42:13.141Z] Random keyword: obfiowerehiring
[2025-06-20T06:42:13.141Z] Random number: 3
[2025-06-20T06:42:13.142Z] Row index: 5
[2025-06-20T06:42:13.142Z] Key bytes indices: 9, 15
[2025-06-20T06:42:29.823Z] Generating transaction ID for GET /api/endpoint...
[2025-06-20T06:42:29.824Z] Generated Transaction ID: RSQnJiEgIyItLC8uKSgrKjU0NzYxMDMyPSDaQEE0z/yB4Ek9HJ2DF4gEpJbpRg
```

### JavaScript Usage

You can also use the library directly in your own code. First, build the browser bundle:

```bash
npm install
npm run build
```

The `dist/xclienttransaction.js` file exposes a global `XClientTransaction` object. Include it in a web page:

```html
<script src="dist/xclienttransaction.js"></script>
<script>
  // homeHtml and ondemandJs must contain the raw page source
  // from https://x.com and its ondemand script
  const ct = new XClientTransaction.ClientTransaction(homeHtml, ondemandJs);
  console.log(ct.generateTransactionId('GET', '/test'));
</script>
```

When using Node.js you can import the ES module directly:

```javascript
import { ClientTransaction } from './js_client_transaction/index.js';
```

### Fetching `homeHtml` and `ondemandJs`

In both environments you must retrieve the HTML for `https://x.com` and the
`ondemand.s.*.js` file referenced in that page. Examples for Node.js and the
browser are shown below.

#### Node.js

```javascript
import fetch from 'node-fetch'; // Node 18+ has global fetch
import {
  getOndemandFileUrl,
  generateHeaders
} from './js_client_transaction/utils.js';

const headers = generateHeaders();
const homeHtml = await (await fetch('https://x.com', { headers })).text();
const ondemandUrl = getOndemandFileUrl(homeHtml);
const ondemandJs = await (await fetch(ondemandUrl, { headers })).text();
```

#### Browser

```html
<script type="module">
  import {
    getOndemandFileUrl,
    generateHeaders
  } from './js_client_transaction/utils.js';

  const headers = new Headers(generateHeaders());
  const homeHtml = await (await fetch('https://x.com', { headers })).text();
  const ondemandUrl = getOndemandFileUrl(homeHtml);
  const ondemandJs = await (await fetch(ondemandUrl)).text();
  // Use these values when constructing ClientTransaction
</script>
```

Direct browser requests may be blocked by CORS. Consider proxying the requests
through a server if needed.

## Get x.com Home Page and ondemand.s File Response

#### Synchronous Version

```python
import bs4
import requests
from x_client_transaction.utils import generate_headers, handle_x_migration, get_ondemand_file_url

# INITIALIZE SESSION
session = requests.Session()
session.headers = generate_headers()


# GET HOME PAGE RESPONSE
# required only when hitting twitter.com but not x.com
# returns bs4.BeautifulSoup object
home_page_response = handle_x_migration(session=session)

# for x.com no migration is required, just simply do
home_page = session.get(url="https://x.com")
home_page_response = bs4.BeautifulSoup(home_page.content, 'html.parser')


# GET ondemand.s FILE RESPONSE
ondemand_file_url = get_ondemand_file_url(response=home_page_response)
ondemand_file = session.get(url=ondemand_file_url)
ondemand_file_response = bs4.BeautifulSoup(ondemand_file.content, 'html.parser')
```

#### Async Version

```python
import bs4
import httpx
from x_client_transaction.utils import generate_headers, handle_x_migration_async, get_ondemand_file_url

# INITIALIZE SESSION
session = httpx.AsyncClient(headers=generate_headers())


# GET HOME PAGE RESPONSE
# required only when hitting twitter.com but not x.com
# returns bs4.BeautifulSoup object
home_page_response = await handle_x_migration_async(session=session)

# for x.com no migration is required, just simply do
home_page = await session.get(url="https://x.com")
home_page_response = bs4.BeautifulSoup(home_page.content, 'html.parser')


# GET ondemand.s FILE RESPONSE
ondemand_file_url = get_ondemand_file_url(response=home_page_response)
ondemand_file = await session.get(url=ondemand_file_url)
ondemand_file_response = bs4.BeautifulSoup(ondemand_file.content, 'html.parser')
```

## Generate X-Client-Transaction-I (tid):

```python
from urllib.parse import urlparse
from x_client_transaction import ClientTransaction


# Example 1
# replace the url and http method as per your use case
url = "https://x.com/i/api/1.1/jot/client_event.json"
method = "POST"
path = urlparse(url=url).path
# path will be /i/api/1.1/jot/client_event.json in this case

# Example 2
user_by_screen_name_url = "https://x.com/i/api/graphql/1VOOyvKkiI3FMmkeDNxM9A/UserByScreenName"
user_by_screen_name_http_method = "GET"
user_by_screen_name_path = urlparse(url=url).path
# path will be /i/api/graphql/1VOOyvKkiI3FMmkeDNxM9A/UserByScreenName in this case


ct = ClientTransaction(home_page_response=home_page_response, ondemand_file_response=ondemand_file_response)
transaction_id = ct.generate_transaction_id(method=method, path=path)
transaction_id_for_user_by_screen_name_endpoint = ct.generate_transaction_id(
    method=user_by_screen_name_http_method, path=user_by_screen_name_path)

print(transaction_id)
print(transaction_id_for_user_by_screen_name_endpoint)

```

## Authors

- [@iSarabjitDhiman](https://www.github.com/iSarabjitDhiman)

## Feedback

If you have any feedback, please reach out to us at hello@sarabjitdhiman.com or contact me on Social Media @iSarabjitDhiman

## Support

For support, email hello@sarabjitdhiman.com
