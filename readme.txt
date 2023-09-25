Library Management System API
Welcome to the Library Management System API! This API allows you to manage books and borrowers in a library. You can perform actions like adding and updating books, registering borrowers, checking out and returning books, and more.

Base URL
The base URL for all API endpoints is http://localhost:3000.

Endpoints

Books
    Get All Books
        Endpoint: /books
        Method: GET
        Description: Get a list of all books in the library.
    Add a Book
        Endpoint: /books
        Method: POST
        Description: Add a new book to the library.
    Update a Book
        Endpoint: /books/:id
        Method: PUT
        Description: Update the details of a book.
    Delete a Book
        Endpoint: /books/:id
        Method: DELETE
        Description: Delete a book from the library.
    Search for a Book
        Endpoint: /books/search
        Method: GET
        Description: Search for books by title, author, or ISBN.
Borrowers
    Get All Borrowers
    Endpoint: /borrowers
    Method: GET
    Description: Get a list of all registered borrowers.
Register a Borrower
    Endpoint: /borrowers
    Method: POST
    Description: Register a new borrower.
Update Borrower's Details
    Endpoint: /borrowers/:id
    Method: PUT
    Description: Update the details of a borrower.
Borrowing Process
    Check Out a Book
        Endpoint: /borrowings
        Method: POST
        Description: Check out a book to a borrower.
    Return a Book
        Endpoint: /borrowings/:id
        Method: PUT
        Description: Return a borrowed book.
    List Books Currently Borrowed by a Borrower
        Endpoint: /borrowings/borrower/:borrowerId
        Method: GET
        Description: Get a list of books currently borrowed by a borrower.
    List Overdue Books
        Endpoint: /borrowings/overdue
        Method: GET
        Description: Get a list of overdue books. 

How to Run and Test Api
To use this API, you can make HTTP requests to the provided endpoints using a tool like Postman or by integrating the API into your application From Your Broweser.

For example, to add a new book, you can send a POST request to /books with the book details in the request body.


