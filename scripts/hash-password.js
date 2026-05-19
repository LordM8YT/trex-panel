const crypto = require('crypto');

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');

console.log(`password_salt=${salt}`);
console.log(`password_hash=${hash}`);
