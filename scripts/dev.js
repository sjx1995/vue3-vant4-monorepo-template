const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '../components/mobile/package.json');
const packageJson = fs.readFileSync(packagePath, {encoding: 'utf8'}); 
const package = JSON.parse(packageJson);
package.main = 'src/index.ts';
package.module = 'src/index.ts';
package.style = '';
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2), {encoding: 'utf8'});