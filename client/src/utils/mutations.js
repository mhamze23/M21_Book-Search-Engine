// Import the gql tagged template function
import { gql } from '@apollo/client';

// Mutation for logging in a user. This mutation expects two variables: $email and $password. 
// It returns a token, user id, and username.
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation for adding a new user. This mutation expects three variables: $username, $email and $password. 
// It returns a token, user id, and username.
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation for saving a new book to a user's list. This mutation expects a single object variable $newBook of type BookInput. 
// It returns user details along with their updated list of saved books.
export const SAVE_BOOK = gql`
  mutation saveBook($newBook: bookInput!) {
    saveBook(newBook: $newBook) {
      _id
      username
      email
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

// Mutation for removing a book from a user's list. This mutation expects a single variable $bookId of type ID. 
// It returns user details along with their updated list of saved books.
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
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
