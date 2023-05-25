// Importing gql from Apollo Client for creating GraphQL queries
import { gql } from '@apollo/client';

// Creating a GraphQL query named 'GET_ME'
// This query retrieves the logged-in user's data including their saved books
export const GET_ME = gql`
  {
    me {
      _id          // User's unique ID
      username     // User's username
      email        // User's email
      bookCount    // Number of books saved by the user
      savedBooks { // List of books saved by the user
        bookId     // Unique ID of the saved book
        authors    // Authors of the saved book
        description // Description of the saved book
        title       // Title of the saved book
        image       // Cover image of the saved book
        link        // Link to more information about the saved book
      }
    }
  }
`;
