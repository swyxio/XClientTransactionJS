import { MIGRATION_REDIRECTION_REGEX, ON_DEMAND_FILE_REGEX, ON_DEMAND_FILE_URL } from './constants.js';

export class MathUtil {
  static round(num) {
    const x = Math.floor(num);
    if ((num - x) >= 0.5) {
      return Math.ceil(num);
    }
    return Math.sign(num) * x;
  }
}

export function generateHeaders() {
  return {
    'Authority': 'x.com',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Referer': 'https://x.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'X-Twitter-Active-User': 'yes',
    'X-Twitter-Client-Language': 'en'
  };
}

export function validateResponse(response) {
  if (typeof response !== 'string') {
    throw new TypeError(`the response object must be string, not ${typeof response}`);
  }
}

export function getMigrationUrl(html) {
  const match = MIGRATION_REDIRECTION_REGEX.exec(html);
  return match ? match[0] : null;
}

export function getMigrationForm(html) {
  const formMatch = html.match(/<form[^>]*name=['"]f['"][^>]*>([\s\S]*?)<\/form>/);
  if (!formMatch) return null;
  const actionMatch = formMatch[0].match(/action=['"]([^'"]*)['"]/);
  const methodMatch = formMatch[0].match(/method=['"]([^'"]*)['"]/);
  const inputs = [...formMatch[0].matchAll(/<input[^>]*name=['"]([^'"]*)['"][^>]*value=['"]([^'"]*)['"]/g)];
  const data = {};
  for (const [, name, value] of inputs) {
    data[name] = value;
  }
  return {
    method: methodMatch ? methodMatch[1] : 'POST',
    url: actionMatch ? actionMatch[1] : 'https://x.com/x/migrate',
    data
  };
}

export function getOndemandFileUrl(html) {
  const match = ON_DEMAND_FILE_REGEX.exec(html);
  if (!match) return null;
  return ON_DEMAND_FILE_URL.replace('{filename}', match[1]);
}

export function floatToHex(x) {
  let result = [];
  let quotient = Math.trunc(x);
  let fraction = x - quotient;
  let q = quotient;
  while (q > 0) {
    const newQ = Math.trunc(q / 16);
    const remainder = q - newQ * 16;
    result.unshift(remainder > 9 ? String.fromCharCode(remainder + 55) : String(remainder));
    q = newQ;
  }
  if (fraction === 0) return result.join('');
  result.push('.');
  let f = fraction;
  while (f > 0) {
    f *= 16;
    const integer = Math.trunc(f);
    f -= integer;
    result.push(integer > 9 ? String.fromCharCode(integer + 55) : String(integer));
  }
  return result.join('');
}

export function isOdd(num) {
  return num % 2 ? -1.0 : 0.0;
}

export function base64Encode(input) {
  if (typeof Buffer !== 'undefined') {
    const buf = typeof input === 'string' ? Buffer.from(input) : Buffer.from(input);
    return buf.toString('base64');
  }
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function base64Decode(input) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(input, 'base64').toString();
  }
  const binary = atob(input);
  return binary;
}
