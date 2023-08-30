import expressJwt from 'express-jwt';
import 'dotenv/config';

export function authJwt(secretKey) {
  return expressJwt({
    secret: secretKey,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      '/api/users/login',
      '/api/users/register',
    ],
  });
}

async function isRevoked(req, payload, done) {
  try {
    if (!payload.isAdmin) {
      const unauthorizedError = new Error('Revoked');
      unauthorizedError.name = 'UnauthorizedError';
      throw unauthorizedError;
    }
    done();
  } catch (error) {
    done(error);
  }
}

export default authJwt;
