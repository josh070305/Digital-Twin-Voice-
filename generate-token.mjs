import { AccessToken } from 'livekit-server-sdk';

const apiKey = process.argv[2];
const apiSecret = process.argv[3];

if (!apiKey || !apiSecret) {
  console.error('Usage: node generate-token.mjs <API_KEY> <API_SECRET>');
  process.exit(1);
}

const token = new AccessToken(apiKey, apiSecret, {
  identity: 'joshna-ai-user',
  ttl: '30d',
});

token.addGrant({
  roomJoin: true,
  room: 'joshna-ai',
  canPublish: true,
  canSubscribe: true,
});

const jwt = await token.toJwt();
console.log(jwt);
