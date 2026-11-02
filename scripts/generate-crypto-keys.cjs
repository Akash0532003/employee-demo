
const { generateKeyPairSync } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const directory = path.join(process.cwd(), 'certs');

fs.mkdirSync(directory, { recursive: true });

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

fs.writeFileSync(path.join(directory, 'rsa-public.pem'), publicKey);
fs.writeFileSync(path.join(directory, 'rsa-private.pem'), privateKey);

console.log('RSA keys generated successfully.');
console.log('Public key: certs/rsa-public.pem');
console.log('Private key: certs/rsa-private.pem');
