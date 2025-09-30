const https = require('https');
const querystring = require('querystring');

exports.handler = async (event) => {
    try {
        const { code, state } = event.queryStringParameters || {};
        
        if (!code) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Authorization code is required' })
            };
        }

        const tokenResponse = await exchangeCodeForTokens(code);
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                id_token: tokenResponse.id_token,
                access_token: tokenResponse.access_token,
                state: state
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

async function exchangeCodeForTokens(code) {
    const tokenEndpoint = process.env.TOKEN_ENDPOINT;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    const postData = querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
    });

    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(tokenEndpoint, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Token exchange failed: ${res.statusCode}`));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}