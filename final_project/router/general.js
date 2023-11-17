const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
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
/*public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
  return res.status(300).json({message: "books list"});
});*/

// TASK 10 - Get the book list available in the shop using Promises
public_users.get('/',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });


// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
  return res.status(300).json({message: "isbn "});
 });*/

 // TASK 11 - Get  the book details based on ISBN using Promises
 function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (!book) {
          reject("Book not found");
        }
        resolve(book);
      }, 3000);
    });
  }
 
 public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const getByIsbn= getBookByISBN(isbn);
    getByIsbn

    .then((book) => {

        res.status(200).json(book);

        console.log("Promise for Task 11 resolved");

    })

    .catch((error) => {

        res.status(404).send(error.message);

        console.log('ISBN not found');

    });
 });

  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbyauthor}, null, 4));
});*/

// Task 12
function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByAuthor = [];
        for (const key in books) {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        }
        if (booksByAuthor.length === 0) {
          reject("Book not found");
        }
        resolve(booksByAuthor);
      }, 3000);
    });
  }
public_users.get('/author/:author',function (req, res) {
    const author= req.params.author;
    const authordetails= getBookByAuthor(author)
    authordetails
    .then((booksByAuthor) => {

        res.status(200).json(booksByAuthor);

        console.log("Promise for Task 12 resolved");

    })

    .catch((error) => {

        res.status(404).send(error.message);

        console.log('author not found');

    });
});

// Task 13
function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          for (const key in books) {
            if (books[key].title === title) {
                let book1=books[key]
              resolve(book1);
            }
          }
          reject("Book not found");
        }, 2000);
      });
       
  }
// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));
});*/
// Task 13
public_users.get('/title/:title',function (req, res) {
    const title= req.params.title;
    const titledetails= getBookByTitle(title)
    titledetails
    .then((book1) => {

        res.status(200).json(book1);

        console.log("Promise for Task 13 resolved");

    })

    .catch((error) => {

        res.status(404).send(error.message);

        console.log('title not found');

    });
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review=books[isbn]["reviews"];
    if (!review) {

        res.status(404).json({ message: 'No reviews found for the ISBN provided' });
  
      } else {
  
        res.status(200).json({review});
  
      }
});

module.exports.general = public_users;
