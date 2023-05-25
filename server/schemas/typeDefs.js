// Require gql from apollo-server-express for creating GraphQL type definitions
const {gql} = require('apollo-server-express');

// Define GraphQL type definitions
const typeDefs = gql`
    // User type with id, username, email, book count and saved books fields
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    // Book type with id, authors, description, title, image and link fields
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    // Auth type for handling authenticated users with token and user fields
    type Auth {
        token: ID!
        user: User
    }

    // BookInput type for creating new book entries
    input BookInput {
        authors: [String]
        description: String
        title: String
        bookId: String
        image: String
        link: String
    }

    // Query type with 'me' field to fetch currently authenticated user
    type Query {
        me: User
    }

    // Mutation type with login, addUser, saveBook, and removeBook fields
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(newBook: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;
