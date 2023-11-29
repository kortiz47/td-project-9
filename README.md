# Treehouse Tech Degree Project 9

***Treehouse Tech Degree Project 9: REST API***

This project is going for Exceeds Expectations and is a REST API. This API provides a way for user to interact with the database to perform all CRUD (create, read, update, and delete) operations on courses data. Additionally, users will be required to log in to create a new account or retrieve information on existing accounts.

## How It's Made
**Tech Used:** JavaScript, Express, Node.js, Sequelize, SQL, SQLite3

**Additional Features:** This project is going for exceeds expectations, and a couple of added features are:

* **Ensure User Email is Valid and Unique** 
    * In the User Sequelize Model, additional validation was added to the emailAddress attribute (the 'unique' and 'isEmail') validations to ensure that an email added by the user is in the database only once and that the email is of a valid format.

* **Filter Out Extra Information** 
    * In the GET routes for users and courses, the createdAt and updatedAt attributes are filtered out so they are not visible to a user visiting those routes. Additionally, the password attribute is filtered out of the GET route for users.

* **Check if Current Auth User is Owner of Course** 
    * In the /api/courses/:id PUT and /api/courses/:id DELETE routes, conditionals were added to check if the currently authenticated user is or is not the owner of a requested course and they are unable to update or delete a course they are not the owner of.