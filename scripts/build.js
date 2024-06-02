const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '../components/mobile/package.json');
const packageJson = fs.readFileSync(packagePath, {encoding: 'utf8'}); 
const package = JSON.parse(packageJson);
package.main = 'dist/es/index.js';
package.module = 'dist/es/index.js';
package.style = 'dist/es/style.css';
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2), {encoding: 'utf8'});