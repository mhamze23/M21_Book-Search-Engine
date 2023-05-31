// Import required modules
const express = require('express'); 
const { ApolloServer } = require('apollo-server-express') 
const { authMiddleware } = require('./utils/auth'); 
const { typeDefs, resolvers } = require('./schemas') 

const path = require('path'); 
const db = require('./config/connection'); 

// Initialize an Express application
const app = express();
// Define the port
const PORT = process.env.PORT || 3001;
// Initialize Apollo server with type definitions, resolvers, and context middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Middleware for parsing request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Route for serving the React HTML entry point
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Function for starting Apollo server
const startApolloServer = async () => {
  // Start the server
  await server.start();
  // Apply middleware to Express app
  server.applyMiddleware({ app });

  // Start Express app when the database connection is open
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });  
  });
}

// Call the function to start the server
startApolloServer();
