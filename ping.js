const http = require('http');
const https = require('https');

// Simple HTTP server for Render health checks
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('URL Pinger is running\n');
});

// Use the port Render provides (default to 3000 for local testing)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} for health checks`);
});

// Existing URL pinging logic
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
        'https://refresh-n9bs.onrender.com'
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

const intervalMinutes = 3;
const intervalMs = intervalMinutes * 60 * 1000;

checkUrls().catch(err => console.error('An error occurred:', err));
setInterval(() => {
    checkUrls().catch(err => console.error('An error occurred:', err));
}, intervalMs);

console.log(`Pinging URLs every ${intervalMinutes} minutes...`);
