// Import React and necessary components from react-router-dom and @apollo/client
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';

// Import pages and components
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Set up an HTTP link for GraphQL, it's URI endpoint is '/graphql'
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Set up the auth link context that gets the authentication token from local storage if it exists
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create an Apollo client instance with the link and cache
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Define the main App component
function App() {
  return (
    // Provide the Apollo client to the rest of the application
    <ApolloProvider client={client}>
      {/* Set up the router */}
      <Router>
        <>
          <Navbar /> {/* The Navbar component */}
          <Routes>
            <Route path='/' element={<SearchBooks />} /> {/* The SearchBooks component for the root path */}
            <Route path='/saved' element={<SavedBooks />} /> {/* The SavedBooks component for the '/saved' path */}
            <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} /> {/* An error message for any other unmatched paths */}
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

// Export the App component
export default App;
