const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
 //Write your code here
 const username = req.body.username;
 const password = req.body.password;


 if (username && password) {
   if (!isValid(username)) {
     users.push({"username":username,"password":password});
     return res.status(200).json({message: "User successfully registred. Now you can login"});
   } else {
     return res.status(404).json({message: "User already exists!"});   
   }
 }
 return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 3000); // 3-second delay
    });
  };
  
  try {
    const booksData = await getBooks();
    res.send(JSON.stringify(booksData, null, 4));
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books.hasOwnProperty(isbn)) {
          resolve(books[isbn]);
        } else {
          reject({ message: 'Book not found' });
        }
      }, 3000); // 3-second delay
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error('Error fetching book:', error);
      res.status(404).json(error);
    });
  });
  
 
 // Get book details based on author
 public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksArray = Object.entries(books);
          const filtered_booksbyauthor = booksArray.filter(([key, book]) => book.author === author);
          const bookDetails_author = filtered_booksbyauthor.map(([key, book]) => book);
          resolve(bookDetails_author);
        }, 3000); // 3-second delay
      });
    };
  
    try {
      const booksByAuthor = await getBooksByAuthor();
      res.send(booksByAuthor);
    } catch (error) {
      console.error('Error fetching books by author:', error);
      res.status(500).json({ message: 'Failed to fetch books by author' });
    }
  });
  


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksArray = Object.entries(books);
          const filtered_booksbytitle = booksArray.filter(([key, book]) => book.title === title);
          const bookDetails_title = filtered_booksbytitle.map(([key, book]) => book);
          resolve(bookDetails_title);
        }, 3000); // 3-second delay
      });
    };
  
    try {
      const booksByTitle = await getBooksByTitle();
      res.send(booksByTitle);
    } catch (error) {
      console.error('Error fetching books by title:', error);
      res.status(500).json({ message: 'Failed to fetch books by title' });
    }
  });  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 //Write your code here
 let isbn = req.params.isbn;
 res.send(books[isbn].reviews)

});


module.exports.general = public_users;


