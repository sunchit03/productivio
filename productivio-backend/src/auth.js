// src/auth.js

const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');

// Auth0 configuration
const authMiddleware = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: `${process.env.AUTH0_AUDIENCE}`, // Replace with your API identifier
  issuer: `https://${process.env.AUTH0_DOMAIN}/`, // Replace with your Auth0 domain
  algorithms: ['RS256'],
});

// Export the middleware
module.exports = authMiddleware;
