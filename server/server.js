// Import JSON Web Token library
const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Function for our authenticated routes
  authMiddleware: function (req, _, next) {  // res is not used in this middleware function, so replace it with an underscore (_)
    // Allow token to be sent via req.query or headers
    let token = req.query.token || req.headers.authorization;

    // If authorization header exists, extract the token value
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();  // ["Bearer", "<tokenvalue>"]
    }

    // If no token, return the request as it is
    if (!token) {
      return req;
    }

    // Verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;  // Attach user data to the request object
    } catch {
      console.log('Invalid token');  // Log if token is invalid
    }

    return req;  // Return the request object with user data
  },

  // Function to generate a new JSON Web Token
  signToken: function ({ username, email, _id }) {
    // Define the data payload for the token
    const payload = { username, email, _id };

    // Return a new signed JWT
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
