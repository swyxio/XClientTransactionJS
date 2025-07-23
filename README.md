<h1 align="center">X-Client-Transaction-ID</h1>

<p align="center">
JavaScript implementation of Twitter/X's Client-Transaction-ID generator for API requests.

<p align="center">
<a href="https://choosealicense.com/licenses/mit/"> <img src="https://img.shields.io/badge/License-MIT-green.svg"></a>
<a href="https://www.npmjs.com/package/xclienttransaction"><img src="https://img.shields.io/npm/v/xclienttransaction"></a>
<a href="https://bundlephobia.com/package/xclienttransaction"><img src="https://img.shields.io/bundlephobia/minzip/xclienttransaction"></a>
<a href="https://github.com/swyxio/XClientTransactionJS/commits/main"> <img src="https://img.shields.io/github/last-commit/swyxio/XClientTransactionJS"></a>

> [!NOTE]
> This is a JavaScript port of the original [Python implementation](https://github.com/iSarabjitDhiman/XClientTransaction).
> The Python version may be more actively maintained and include additional features.

## Authors

- Original Python Implementation: [@iSarabjitDhiman](https://www.github.com/iSarabjitDhiman)
- JavaScript Port: [@swyxio](https://www.github.com/swyxio)

## License

MIT 2025 Sarabjit Dhiman, Shawn Wang

## References

- [Twitter Header: Part 1, Deobfuscation](https://antibot.blog/posts/1741552025433)
- [Twitter Header: Part 2, Reverse Engineering](https://antibot.blog/posts/1741552092462)
- [Twitter Header: Part 3, Generating the header](https://antibot.blog/posts/1741552163416)
- [Original Python Implementation](https://github.com/iSarabjitDhiman/XClientTransaction)

## Installation

### NPM Package

```bash
npm install xclienttransaction
```

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/swyxio/XClientTransactionJS.git
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

## JavaScript Usage

### In Node.js

```javascript
import { ClientTransaction } from 'xclienttransaction';
// or using CommonJS:
// const { ClientTransaction } = require('xclienttransaction');

// Initialize with the HTML from x.com and its ondemand script
const ct = new ClientTransaction(homeHtml, ondemandJs);
const transactionId = ct.generateTransactionId('GET', '/api/endpoint');
console.log(transactionId);
```

### In the Browser

```html
<script src="https://unpkg.com/xclienttransaction/dist/xclienttransaction.js"></script>
<script>
  // homeHtml and ondemandJs should contain the raw page source
  // from https://x.com and its ondemand script
  const ct = new XClientTransaction.ClientTransaction(homeHtml, ondemandJs);
  console.log(ct.generateTransactionId('GET', '/test'));
</script>
```

note that under many situations domains the fetches done within XClientTransaction will run into CORS errors unless you have the ability to disable CORS.

## How It Works

This library generates the `X-Client-Transaction-Id` header required by Twitter/X's API. The process involves:

1. Extracting animation data from the X/Twitter home page HTML
2. Parsing key byte indices from an on-demand JavaScript file
3. Combining these with the HTTP method and path of your API request
4. Generating a cryptographic signature
5. Encoding everything into a Base64 string

### Key Differences from Python Version

- **Browser Support**: This version works in both Node.js and browser environments
- **Dependencies**: Uses `js-sha256` for hashing instead of Python's `hashlib`
- **Performance**: The JavaScript implementation is generally faster for web applications
- **Bundle Size**: ~33KB minified (browser bundle)
- **API**: Similar API but adapted to JavaScript conventions

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

## Fetching Required Data

To use this library, you need to fetch two pieces of data from X/Twitter:

1. The HTML from `https://x.com`
2. The `ondemand.s.*.js` file referenced in that HTML

### In Node.js

```javascript
import { getOndemandFileUrl, generateHeaders } from 'xclienttransaction';

async function fetchData() {
  const headers = generateHeaders();
  const homeHtml = await (await fetch('https://x.com', { headers })).text();
  const ondemandUrl = getOndemandFileUrl(homeHtml);
  const ondemandJs = await (await fetch(ondemandUrl, { headers })).text();
  return { homeHtml, ondemandJs };
}
```

### In the Browser

```javascript
import { getOndemandFileUrl, generateHeaders } from 'xclienttransaction';

async function fetchData() {
  // Note: You may need to handle CORS when fetching from a browser
  const headers = new Headers(generateHeaders());
  const homeHtml = await (await fetch('https://x.com', { headers })).text();
  const ondemandUrl = getOndemandFileUrl(homeHtml);
  const ondemandJs = await (await fetch(ondemandUrl, { headers })).text();
  return { homeHtml, ondemandJs };
}
```

> **Note**: When running in a browser, you may encounter CORS restrictions. You might need to use a proxy or CORS-anywhere service for production use.

Direct browser requests may be blocked by CORS. Consider proxying the requests
through a server if needed.

## Get x.com Home Page and ondemand.s File Response

#### Python Version

For the original Python implementation, please see the [XClientTransaction](https://github.com/iSarabjitDhiman/XClientTransaction) repository. The Python version includes additional features like automatic response handling and may be more actively maintained.

## Publishihg

```bash
# npm login # if needed
npm version patch && npm publish --access public
npm version minor && npm publish --access public
npm version major && npm publish --access public
```
