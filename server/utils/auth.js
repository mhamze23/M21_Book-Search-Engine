module.exports = {
  // Middleware to authenticate routes
  authMiddleware: function ({ req, res }) { // include 'res' here
    // Extract token from request body, query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If token was sent in the Authorization header, remove "Bearer" from the string
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // If no token was provided, return the request object as is
    if (!token) {
      return req;
    }

    // If a token is present, try to verify it and attach user data to the request
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      // If the token is not valid, respond with an error
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' }); // 'res' should be available here
    }

    // Return the updated request object
    return req;
  },
  
  // Function to generate a new JWT
  signToken: function ({ username, email, _id }) {
    // Define the data that will be included in the token
    const payload = { username, email, _id };

    // Sign the token with the secret key and the provided user data, set the token to expire as defined
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

