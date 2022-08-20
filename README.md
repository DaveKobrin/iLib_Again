# iLib_Again
A MongoDB / Node.js / Express.js Library management web app.

## Project Description
> Include:<br />
> General App Idea/Purpose<br />
Track media assets owned and location of said assets
> Models including field names and their datatypes<br />
User
* username - string, unique, required
* password - string, reqired
* type - string (normal(default), or admin(for stretch goals)) required(default - normal)

Book
* upc - string, unique
* title - string
* author - string

> A list of routes (e.g. `POST /pins/ allows users to post a picture of a pin`)<br />

## Wireframes
![landing](./wireframes/landing.png)
![books_index](./wireframes/books_index.png)
![books_new_show_edit](./wireframes/books_new_show_edit.png)

## User Stories
> User stories detailing app functionality<br />
> As a Normal User I want to be able to create a user account.
> As a Normal User I want to be able to edit my account / change password.
> As a Normal User I want to be able to browse the titles currently entered into my library database.
> As a Normal User I want to be able to add titles into my library database.
> As a Normal User I want to be able to edit the titles currently entered in my library database.
> As a Normal User I want to be able to delete titles from my database.

> As an Admin User I want to be able to browse the titles currently entered into the database for all users.
> As an Admin User I want to be unable to add titles into the database.
> As an Admin User I want to be able to edit and delete titles currently entered into the database for all users.

### MVP Goals
All Normal User type User Stories

### Stretch Goals
All Admin user type stories
look up title info from an online api based on the upc code entered or scanned into the page.
