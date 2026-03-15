const https = require('https');
const fs = require('fs');

https.get('https://api.github.com/repos/hdeepak06/kodbank/deployments', { headers: { 'User-Agent': 'node' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const deps = JSON.parse(data);
        if (deps.length > 0) {
            https.get(deps[0].statuses_url, { headers: { 'User-Agent': 'node' } }, (res2) => {
                let data2 = '';
                res2.on('data', chunk => data2 += chunk);
                res2.on('end', () => {
                    const statuses = JSON.parse(data2);
                    if (statuses.length > 0) {
                        fs.writeFileSync('link_utf8.txt', statuses[0].environment_url, 'utf8');
                        console.log("Done");
                    }
                });
            });
        }
    });
});
