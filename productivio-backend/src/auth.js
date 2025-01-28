// src/auth.js
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Setup JWKS client to get the public keys from Auth0
const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

// Function to get the signing key from Auth0
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err, null);
    callback(null, key.publicKey || key.rsaPublicKey);
  });
};

// Middleware to check if the JWT is valid
const checkJwt = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).send('Authorization token required');
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: `${process.env.AUTH0_AUDIENCE}`,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      }
      req.user = decoded; // Attach decoded JWT data (user info) to request
      next();
    }
  );
};

module.exports = { checkJwt };
