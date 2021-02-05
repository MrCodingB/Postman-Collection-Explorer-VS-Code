/* eslint-disable */

const { execSync } = require('child_process');
const fs = require('fs');
const { join } = require('path');

console.log('Removing previous build output');
fs.rmSync(join(__dirname, '..', 'out'), { recursive: true, force: true })

console.log('Compiling');
execSync('npm run compile');

console.log('Linting');
execSync('npm run lint');
