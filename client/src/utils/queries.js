// Importing gql from Apollo Client for creating GraphQL queries
import { gql } from '@apollo/client';

// Creating a GraphQL query named 'GET_ME'
// This query retrieves the logged-in user's data including their saved books
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
