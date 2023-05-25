//  import React, { useState, useEffect } from 'react';
// Import necessary libraries and components
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

// Define the SavedBooks component
const SavedBooks = () => {
  // Query for getting user data
  const { loading, data } = useQuery(GET_ME);
  // Mutation for removing a book
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  // Get user data
  const userData = data?.me || {};

  // Function to delete a book using its Mongo _id
  const handleDeleteBook = async (bookId) => {
    // Get token for authentication
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Try to remove the book
      const response = await removeBook({ variables: { bookId } });
      console.log('Deleted record: ', response);
      if (error) {
        console.error(error);
      }
      // Remove the book id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // If data isn't here yet, display loading message
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  // Render the component
  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {/* Map through saved books and display them */}
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
