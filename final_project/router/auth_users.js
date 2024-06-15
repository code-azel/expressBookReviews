const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];


const isValid = (username)=>{
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
   return user.username === username
 });
 if(userswithsamename.length > 0){
   return true;
 } else {
   return false;
 }
}


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
   return (user.username === username && user.password === password)
 });
 if(validusers.length > 0){
   return true;
 } else {
   return false;
 }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
 //Write your code here
 const username = req.body.username;
 const password = req.body.password;


 if (!username || !password) {
      res.status(404).json({message: "Error logging in"});
 }


 if (authenticatedUser(username,password)) {
   let accessToken = jwt.sign({
     data: username
   }, 'access', { expiresIn: 60 * 60 });


   req.session.authorization = {
     accessToken,username
 }
  res.status(200).send("User successfully logged in");
 } else {
    res.status(208).json({message: "Invalid Login. Check username and password"});
 }


});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 //Write your code here
 let isbn = req.params.isbn;
 let review = req.query.review;
 let username = req.user.data;


 // Check if the ISBN exists in books
 if (books.hasOwnProperty(isbn)) {
   // Check if the reviews object exists, if not create it
   if (!books[isbn].hasOwnProperty('reviews')) {
     books[isbn].reviews = {};
   }


   // Check if the user has already reviewed this book
   if (books[isbn].reviews.hasOwnProperty(username)) {
     // Update existing review
     books[isbn].reviews[username] = review;
     res.status(200).json({ "List of Reviews": books[isbn], message: username + " has updated their review" })
   
   } else {
     // Add new review
     books[isbn].reviews[username] = review;
     res.status(200).json({ "List of Reviews": books[isbn], message: "New review added by " + username })
  
   }


    res.status(200).json({ message: "Review added successfully" });
 } else {
    res.status(404).json({ message: "Book not found" });
 }
});


//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
   let isbn = req.params.isbn;       // Extract ISBN from URL parameters
   let username = req.user.data;     // Extract username from authenticated user
    // Check if the ISBN exists in books
   if (books.hasOwnProperty(isbn)) {
     // Check if the reviews object exists for this ISBN
     if (!books[isbn].hasOwnProperty('reviews')) {
       res.status(404).json({ message: "No reviews found for this book" });
     }
      // Check if the user has a review for this book
     if (books[isbn].reviews.hasOwnProperty(username)) {
       // Delete the review for this user
       delete books[isbn].reviews[username];
       res.status(200).json({ "List of Reviews": books[isbn], message: username + " has delete their review successfully" })
     } else {
       res.status(404).json({ message: "No review found for this user on this book" });
     }
   } else {
     // If ISBN not found, return 404 error
   res.status(404).json({ message: "Book not found" });
   }
 });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


