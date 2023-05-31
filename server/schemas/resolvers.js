// Import necessary libraries and models
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Define the resolvers for GraphQL queries and mutations
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // If user is logged in, retrieve and return user data excluding version and password
      if (context.user) {
        const data = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return data;
      }

      // If user is not logged in, throw an error
      throw new AuthenticationError('Login to access your data!');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      // Attempt to find user with the provided email
      const user = await User.findOne({ email });

      // If no such user exists, throw an error
      if (!user) {
        throw new AuthenticationError('No account associated with this email. Please sign up!');
      }

      // Verify password is correct
      const correctPw = await user.isCorrectPassword(password);

      // If password is incorrect, throw an error
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password! Please try again.');
      }

      // If authentication is successful, sign and return a token with the user data
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ username, email, password });

      // Sign and return a token with the new user data
      const token = signToken(user);
      return { token, user };
    },
    
    saveBook: async (parent, { newBook }, context) => {
      // If user is logged in, add a book to their savedBooks array
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: newBook }},
          { new: true }
        );
        return updatedUser;
      }

      // If user is not logged in, throw an error
      throw new AuthenticationError('Login to save books!');
    },
    
    removeBook: async (parent, { bookId }, context) => {
      // If user is logged in, remove a book from their savedBooks array
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }

      // If user is not logged in, throw an error
      throw new AuthenticationError('Login to remove books!');
    },
  },
};

module.exports = resolvers;
