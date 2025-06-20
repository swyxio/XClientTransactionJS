import { ClientTransaction } from './transaction.js';
import { generateHeaders } from './utils.js';
import fs from 'fs';

// Example usage with sample files
const homeHtml = fs.readFileSync('./sample_home.html', 'utf-8');
const ondemandJs = fs.readFileSync('./sample_ondemand.js', 'utf-8');
const ct = new ClientTransaction(homeHtml, ondemandJs);
const tid = ct.generateTransactionId('GET', '/test');
console.log(tid);
