import crypto from 'crypto';

const SECRET = process.env.HMAC_SECRET!;

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: '' };

  const { poiId, planLevel } = JSON.parse(event.body);
  if (typeof poiId !== 'number' || (planLevel !== null && (planLevel < 1 || planLevel > 3)))
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad payload' }) };

  const payload = `${poiId}:${planLevel}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sig }),
  };
};