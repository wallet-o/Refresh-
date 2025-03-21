const http = require('http');
const https = require('https');

async function pingUrl(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const start = Date.now();
        
        protocol
            .get(url, (res) => {
                const timeTaken = Date.now() - start;
                resolve({
                    url: url,
                    status: res.statusCode,
                    time: `${timeTaken}ms`
                });
            })
            .on('error', (err) => {
                resolve({
                    url: url,
                    status: 'Error',
                    error: err.message,
                    time: `${Date.now() - start}ms`
                });
            })
            .setTimeout(5000);
    });
}

async function checkUrls() {
    const urls = [
        'https://surveypay.onrender.com/',
        'https://second-url-here.com' // Replace this with your second URL
    ];

    console.log('Pinging URLs...\n');
    const results = await Promise.all(urls.map(url => pingUrl(url)));
    
    results.forEach(result => {
        console.log(`[${new Date().toLocaleTimeString()}]`);
        console.log(`URL: ${result.url}`);
        console.log(`Status: ${result.status}`);
        console.log(`Response Time: ${result.time}`);
        if (result.error) {
            console.log(`Error: ${result.error}`);
        }
        console.log('---');
    });
}

// Set interval to 3 minutes
const intervalMinutes = 3;
// Convert to milliseconds (minutes * seconds * milliseconds)
const intervalMs = intervalMinutes * 60 * 1000;

// Run immediately once, then every 3 minutes
checkUrls().catch(err => console.error('An error occurred:', err));
setInterval(() => {
    checkUrls().catch(err => console.error('An error occurred:', err));
}, intervalMs);

console.log(`Pinging URLs every ${intervalMinutes} minutes...`);
