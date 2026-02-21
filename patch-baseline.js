const fs = require('fs');

const path1 = 'node_modules/baseline-browser-mapping/dist/index.js';
const path2 = 'node_modules/baseline-browser-mapping/dist/index.cjs';
const path3 = 'node_modules/next/dist/compiled/browserslist/index.js';

[path1, path2, path3].forEach(path => {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, 'utf8');
        content = content.split('console.warn').join('null && console.warn');
        fs.writeFileSync(path, content, 'utf8');
        console.log(`Patched ${path} to suppress stale age warning.`);
    } else {
        console.log(`${path} not found. Did not patch.`);
    }
});
