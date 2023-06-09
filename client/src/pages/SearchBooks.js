// Import necessary libraries, utilities and mutations
import React, { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';

// Main function component
const SearchBooks = () => {
  // State for holding returned Google Books API data
  const [searchedBooks, setSearchedBooks] = useState([]);

  // State for holding search field data
  const [searchInput, setSearchInput] = useState('');

  // State to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // State to hold any error messages
  const [errorMessage, setErrorMessage] = useState('');

  // Mutation hook for saving a book
  const [saveBook] = useMutation(SAVE_BOOK);

  // Effect hook to save `savedBookIds` list to localStorage when component unmounts
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  // Function to handle form submission and search for books
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      // Update state with new book data and clear search input
      setSearchedBooks(bookData);
      setSearchInput('');
      setErrorMessage(''); // Clear any previous error messages
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred while searching for books. Please try again.');
    }
  };

  // Function to handle saving a book to the database
  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { newBook: { ...bookToSave } }
      });

      // Save book id to state if the book was successfully saved to user's account
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      setErrorMessage(''); // Clear any previous error messages
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred while saving the book. Please try again.');
    }
  };

  // Main component render
  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
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

export default SearchBooks;
